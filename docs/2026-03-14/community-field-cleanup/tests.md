| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | 상세 페이지 링크 분기 | source=hacker_news면 "원문", 아니면 arXiv+PDF | ✅ |
| TC-02 | Abstract 숨김 | source=hacker_news면 Abstract 섹션 미표시 | ✅ |
| TC-03 | digest abstract 제거 | digest-community.ts에서 abstract 업데이트 없음 | ✅ |
| TC-04 | 북마크 텍스트 | "항목"으로 변경 | ✅ |
| TC-05 | TypeScript 컴파일 | 에러 없음 | ✅ |

## 실행출력

TC-01: grep "원문" src/app/papers/\[id\]/page.tsx → "원문" 링크 확인, source=hacker_news 조건 분기 ✅
TC-02: grep "hacker_news.*Abstract" 확인 → source !== 'hacker_news' 조건으로 Abstract 숨김 ✅
TC-03: grep "abstract" scripts/digest-community.ts → abstract 업데이트 라인 제거됨 ✅
TC-04: grep "항목" src/app/bookmarks/page.tsx → "북마크한 항목이 없습니다." ✅
TC-05: npx tsc --noEmit → 에러 없음 ✅
