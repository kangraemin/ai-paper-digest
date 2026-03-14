# Step 1: community-prompts.ts 구현

## TC (Test Cases)

| # | 테스트 | 입력 | 기대 결과 |
|---|--------|------|-----------|
| TC-1 | 프롬프트 export 확인 | import | COMMUNITY_DIGEST_PROMPT 문자열 export |
| TC-2 | 플레이스홀더 포함 | 프롬프트 내용 | {title}, {content}, {comments} 포함 |
| TC-3 | JSON 필드 지시 | 프롬프트 내용 | titleKo, oneLiner, keyFindings 등 12개 필드 언급 |

## 실행출력

```
TC-1: npx tsx -e "import { COMMUNITY_DIGEST_PROMPT } from './src/lib/claude/community-prompts'; console.log(typeof COMMUNITY_DIGEST_PROMPT);"
→ export ok: string ✅

TC-2: COMMUNITY_DIGEST_PROMPT.includes('{title}') → true
      COMMUNITY_DIGEST_PROMPT.includes('{content}') → true
      COMMUNITY_DIGEST_PROMPT.includes('{comments}') → true ✅

TC-3: COMMUNITY_DIGEST_PROMPT.includes('titleKo') → true
      COMMUNITY_DIGEST_PROMPT.includes('keyFindings') → true ✅
```

✅ **결과: 3/3 PASS**
