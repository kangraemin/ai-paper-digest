# Step 2: hot-scorer 실무 키워드 교체

## TC

| TC ID | 검증 항목 | 검증 방법 | 기대 결과 | 상태 |
|-------|----------|----------|----------|------|
| TC-01 | BUZZ_KEYWORDS 실무 키워드로 교체 | grep으로 키워드 목록 확인 | prompting, RAG, tool use, fine-tuning 등 실무 키워드 | ⬜ |
| TC-02 | 범용 키워드 제거 | grep으로 확인 | scaling, SOTA, state-of-the-art 제거됨 | ⬜ |
| TC-03 | TypeScript 컴파일 통과 | `npx tsc --noEmit` | 에러 0 | ⬜ |

## 실행출력

