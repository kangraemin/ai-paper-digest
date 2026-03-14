# Step 2: fetchHNComments 구현

## TC (Test Cases)

| # | 테스트 | 입력 | 기대 결과 |
|---|--------|------|-----------|
| TC-1 | 정상 댓글 수집 | 유효한 storyId | 문자열 배열 반환, HTML 태그 제거 |
| TC-2 | limit 적용 | limit=3 | 최대 3개 댓글 |
| TC-3 | dead/deleted 필터링 | dead 또는 deleted 댓글 포함 | 필터링되어 제외 |
| TC-4 | kids 없는 스토리 | 댓글 없는 storyId | 빈 배열 반환 |

## 실행출력
(Dev 완료 후 기록)
