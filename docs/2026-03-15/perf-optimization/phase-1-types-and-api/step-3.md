# Step 3: /api/trends Cache-Control 헤더 추가

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | Cache-Control 헤더 존재 | `s-maxage=3600, stale-while-revalidate=86400` 포함 | ✅ |
| TC-02 | 기존 응답 구조 유지 | `{ period, data: trendData }` 그대로 | ✅ |
| TC-03 | 빌드 성공 | `npx tsc --noEmit` 에러 없음 | ✅ |

## 실행출력

TC-01: `grep -n 'Cache-Control' src/app/api/trends/route.ts` 로 헤더 확인
→ `21:    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }`
→ ✅ `s-maxage=3600, stale-while-revalidate=86400` 포함 확인

TC-02: 코드 리뷰로 확인 — `NextResponse.json`의 첫 번째 인자가 `{ period, data: trendData }`로 변경 없음 (line 20)
→ ✅ 기존 응답 구조 유지

TC-03: `npx tsc --noEmit`
→ 출력 없음 (에러 0건)
→ ✅ 빌드 성공
