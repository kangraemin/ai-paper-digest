import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { callGemma } from '../src/lib/gemma/client';
import { withRetry } from '../src/lib/utils/retry';
import { eq, and, isNotNull, or, isNull } from 'drizzle-orm';

const TRANSLATE_PROMPT = `You are a technical translator specializing in AI/ML content. Translate the following Korean fields to English.

Rules:
- Keep technical terms, model names (GPT-4, Llama, etc.), numbers, and code syntax in English
- For array fields: translate each string item naturally
- For oneLinerEn: Write like an Ars Technica subheading. EXACTLY ONE sentence — never two. A period followed by more text is always wrong.

  MANDATORY STRUCTURE: [WHO or WHAT] + [ACTIVE VERB] + [CONCRETE RESULT/FINDING]
  The subject must be a specific entity (company, model, technique name, concrete noun like "LLMs") — never "a method", "a framework", "a study", "a developer", "this project", "this tool".
  The verb must be finite and active (present or past tense): "cuts", "reveals", "achieves", "outperforms", "reduces", "built", "found".
  Pack multiple details into one sentence using dashes, commas, or subordinate clauses — never by appending a second sentence.

  SELF-CHECK before outputting oneLinerEn — reject your draft if ANY of these are true:
  (1) It contains more than one sentence (count the periods — only one allowed, at the very end)
  (2) It has no finite verb (just a noun phrase like "A technique for X" or "Compressing X by Y")
  (3) The first word is "This" or "The" or "Researchers"
  (4) The first two words match: "A/An [adjective]", "A/An [role]", "A/An [content-type]" (e.g. "A comprehensive", "A developer", "A post", "A study", "A vulnerability")
  (5) It defines what something IS instead of what it DOES/FOUND ("X is a tool for..." → bad)
  (6) The subject is vague: "a method", "a novel approach", "a study", "a new benchmark", "researchers"
  (7) It ends with a generic editorial clause ("This highlights...", "This demonstrates...", "It serves as...", "This is significant...")
  If any check fails, REWRITE starting with the actual finding, metric, or named entity.

  REWRITE EXAMPLES (Bad → Fixed):
  "This project connects an LLM to Animal Crossing" → "An LLM now powers Animal Crossing NPC dialogue on a 24-year-old GameCube via memory sharing, no code mods needed"
  "A novel method identifies when LLMs should abstain" → "Reverse-engineering an LLM's reasoning trace reveals when it answered a different question than asked"
  "Researchers discovered an HSL color structure within FLUX.1's latent space" → "FLUX.1's latent space contains an HSL color structure that enables direct color control during image generation without additional training"
  "STELLAR is a testing framework that automatically uncovers bugs" → "STELLAR finds 2.5x more failure cases in LLM apps than conventional testing by using evolutionary algorithms"
  "A comprehensive survey paper consolidates optimization techniques" → "Every major LLM agent optimization technique — fine-tuning, RL, prompt engineering — mapped in one survey"
  "AGENTS.md, a project guide for AI coding agents, is already in use" → "Over 60,000 open-source projects now use AGENTS.md to give AI coding agents project-specific instructions"

  TWO-SENTENCE → ONE-SENTENCE compression examples:
  "Anthropic demonstrates backdoors can be implanted in LLMs with just 250 documents. The research overturns conventional assumptions about model size." → "Anthropic shows backdoors can be implanted in any LLM from 600M to 13B parameters with just 250 malicious documents, regardless of model size or training data volume"
  "Zed editor now executes Claude Code directly, bypassing the terminal. This is significant as it aims for a common protocol." → "Zed editor executes Claude Code directly via ACP, an open standard aiming to connect any AI agent to any editor without terminal intermediaries"
  "Atuin v18.13 launches with fuzzy search and AI-powered bash generation. The update significantly enhances usability." → "Atuin v18.13 launches with in-memory fuzzy search, a PTY proxy for improved rendering, and AI-powered bash command generation"

  GOOD OPENERS for reference:
  "Google releases Gemma 3 with 128K context, rivaling GPT-4 at half the cost"
  "LLM responses shrink 48% with a single system-prompt tweak"
  "Railway cut frontend build times from 10+ minutes to under 2 by migrating from Next.js to Vite"
  "Giving Claude Code 16 GPUs yielded 910 experiments in 8 hours, improving validation loss by 2.87%"
  "Only 6 out of 15 MCP servers proved useful after 3 months of real Claude Code usage"
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
