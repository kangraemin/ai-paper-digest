/**
 * 번역 프롬프트 테스트 스크립트
 * - DB에서 랜덤 100개 one_liner 뽑기 (SELECT만, 절대 DB 쓰기 없음)
 * - 현재 translate.ts의 TRANSLATE_PROMPT로 Gemma 직접 호출
 * - 결과를 .claude/ralph-x-runs/translate-prompt-fix/samples.json에 저장
 */
import { createClient } from '@libsql/client';
import { callGemma } from '../src/lib/gemma/client';

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
- If a field is empty string or null, return empty string for that field.

Input JSON (only the fields that need translation):
{input}

Return ONLY valid JSON with exactly these keys (no more, no less):
{outputKeys}`;

async function main() {
  // 랜덤 100개 SELECT (DB 쓰기 없음)
  const result = await db.execute({
    sql: `SELECT id, title, one_liner FROM papers
          WHERE summarized_at IS NOT NULL AND one_liner IS NOT NULL
          ORDER BY RANDOM() LIMIT 100`,
    args: [],
  });

  console.log(`📋 ${result.rows.length}개 샘플 뽑음`);

  const samples: Array<{
    id: string;
    title: string;
    one_liner_ko: string;
    one_liner_en: string;
    error?: string;
  }> = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows[i];
    const id = String(row.id);
    const title = String(row.title);
    const one_liner_ko = String(row.one_liner);

    try {
      const input = { oneLiner: one_liner_ko };
      const outputKeys = JSON.stringify({ oneLinerEn: '' });
      const prompt = TRANSLATE_PROMPT
        .replace('{input}', JSON.stringify(input, null, 2))
        .replace('{outputKeys}', outputKeys);

      const raw = await callGemma(prompt);
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('JSON 파싱 실패');
      const parsed = JSON.parse(jsonMatch[0]);

      samples.push({ id, title, one_liner_ko, one_liner_en: parsed.oneLinerEn ?? '' });
      process.stdout.write(`[${i + 1}/100] ✅ ${title.slice(0, 40)}\n`);
    } catch (e) {
      samples.push({ id, title, one_liner_ko, one_liner_en: '', error: String(e) });
      process.stdout.write(`[${i + 1}/100] ❌ ${title.slice(0, 40)}\n`);
    }
  }

  // 파일로만 저장 (DB 건드리지 않음)
  const fs = await import('fs');
  const outPath = '.claude/ralph-x-runs/translate-prompt-fix/samples.json';
  fs.writeFileSync(outPath, JSON.stringify(samples, null, 2));
  console.log(`\n✅ 저장 완료: ${outPath}`);
}

main().catch(console.error);
