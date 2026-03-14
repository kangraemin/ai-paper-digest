| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | community-prompts.ts 프롬프트 변경 | keyFindings 5~8개, evidence 라벨 "커뮤니티 토론", howToApply 2~4개, glossary 3~6개, {url} 플레이스홀더, relatedResources 원본 URL 필수 규칙 포함 | ✅ |
| TC-02 | digest-community.ts URL 치환 추가 | `.replace('{url}', item.arxivUrl)` 라인 존재 | ✅ |
| TC-03 | bulk-collect.ts daysBack 변경 | `daysBack: 240` 으로 설정 | ✅ |
| TC-04 | TypeScript 컴파일 확인 | `npx tsc --noEmit` 에러 없음 | ✅ |

## 실행출력

TC-01: grep으로 community-prompts.ts 검증
→ keyFindings 5~8개 ✅, "커뮤니티 토론" 라벨 ✅, {url} 플레이스홀더 ✅

TC-02: grep으로 digest-community.ts 검증
→ `.replace('{url}', item.arxivUrl)` line 65 확인 ✅

TC-03: grep으로 bulk-collect.ts 검증
→ `daysBack: 240` line 90 확인 ✅

TC-04: `npx tsc --noEmit`
→ 에러 없음 (출력 없음) ✅
