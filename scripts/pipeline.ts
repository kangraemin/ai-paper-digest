import { execSync } from 'child_process';

const args = process.argv.slice(2).join(' ');

console.log('🚀 파이프라인 시작: 수집 → 요약\n');

console.log('=== [1/2] 수집 ===');
execSync(`npx tsx --env-file=.env scripts/bulk-collect.ts ${args}`, { stdio: 'inherit' });

console.log('\n=== [2/2] 요약 ===');
execSync('npx tsx --env-file=.env scripts/summarize.ts', { stdio: 'inherit' });

console.log('\n✅ 파이프라인 완료');
