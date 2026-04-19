import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { callGemma } from '../src/lib/gemma/client';
import { withRetry } from '../src/lib/utils/retry';
import { eq, and, isNotNull, or, isNull } from 'drizzle-orm';

const REWRITE_PROMPT = `Rewrite this one-liner as a single Ars Technica headline sentence.

CRITICAL — your first word decides pass/fail:
✅ ALLOWED first words: product names (GPT-4, Claude, Llama), company names (Google, OpenAI, Meta), person names, specific concept names (LoRA, RLHF, RAG)
❌ BANNED first words: A, An, The, This, These, Researchers, Research — instant fail

ONE sentence only. One period at the end. Nothing after it.

Pattern: [Named subject] [active verb] [concrete result with numbers if available].

BAD → GOOD:
- "A token pruning framework reduces compute by 40%..." → "FastPrune cuts multimodal LLM compute by 40% without accuracy loss."
- "This framework measures uncertainty in multimodal LLMs..." → "UncertaintyBench probes multimodal LLM confidence, flagging unreliable outputs before deployment."
- "Researchers demonstrate an RL-based agent..." → "WebAgent surpasses state-of-the-art GUI manipulation using RL with only 0.02% of typical training data."
- "A comprehensive survey reveals current LLM limitations..." → "GPT-4 and Claude still fail at multi-step reasoning, scoring below 40% on compositional benchmarks."
- "A new sparse attention mechanism based on Fourier filtering selectively attends..." → "FourierAttention selectively filters attention heads via Fourier analysis, cutting transformer memory 60%."
- "A new programming language co-designed with LLMs features deterministic semantics..." → "Lex ships deterministic semantics co-designed with LLMs for predictable code generation."
- "Hypura is a Rust-based open-source project that enables running LLMs larger than physical memory." → "Hypura runs LLMs larger than a Mac's physical RAM by swapping layers to disk in Rust."

Input: {input}
Output:`;

function truncateToOneSentence(text: string): string {
  const match = text.match(/^(.+?\.)\s+[A-Z]/);
  return match ? match[1] : text;
}

function needsOneLinerFix(text: string): boolean {
  if (/\.\s+[A-Z]/.test(text)) return true;
  if (/^(This |The |A |An |Researchers |Research )/.test(text)) return true;
  if (/\bis an? [\w\s-]+ (that|for|which) /i.test(text)) return true;
  return false;
}

