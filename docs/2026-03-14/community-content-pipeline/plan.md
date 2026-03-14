# 커뮤니티 콘텐츠 파이프라인: 원문 크롤링 + 댓글 수집 + 정리

## 변경 파일별 상세
### `src/lib/content-fetcher.ts` (신규) - 범용 URL→텍스트 크롤러
### `src/lib/hacker-news/client.ts` (수정) - fetchHNComments 추가
### `src/lib/claude/community-prompts.ts` (신규) - 커뮤니티 정리 프롬프트
### `scripts/digest-community.ts` (신규) - 원문+댓글→claude -p→DB
### `.github/workflows/collect.yml` (수정) - digest step 추가

## 검증
- `npx tsx scripts/digest-community.ts` 로컬 실행
- HN 스토리 summarizedAt 채워짐 + keyFindings/evidence 확인
