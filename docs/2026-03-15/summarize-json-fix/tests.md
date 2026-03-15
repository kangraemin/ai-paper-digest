# TC: summarizePaper JSON 파싱 실패 fix

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | prompts.ts에 paper_content XML 태그 존재 | `<paper_content>` 포함 | ✅ |
| TC-02 | tsc --noEmit 타입 체크 | 에러 없음 | ✅ |
| TC-03 | arxiv PDF 전문으로 summarizePaper 호출 | titleKo, oneLiner 정상 출력 | ✅ |

## 실행출력

TC-01: `grep -n 'paper_content' src/lib/claude/prompts.ts`
→ 52:<paper_content> / 54:</paper_content>

TC-02: `npx tsc --noEmit`
→ 출력 없음 (에러 없음)

TC-03: `npx tsx --env-file=.env -e "summarizePaper('Attention Is All You Need', '...', 'https://arxiv.org/pdf/1706.03762').then(r => console.log(r.titleKo, r.oneLiner))"`
→ 성공: Attention Is All You Need: Transformer 아키텍처 | RNN/CNN 없이 Self-Attention만으로 번역 SOTA를 달성한, 현대 LLM의 근간이 되는 Transformer 논문.