function cleanRewriteOutput(raw: string): string {
  return raw.trim().replace(/^["']|["']$/g, '').replace(/^Output:\s*/i, '');
}

async function fixOneLiner(text: string): Promise<string> {
  if (!needsOneLinerFix(text)) return text;

  const prompt = REWRITE_PROMPT.replace('{input}', text);
  const raw = await withRetry(() => callGemma(prompt), { label: 'fix-oneliner', retries: 2 });
  let fixed = truncateToOneSentence(cleanRewriteOutput(raw));

  if (!needsOneLinerFix(fixed)) return fixed;

  if (/^(A |An |The |This |Researchers )/.test(fixed)) {
    const raw2 = await withRetry(() => callGemma(REWRITE_PROMPT.replace('{input}', fixed)), { label: 'fix-oneliner-retry', retries: 1 });
    const fixed2 = truncateToOneSentence(cleanRewriteOutput(raw2));
    if (!needsOneLinerFix(fixed2)) return fixed2;
    fixed = fixed2;
  }

  const truncated = truncateToOneSentence(text);
  if (!needsOneLinerFix(truncated)) return truncated;

  return fixed;
}

const TRANSLATE_PROMPT = `You are a technical translator specializing in AI/ML content. Translate the following Korean fields to English.

Rules:
- Keep technical terms, model names (GPT-4, Llama, etc.), numbers, and code syntax in English
- For array fields: translate each string item naturally
- For oneLinerEn: One sentence, Ars Technica headline style. Start with a named subject (product name, company, or specific concept), then active verb, then concrete result. Never start with "This", "A/An", "The", or "Researchers".
  Good: "Google releases Gemma 3 with 128K context, rivaling GPT-4 at half the cost."
  Good: "Claude Opus 4.6 ships with a 1M-token context window and multi-agent teams that outperform GPT-5.2 on several benchmarks."
- For glossaryEn: MUST return a plain JSON object {"term": "description", ...}. Do NOT return an array. Translate values only, keep keys as-is.
- For tagsEn: translate Korean tags to English (e.g., "프롬프트엔지니어링"→"Prompt Engineering", "RAG"→"RAG", "에이전트"→"Agent", "파인튜닝"→"Fine-tuning", "추론최적화"→"Inference Optimization", "양자화"→"Quantization", "캐싱"→"Caching", "평가"→"Evaluation", "벤치마크"→"Benchmark", "보안"→"Security", "프롬프트인젝션"→"Prompt Injection", "코드생성"→"Code Generation", "멀티모달"→"Multimodal", "임베딩"→"Embedding", "벡터검색"→"Vector Search", "청킹"→"Chunking", "함수호출"→"Function Calling", "도구사용"→"Tool Use", "MCP"→"MCP", "LoRA"→"LoRA", "RLHF"→"RLHF", "레드팀"→"Red Teaming", "프라이버시"→"Privacy")
- For codeExampleEn: translate Korean comments only, keep code syntax unchanged. If empty string, return empty string.
- For relatedResourcesEn: if array of URL strings, return as-is. If objects with title field, translate only the title.
- If a field is empty string or null, return empty string for that field.

Input JSON (only the fields that need translation):
{input}

Return ONLY valid JSON with exactly these keys (no more, no less):
{outputKeys}`;

async function main() {
  const limit = parseInt(process.env.TRANSLATE_LIMIT ?? '15');
  const offset = parseInt(process.env.TRANSLATE_OFFSET ?? '0');

  const untranslated = await db.select()
    .from(papers)
    .where(and(
      isNotNull(papers.summarizedAt),
      or(
        isNull(papers.oneLinerEn),
        isNull(papers.codeExampleEn),
        isNull(papers.relatedResourcesEn),
      )
    ))
    .limit(limit)
    .offset(offset);

  console.log(`🌐 ${untranslated.length} papers to translate`);
  if (untranslated.length === 0) return;

  let done = 0;
  for (const p of untranslated) {
    try {
      // 누락된 필드만 파악
      const missing = {
        oneLiner: p.oneLinerEn === null,
        targetAudience: p.targetAudienceEn === null,
        keyFindings: p.keyFindingsEn === null,
        evidence: p.evidenceEn === null,
        howToApply: p.howToApplyEn === null,
        glossary: p.glossaryEn === null,
        tags: p.tagsEn === null,
        codeExample: p.codeExampleEn === null,
        relatedResources: p.relatedResourcesEn === null,
      };

      // 누락된 필드만 input에 포함
      const input: Record<string, unknown> = {};
      if (missing.oneLiner) input.oneLiner = p.oneLiner || '';
      if (missing.targetAudience) input.targetAudience = p.targetAudience || '';
      if (missing.keyFindings) input.keyFindings = p.keyFindings ? JSON.parse(p.keyFindings) : [];
      if (missing.evidence) input.evidence = p.evidence ? JSON.parse(p.evidence) : [];
      if (missing.howToApply) input.howToApply = p.howToApply ? JSON.parse(p.howToApply) : [];
      if (missing.glossary) input.glossary = p.glossary ? JSON.parse(p.glossary) : {};
      if (missing.tags) input.tags = p.tags ? JSON.parse(p.tags) : [];
      if (missing.codeExample) input.codeExample = p.codeExample || '';
      if (missing.relatedResources) input.relatedResources = p.relatedResources ? JSON.parse(p.relatedResources) : [];

      // 요청할 output key 목록 (input key + En suffix)
      const outputKeys = JSON.stringify(
        Object.fromEntries(
          Object.entries(input).map(([k]) => [`${k}En`, k === 'glossary' ? {} : k.endsWith('s') && k !== 'tags' ? [] : ''])
        ),
        null, 2
      );

      const prompt = TRANSLATE_PROMPT
        .replace('{input}', JSON.stringify(input, null, 2))
        .replace('{outputKeys}', outputKeys);

      const raw = await withRetry(() => callGemma(prompt), { label: `translate:${p.id}`, retries: 2 });
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Failed to parse translation response');
      let result;
      try { result = JSON.parse(jsonMatch[0]); }
      catch { throw new Error(`Invalid JSON from Gemma: ${jsonMatch[0].slice(0, 100)}`); }

      // oneLinerEn 후처리: 어색한 패턴 감지 → 재작성
      if (missing.oneLiner && result.oneLinerEn) {
        result.oneLinerEn = await fixOneLiner(result.oneLinerEn);
      }

      // 누락됐던 필드만 업데이트
      const update: Record<string, string> = {};
      if (missing.oneLiner && result.oneLinerEn !== undefined) update.oneLinerEn = result.oneLinerEn;
      if (missing.targetAudience && result.targetAudienceEn !== undefined) update.targetAudienceEn = result.targetAudienceEn;
      if (missing.keyFindings && result.keyFindingsEn !== undefined) update.keyFindingsEn = JSON.stringify(result.keyFindingsEn);
      if (missing.evidence && result.evidenceEn !== undefined) update.evidenceEn = JSON.stringify(result.evidenceEn);
      if (missing.howToApply && result.howToApplyEn !== undefined) update.howToApplyEn = JSON.stringify(result.howToApplyEn);
      if (missing.glossary && result.glossaryEn !== undefined) update.glossaryEn = JSON.stringify(result.glossaryEn);
      if (missing.tags && result.tagsEn !== undefined) update.tagsEn = JSON.stringify(result.tagsEn);
      if (missing.codeExample && result.codeExampleEn !== undefined) update.codeExampleEn = result.codeExampleEn;
      if (missing.relatedResources && result.relatedResourcesEn !== undefined) update.relatedResourcesEn = JSON.stringify(result.relatedResourcesEn);

      if (Object.keys(update).length > 0) {
        await db.update(papers).set(update).where(eq(papers.id, p.id));
      }

      const missingFields = Object.entries(missing).filter(([, v]) => v).map(([k]) => k).join(', ');
      done++;
      console.log(`[${done}/${untranslated.length}] ✅ ${p.title?.slice(0, 50)} (translated: ${missingFields})`);
    } catch (e) {
      console.error(`❌ ${p.id}:`, e);
    }
  }

  console.log(`✅ Done ${done}/${untranslated.length}`);
}

main().catch(console.error);
