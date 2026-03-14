# Step 1: cleanup-papers.ts 생성

## TC

| TC ID | 검증 항목 | 검증 방법 | 기대 결과 | 상태 |
|-------|----------|----------|----------|------|
| TC-01 | cleanup-papers.ts 존재 | 파일 확인 | screenBatch import + DB 조회 + DELETE 로직 | ✅ |
| TC-02 | 로그 출력 | 코드 확인 | 유지/삭제 편수 로그 포함 | ✅ |
| TC-03 | tsc --noEmit 에러 0 | npx tsc --noEmit | 에러 0 | ✅ |

## 실행출력

TC-01: `scripts/cleanup-papers.ts` 파일 확인
→ L4: `import { screenBatch } from '../src/lib/claude/screener';` (screenBatch import)
→ L8-12: `db.select({id, title, abstract}).from(papers)` (DB 전체 조회)
→ L16: `await screenBatch(allPapers)` (스크리닝 실행)
→ L22: `await db.delete(papers).where(eq(papers.id, id))` (pass:false 논문 DELETE)

TC-02: 로그 출력 확인
→ L7: `console.log('🧹 기존 논문 스크리닝 시작...');`
→ L14: `console.log(\`총 ${allPapers.length}편 검사\`);`
→ L29: `console.log(\`[정리] 총 ${allPapers.length}편 중 ${kept}편 유지, ${removed}편 삭제\`);`

TC-03: `npx tsc --noEmit`
→ 출력 없음 (에러 0)
