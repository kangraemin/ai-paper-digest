# TC

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | types.ts glossary + tags 필드 | Record<string,string>, string[] 타입 존재 | ✅ |
| TC-02 | schema.ts glossary + tags 컬럼 | nullable text 컬럼 2개 추가 | ✅ |
| TC-03 | prompts.ts 용어사전 + 태그 + 관련도 기준 | glossary/tags/devRelevance 지시 포함 | ✅ |
| TC-04 | summarize-local.ts 새 필드 저장 | glossary, tags JSON.stringify로 저장 | ✅ |
| TC-05 | papers/[id]/page.tsx 용어사전 렌더링 | glossary 섹션 + tags Badge 표시 | ✅ |
| TC-06 | paper-card.tsx tags 표시 | tags prop + Badge 렌더링 | ✅ |
| TC-07 | tsc --noEmit 에러 0 | 에러 0 | ✅ |

## 실행출력

TC-01: types.ts 확인
→ glossary: Record<string, string>, tags: string[] 필드 존재

TC-02: schema.ts 확인
→ glossary: text('glossary'), tags: text('tags') 컬럼 추가

TC-03: prompts.ts 확인
→ 9. glossary (용어사전, 최소3~최대8개), 10. tags (한글 태그, 1~4개), 12. devRelevance (5단계 기준 명확화)

TC-04: summarize-local.ts 확인
→ glossary: JSON.stringify(r.glossary), tags: JSON.stringify(r.tags) 저장

TC-05: page.tsx 확인
→ glossary JSON.parse → dl/dt/dd 렌더링, tags Badge 표시

TC-06: paper-card.tsx 확인
→ tags prop 추가, 최대 3개 태그 Badge 렌더링

TC-07: npx tsc --noEmit + npm run build
→ 에러 0, 빌드 성공
