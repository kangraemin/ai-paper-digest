| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | `,- ` 구분자 데이터가 배열로 분리됨 | `"- A,- B,- C"` → `["A", "B", "C"]` | ✅ |
| TC-02 | JSON 배열 데이터는 기존대로 파싱 | `'["a","b"]'` → `["a", "b"]` | ✅ |
| TC-03 | 개행 구분 데이터는 기존대로 파싱 | `"- X\n- Y"` → `["X", "Y"]` | ✅ |
| TC-04 | 빌드 성공 | `npm run build` 에러 없음 | ✅ |

## 실행출력

TC-01: `node -e` parseBulletList('- A,- B,- C')
→ ["A","B","C"] ✅

TC-02: `node -e` parseBulletList('["a","b"]')
→ ["a","b"] ✅

TC-03: `node -e` parseBulletList('- X\n- Y')
→ ["X","Y"] ✅

TC-04: `npm run build`
→ 빌드 성공, /papers/[id] 2.43 kB 정상 출력
