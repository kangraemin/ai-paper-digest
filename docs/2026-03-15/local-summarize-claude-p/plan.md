# local-summarize-claude-p

## 변경 파일별 상세

### `scripts/summarize.ts`
- **변경 이유**: 로컬에서 claude -p로 실행 시 동시 5개 프로세스는 과부하. 1개씩 순차 처리.
- **Before**:
```ts
    5
  );
```
- **After**:
```ts
    1
  );
```

## 검증
- 검증 명령어: `TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx scripts/summarize.ts`
- 기대 결과: `✅ Summarized N/N papers` 출력
