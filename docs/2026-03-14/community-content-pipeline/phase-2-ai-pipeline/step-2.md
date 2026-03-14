# Step 2: digest-community.ts 구현

## TC (Test Cases)

| # | 테스트 | 입력 | 기대 결과 |
|---|--------|------|-----------|
| TC-1 | import/syntax 정상 | tsx -e import | 에러 없이 로드 |
| TC-2 | runClaude 함수 존재 | 코드 확인 | spawn('claude', ['-p', '--model', 'opus']) 패턴 사용 |
| TC-3 | DB 쿼리 조건 | 코드 확인 | source='hacker_news' AND summarizedAt IS NULL |
| TC-4 | 파이프라인 흐름 | 코드 확인 | fetchContent → fetchHNComments → runClaude → DB update |

## 실행출력

```
TC-1: npx tsc --noEmit → 에러 없음 ✅

TC-2: grep "spawn('claude'" scripts/digest-community.ts
→ spawn('claude', ['-p', '--model', 'opus']) ✅

TC-3: grep "hacker_news" scripts/digest-community.ts
→ eq(papers.source, 'hacker_news'), isNull(papers.summarizedAt) ✅

TC-4: grep fetchContent/fetchHNComments scripts/digest-community.ts
→ fetchContent → fetchHNComments → runClaude → db.update 흐름 확인 ✅
```

✅ **결과: 4/4 PASS**
