/**
 * 번역 프롬프트 테스트 스크립트
 * - DB에서 랜덤 100개 뽑기 (SELECT만, 절대 DB 쓰기 없음)
 * - 현재 translate.ts의 TRANSLATE_PROMPT로 Gemma 직접 호출
 * - one_liner, key_findings, how_to_apply, target_audience, evidence 전부 포함
 * - 결과를 .claude/ralph-x-runs/translate-prompt-fix/samples.json에 저장
 */
import { createClient } from '@libsql/client';
import { callGemma } from '../src/lib/gemma/client';
import { withRetry } from '../src/lib/utils/retry';
import fs from 'fs';

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const TRANSLATE_PROMPT = `You are a technical translator specializing in AI/ML content. Translate the following Korean fields to English.

Rules:
- Keep technical terms, model names (GPT-4, Llama, etc.), numbers, and code syntax in English
- For array fields: translate each string item naturally
- For oneLinerEn: Write like a native English tech journalist, NOT a Korean-to-English translator.
  NEVER start with "This is a/an..." or "This is a case where...".
  Lead with the key finding, metric, release, or action. Max 2 sentences.
  Good: "Google releases Gemma 3 with 128K context, rivaling GPT-4 at half the cost"
  Good: "LLM responses shrink 48% with a single system-prompt tweak"
  Bad: "This is a case where Google released a new model called Gemma 3"
  Bad: "This is an experimental demonstration showing that LLM responses can be reduced"
- For glossaryEn: MUST return a plain JSON object {"term": "description", ...}. Do NOT return an array. Translate values only, keep keys as-is.
- For tagsEn: translate Korean tags to English
- For codeExampleEn: translate Korean comments only, keep code syntax unchanged. If empty string, return empty string.
- For relatedResourcesEn: if array of URL strings, return as-is. If objects with title field, translate only the title.
- If a field is empty string or null, return empty string for that field.

Input JSON (only the fields that need translation):
{input}

Return ONLY valid JSON with exactly these keys (no more, no less):
{outputKeys}`;

async function main() {
  const result = await db.execute({
    sql: `SELECT id, title, one_liner, key_findings, how_to_apply, target_audience, evidence
          FROM papers
          WHERE summarized_at IS NOT NULL AND one_liner IS NOT NULL
          ORDER BY RANDOM() LIMIT 50`,
    args: [],
  });

  const BATCH = 3; // 병렬 처리 배치 크기 (Gemma rate limit 고려)
  console.log(`📋 ${result.rows.length}개 샘플 뽑음 (${BATCH}개씩 병렬 처리)`);

  const samples: Array<Record<string, unknown>> = [];
  let done = 0;

  async function translateRow(row: typeof result.rows[0], idx: number): Promise<Record<string, unknown>> {
    const id = String(row.id);
    const title = String(row.title);
    try {
      const input: Record<string, unknown> = {
        oneLiner: row.one_liner || '',
        targetAudience: row.target_audience || '',
        keyFindings: row.key_findings ? JSON.parse(String(row.key_findings)) : [],
        evidence: row.evidence ? JSON.parse(String(row.evidence)) : [],
        howToApply: row.how_to_apply ? JSON.parse(String(row.how_to_apply)) : [],
      };

      const outputKeys = JSON.stringify({
        oneLinerEn: '',
        targetAudienceEn: '',
        keyFindingsEn: [],
        evidenceEn: [],
        howToApplyEn: [],
      });

      const prompt = TRANSLATE_PROMPT
        .replace('{input}', JSON.stringify(input, null, 2))
        .replace('{outputKeys}', outputKeys);

      const raw = await withRetry(() => callGemma(prompt), { label: `test:${id}`, retries: 2 });
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('JSON 파싱 실패');
      const parsed = JSON.parse(jsonMatch[0]);

      done++;
      process.stdout.write(`[${done}/${result.rows.length}] ✅ ${title.slice(0, 50)}\n`);
      return {
        id, title,
        ko: { oneLiner: input.oneLiner, keyFindings: input.keyFindings, howToApply: input.howToApply },
        en: {
          oneLinerEn: parsed.oneLinerEn ?? '',
          targetAudienceEn: parsed.targetAudienceEn ?? '',
          keyFindingsEn: parsed.keyFindingsEn ?? [],
          evidenceEn: parsed.evidenceEn ?? [],
          howToApplyEn: parsed.howToApplyEn ?? [],
        },
      };
    } catch (e) {
      done++;
      process.stdout.write(`[${done}/${result.rows.length}] ❌ ${title.slice(0, 50)}: ${e}\n`);
      return { id, title, error: String(e) };
    }
  }

  // BATCH개씩 병렬 처리 + 배치 사이 딜레이
  for (let i = 0; i < result.rows.length; i += BATCH) {
    const batch = result.rows.slice(i, i + BATCH);
    const results = await Promise.all(batch.map((row, j) => translateRow(row, i + j)));
    samples.push(...results);
    if (i + BATCH < result.rows.length) await new Promise(r => setTimeout(r, 1000));
  }

  const outPath = '.claude/ralph-x-runs/translate-prompt-fix/samples.json';
  fs.writeFileSync(outPath, JSON.stringify(samples, null, 2));
  console.log(`\n✅ 저장 완료: ${outPath} (${samples.filter(s => !s.error).length}개 성공 / ${samples.length}개 시도)`);
}

main().catch(console.error);
