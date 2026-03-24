import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { runClaude } from '../src/lib/claude/runner';
import { eq, isNull, and, isNotNull } from 'drizzle-orm';

const TRANSLATE_PROMPT = `You are a technical translator specializing in AI/ML content. Translate the following Korean fields to English.

Rules:
- Keep technical terms, model names (GPT-4, Llama, etc.), numbers, and code syntax in English
- For keyFindingsEn/evidenceEn/howToApplyEn: translate each string in the array naturally
- For glossaryEn: translate values only, keep keys as-is (they're already English terms)
- For tagsEn: translate Korean tags to English (e.g., "프롬프트엔지니어링"→"Prompt Engineering", "RAG"→"RAG", "에이전트"→"Agent", "파인튜닝"→"Fine-tuning", "추론최적화"→"Inference Optimization", "양자화"→"Quantization", "캐싱"→"Caching", "평가"→"Evaluation", "벤치마크"→"Benchmark", "보안"→"Security", "프롬프트인젝션"→"Prompt Injection", "코드생성"→"Code Generation", "멀티모달"→"Multimodal", "임베딩"→"Embedding", "벡터검색"→"Vector Search", "청킹"→"Chunking", "함수호출"→"Function Calling", "도구사용"→"Tool Use", "MCP"→"MCP", "LoRA"→"LoRA", "RLHF"→"RLHF", "레드팀"→"Red Teaming", "프라이버시"→"Privacy")
- For codeExampleEn: translate Korean comments only (lines starting with # or // with Korean), keep code syntax unchanged. If empty string, return empty string.
- For relatedResourcesEn: if array of URL strings, return as-is. If objects with title field, translate only the title. Return same JSON structure.
- If a field is empty string or null, return empty string for that field.

Input JSON:
{input}

Return ONLY valid JSON with these exact keys:
{
  "oneLinerEn": "...",
  "targetAudienceEn": "...",
  "keyFindingsEn": [...],
  "evidenceEn": [...],
  "howToApplyEn": [...],
  "glossaryEn": {...},
  "tagsEn": [...],
  "codeExampleEn": "...",
  "relatedResourcesEn": [...]
}`;

interface TranslationResult {
  oneLinerEn: string;
  targetAudienceEn: string;
  keyFindingsEn: string[];
  evidenceEn: string[];
  howToApplyEn: string[];
  glossaryEn: Record<string, string>;
  tagsEn: string[];
  codeExampleEn: string;
  relatedResourcesEn: unknown[];
}

async function main() {
  const untranslated = await db.select()
    .from(papers)
    .where(and(isNotNull(papers.summarizedAt), isNull(papers.oneLinerEn)))
    .limit(10);

  console.log(`🌐 ${untranslated.length} papers to translate`);
  if (untranslated.length === 0) return;

  let done = 0;
  for (const p of untranslated) {
    try {
      const input = {
        oneLiner: p.oneLiner || '',
        targetAudience: p.targetAudience || '',
        keyFindings: p.keyFindings ? JSON.parse(p.keyFindings) : [],
        evidence: p.evidence ? JSON.parse(p.evidence) : [],
        howToApply: p.howToApply ? JSON.parse(p.howToApply) : [],
        glossary: p.glossary ? JSON.parse(p.glossary) : {},
        tags: p.tags ? JSON.parse(p.tags) : [],
        codeExample: p.codeExample || '',
        relatedResources: p.relatedResources ? JSON.parse(p.relatedResources) : [],
      };

      const prompt = TRANSLATE_PROMPT.replace('{input}', JSON.stringify(input, null, 2));
      const raw = await runClaude(prompt, { model: 'sonnet', timeout: 120000, jsonOutput: true });

      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('Failed to parse translation response');
      const result: TranslationResult = JSON.parse(jsonMatch[0]);

      await db.update(papers).set({
        oneLinerEn: result.oneLinerEn,
        targetAudienceEn: result.targetAudienceEn,
        keyFindingsEn: JSON.stringify(result.keyFindingsEn),
        evidenceEn: JSON.stringify(result.evidenceEn),
        howToApplyEn: JSON.stringify(result.howToApplyEn),
        glossaryEn: JSON.stringify(result.glossaryEn),
        tagsEn: JSON.stringify(result.tagsEn),
        codeExampleEn: result.codeExampleEn,
        relatedResourcesEn: JSON.stringify(result.relatedResourcesEn),
      }).where(eq(papers.id, p.id));

      done++;
      console.log(`[${done}/${untranslated.length}] ✅ ${p.title?.slice(0, 60)}`);
    } catch (e) {
      console.error(`❌ ${p.id}:`, e);
    }
  }

  console.log(`✅ Done ${done}/${untranslated.length}`);
}

main().catch(console.error);
