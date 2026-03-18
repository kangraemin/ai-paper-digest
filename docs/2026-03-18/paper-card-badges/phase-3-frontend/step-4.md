# Step 4: paper-feed.tsx 뒤로가기 버그 수정 + venue/affiliations props 전달

## 변경 파일
- `src/components/paper-feed.tsx`

## 변경 내용
1. `window.history.replaceState` → `router.replace()` 교체 (Next.js 라우터 히스토리 충돌 해결)
2. `useRouter` import 추가
3. 검색 모드 + 일반 모드 PaperCard에 venue, affiliations props 전달

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | useRouter import 존재 | grep으로 확인 | ✅ |
| TC-02 | router.replace 사용 | grep으로 확인 | ✅ |
| TC-03 | window.history.replaceState 제거 | grep 없음 확인 | ✅ |
| TC-04 | venue/affiliations props 전달 (2곳) | grep으로 확인 | ✅ |
| TC-05 | Next.js 빌드 통과 | npx next build 성공 | ✅ |

## 실행출력

TC-01~04: `grep -n "useRouter\|router.replace\|window.history.replaceState\|venue=\|affiliations=" src/components/paper-feed.tsx`
```
4:import { useSearchParams, useRouter } from 'next/navigation';
56:  const router = useRouter();
115:    router.replace(params.toString() ? `/?${params}` : '/', { scroll: false });
204:                      venue={paper.venue}
205:                      affiliations={paper.affiliations}
274:                    venue={paper.venue}
275:                    affiliations={paper.affiliations}
```

TC-03: `grep -n "window.history.replaceState" src/components/paper-feed.tsx`
→ (no output — 제거 확인)

TC-05: `npx next build`
→ Compiled successfully in 2.3s
→ Linting and checking validity of types ... OK
→ Generating static pages (16/16) OK
