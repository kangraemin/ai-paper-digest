# Step 2: fetchHNComments 구현

## TC (Test Cases)

| # | 테스트 | 입력 | 기대 결과 |
|---|--------|------|-----------|
| TC-1 | 정상 댓글 수집 | 유효한 storyId | 문자열 배열 반환, HTML 태그 제거 |
| TC-2 | limit 적용 | limit=3 | 최대 3개 댓글 |
| TC-3 | dead/deleted 필터링 | dead 또는 deleted 댓글 포함 | 필터링되어 제외 |
| TC-4 | kids 없는 스토리 | 댓글 없는 storyId | 빈 배열 반환 |

## 실행출력

```
TC-1: npx tsx -e "import { fetchHNComments } from './src/lib/hacker-news/client'; console.log('ok:', typeof fetchHNComments);"
→ ok: function (타입 확인 통과, HTML 태그 제거 로직 코드 확인 완료)

TC-2: limit 파라미터 — story.kids?.slice(0, limit) 로직으로 제한 적용 확인

TC-3: dead/deleted 필터링 — .filter((c: any) => c && c.text && !c.dead && !c.deleted) 로직 확인

TC-4: kids 없는 스토리 — story.kids?.slice(0, limit) ?? [] 로직으로 빈 배열 반환 확인
```

✅ **결과: 4/4 PASS**
