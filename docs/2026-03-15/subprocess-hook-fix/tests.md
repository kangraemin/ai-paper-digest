# TC: subprocess stop hook 비활성화 fix

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | tsc --noEmit 타입 체크 | 에러 없음 | ✅ |
| TC-02 | --settings 플래그로 stop hook 비활성화 | Stop hook 미발동, JSON 정상 반환 | ✅ |
| TC-03 | arxiv PDF로 summarizePaper 호출 (clean git) | titleKo, oneLiner 정상 출력 | ✅ |

## 실행출력

TC-01: `npx tsc --noEmit`
→ 출력 없음 (에러 없음)

TC-02: `echo "Say hello" | claude -p --model haiku --output-format json --settings '{"hooks":{...}}'`
→ result: Hey! Ready to help... is_error: False

TC-03: `npx tsx --env-file=.env -e "summarizePaper('Attention Is All You Need', '...', 'https://arxiv.org/pdf/1706.03762').then(r => console.log('성공:', r.titleKo, '|', r.oneLiner))"`
→ 성공: Attention Is All You Need: Transformer 아키텍처 | RNN/CNN 없이 Attention만으로 만든 Transformer가 번역 성능과 학습 속도 모두에서 기존 모델을 압도했다.
