# TC: summarizePaper JSON 파싱 실패 fix

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | prompts.ts에 paper_content XML 태그 존재 | `<paper_content>` 포함 | ⬜ |
| TC-02 | tsc --noEmit 타입 체크 | 에러 없음 | ⬜ |
| TC-03 | arxiv PDF 전문으로 summarizePaper 호출 | titleKo, oneLiner 정상 출력 | ⬜ |

## 실행출력
