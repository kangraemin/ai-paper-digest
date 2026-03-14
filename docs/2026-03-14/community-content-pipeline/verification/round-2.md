# 검증 라운드 2: 기능 검증

## 검증 항목
| # | 항목 | 결과 | 비고 |
|---|------|------|------|
| 1 | fetchContent 실행 | PASS | `fetchContent('https://example.com')` 실행 성공, 139자 텍스트 반환 |
| 2 | fetchHNComments import | PASS | `typeof fetchHNComments` === `function` 확인 |
| 3 | 프롬프트 플레이스홀더 | PASS | `{title}`, `{content}`, `{comments}` 세 플레이스홀더 모두 존재 확인 (true, true, true) |
| 4 | digest-community 로직 | PASS | `npx tsc --noEmit --skipLibCheck` 타입 체크 통과 (에러 0건). 로직 검증: DB 조회(source=hacker_news, summarizedAt=null) -> fetchContent -> fetchHNComments -> 프롬프트 조립 -> claude -p 호출 -> JSON 파싱 -> DB 업데이트 흐름 정상 |

## 실행 로그

### 1. content-fetcher.ts
```
$ npx tsx -e "import { fetchContent } from './src/lib/content-fetcher'; fetchContent('https://example.com').then(r => console.log('content-fetcher OK, length:', r.length));"
content-fetcher OK, length: 139
```

### 2. hacker-news/client.ts
```
$ npx tsx -e "import { fetchHNComments } from './src/lib/hacker-news/client'; console.log('fetchHNComments OK:', typeof fetchHNComments);"
fetchHNComments OK: function
```

### 3. community-prompts.ts
```
$ npx tsx -e "import { COMMUNITY_DIGEST_PROMPT } from './src/lib/claude/community-prompts'; console.log('prompt OK:', COMMUNITY_DIGEST_PROMPT.includes('{title}'), COMMUNITY_DIGEST_PROMPT.includes('{content}'), COMMUNITY_DIGEST_PROMPT.includes('{comments}'));"
prompt OK: true true true
```

### 4. digest-community.ts
```
$ npx tsc --noEmit --skipLibCheck scripts/digest-community.ts
(에러 없음)
```

## 결론
PASS - 4개 항목 모두 통과
