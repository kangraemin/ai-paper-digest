// 녹화된 번역 결과(samples.json)에 규칙 후처리를 적용해 전/후 어색함 비율을 낸다. API 호출 없음.
// 실행: node scripts/eval-oneliner-recorded.ts [samples.json] [--dump]
import fs from 'fs';
import { ruleFixOneLiner, awkwardReasons } from '../src/lib/translate/one-liner-fix.ts';

const file = process.argv[2]?.endsWith('.json') ? process.argv[2] : '.claude/ralph-x-runs/translate-prompt-fix/samples.json';
const dump = process.argv.includes('--dump');
const samples = JSON.parse(fs.readFileSync(file, 'utf8'));
let before = 0, after = 0;
for (const s of samples) {
  const raw: string = s.en.oneLinerEn;
  const fixed = ruleFixOneLiner(raw, s.title);
  const rb = awkwardReasons(raw), ra = awkwardReasons(fixed);
  if (rb.length) before++;
  if (ra.length) after++;
  if (dump) console.log(`[${s.id}] ${rb.join(',') || 'ok'} -> ${ra.join(',') || 'ok'}\n   ${fixed}`);
}
const n = samples.length;
console.log(`n=${n} 검사기 기준 어색함: 전 ${before}/${n} -> 후 ${after}/${n}`);
