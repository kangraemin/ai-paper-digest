import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { callGemma } from '../src/lib/gemma/client';
import { withRetry } from '../src/lib/utils/retry';
import { eq, and, isNotNull, or, isNull } from 'drizzle-orm';

const TRANSLATE_PROMPT = `You are a technical translator specializing in AI/ML content. Translate the following Korean fields to English.

Rules:
- Keep technical terms, model names (GPT-4, Llama, etc.), numbers, and code syntax in English
- For array fields: translate each string item naturally
- For oneLinerEn: Write EXACTLY ONE sentence, 15–30 words. Style: Ars Technica subheading.

  FIRST WORD must be a proper noun (Google, Claude, GPT-4) or a concrete plural noun (LLMs, AI agents). No other opener is acceptable.

  HARD RULES — violating ANY ONE means you must rewrite:
  1. More than one period (.) in the output → FAILED. Keep only the first sentence, fold extra info using commas/dashes.
  2. First word is "This" or "The" or "A" or "An" or "Researchers" → FAILED. Rewrite with a named subject.
  3. Contains "is a [type] for/that" → FAILED. Use an active verb instead.

  Bad → Good (memorize these transformations):
  "This framework measures uncertainty in multimodal LLMs by detecting queries likely to elicit wrong answers." → "Multimodal LLMs now flag their own likely-wrong answers and auto-route them to experts, no external tools needed."
  "This open-source MCP server resolves raw output bloating. It extends session durations by 6x." → "MCP Context Forge compresses 315KB tool outputs to 5.4KB, extending Claude session durations by 6x."
  "A vulnerability in legal AI SaaS exposed over 100,000 files. The issue was responsibly disclosed." → "Legal AI SaaS Filevine leaked 100,000+ confidential law firm files through an unauthenticated API endpoint."
  "Apple open-sources Parlor for real-time AI voice conversations. The project eliminates cloud costs." → "Apple open-sources Parlor, a real-time multimodal voice-and-video AI system running entirely on local Apple Silicon."
  "This guide details running Gemma 4 locally on macOS with LM Studio." → "Gemma 4 26B runs locally on macOS via LM Studio's CLI and plugs directly into Claude Code."
  "Multiple AI agents debating boost rare disease diagnosis. The collaboration significantly improves performance." → "AI agents debating in simulated MDT meetings boost rare disease diagnosis accuracy beyond standalone GPT-4."
  "Anthropic launches Claude Opus 4.6 with 1M tokens. The release introduces multi-agent team functionality." → "Claude Opus 4.6 ships with a 1M-token context window and multi-agent teams that outperform GPT-5.2 on several benchmarks."

  GOOD EXAMPLES (all start with a named subject, one sentence, no trailer):
  "Google releases Gemma 3 with 128K context, rivaling GPT-4 at half the cost."
  "LLM responses shrink 48% with a single system-prompt tweak."
  "Railway cut frontend build times from 10+ minutes to under 2 by migrating from Next.js to Vite."
  "GPT-4o convinces users of conspiracy theories as effectively as it debunks them — even OpenAI's guardrails can't prevent it."
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
