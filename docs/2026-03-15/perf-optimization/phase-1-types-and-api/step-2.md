# Step 2: /api/papers 라우트 수정

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | source 파라미터 지원 | `source=community` → hacker_news 필터, `source=papers` → not hacker_news 필터 코드 존재 | ✅ |
| TC-02 | 컬럼 프로젝션 적용 | `db.select({...})` 형태로 12개 필드만 선택 (select() 전체 선택 아님) | ✅ |
| TC-03 | hasMore 필드 반환 | 응답에 `hasMore: page * limit < total` 포함 | ✅ |
| TC-04 | Cache-Control 헤더 | `s-maxage=3600, stale-while-revalidate=86400` 포함 | ✅ |
| TC-05 | `not` import 추가 | `import { ... not ... } from 'drizzle-orm'` | ✅ |
| TC-06 | 빌드 성공 | `npx tsc --noEmit` 에러 없음 | ✅ |

## 실행출력

TC-01: 코드 확인 — source 파라미터 추출 (line 10), community/papers 분기 (lines 18-22)
→ `eq(papers.source, 'hacker_news')` / `not(eq(papers.source, 'hacker_news'))` 확인

TC-02: 코드 확인 — `db.select({...})` 형태로 12개 필드 명시 (lines 38-51)
→ id, title, titleKo, oneLiner, aiCategory, devRelevance, targetAudience, tags, source, isHot, publishedAt, authors

TC-03: 코드 확인 — line 65
→ `hasMore: page * limit < total` 포함 확인

TC-04: 코드 확인 — line 66
→ `'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'` 포함 확인

TC-05: 코드 확인 — line 3
→ `import { desc, eq, not, and, gte, lt, sql, isNotNull } from 'drizzle-orm'` 확인

TC-06: `npx tsc --noEmit`
→ 에러 없이 성공 (출력 없음)
