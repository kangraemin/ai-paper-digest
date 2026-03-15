# arXiv API 429 retry

## Context
arXiv API가 rate limit(429)을 자주 반환해서 수집이 실패함. 1분 간격으로 최대 100회 재시도하는 로직 추가.

## 변경 파일별 상세
### `src/lib/arxiv/client.ts`
- **변경 이유**: 429 응답에 대한 retry 로직 없음
- **Before** (현재 코드):
```typescript
const res = await fetch(url);
if (!res.ok) throw new Error(`arXiv API error: ${res.status}`);
```
- **After** (변경 후):
```typescript
let res: Response;
for (let attempt = 1; attempt <= 100; attempt++) {
  res = await fetch(url);
  if (res.status !== 429) break;
  console.log(`[arXiv] 429 rate limited, ${attempt}/100 retry in 60s...`);
  await new Promise(r => setTimeout(r, 60000));
}
if (!res!.ok) throw new Error(`arXiv API error: ${res!.status}`);
```
- **영향 범위**: fetchRecentPapers 호출하는 collect.ts. 인터페이스 변경 없음.

## 검증
- 검증 명령어: `npm run build`
- 기대 결과: 빌드 성공
