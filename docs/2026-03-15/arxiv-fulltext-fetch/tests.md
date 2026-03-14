# TC: arxiv PDF fetch 추가

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | pdf-parse 설치 확인 | node_modules에 pdf-parse 존재 | ✅ |
| TC-02 | fetchPdfText() - 실제 arxiv PDF fetch | 텍스트 1000자 이상 반환 | ✅ |
| TC-03 | prompts.ts {content} 교체 | {abstract} 없고 {content} 존재 | ✅ |
| TC-04 | client.ts - claude -p CLI 방식 확인 | Anthropic SDK import 없음, spawn 사용 | ✅ |
| TC-05 | tsc --noEmit 타입 체크 통과 | 에러 없음 | ✅ |

## 실행출력

TC-01: `ls node_modules/pdf-parse`
→ pdf-parse 설치 확인 ✅

TC-02: `node -e "const { PDFParse } = require('pdf-parse'); ..."`
→ 길이: 39968 자 (Attention Is All You Need, arxiv:1706.03762) ✅

TC-03: `grep '{abstract}' src/lib/claude/prompts.ts`
→ 없음. `grep '{content}'` → 52번 줄 존재 ✅

TC-04: `grep 'anthropic' src/lib/claude/client.ts`
→ 없음. `grep 'spawn'` → 1번, 8번 줄 존재 ✅

TC-05: `npx tsc --noEmit`
→ 출력 없음 (에러 없음) ✅
