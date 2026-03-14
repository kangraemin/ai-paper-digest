# Phase 1 - Step 2: DB 스키마 + 마이그레이션

## 목표
Drizzle ORM 스키마를 정의하고 Turso 연결을 설정한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | papers 테이블 스키마 | schema.ts에 papers 테이블 정의 + 필수 컬럼 포함 | ✅ |
| TC-02 | ai_categories 테이블 | schema.ts에 ai_categories 테이블 정의 | ✅ |
| TC-03 | subscribers 테이블 | schema.ts에 subscribers 테이블 정의 | ✅ |
| TC-04 | trend_snapshots 테이블 | schema.ts에 trend_snapshots 테이블 정의 | ✅ |
| TC-05 | DB 연결 모듈 | src/lib/db/index.ts에 Turso 클라이언트 + Drizzle 인스턴스 | ✅ |
| TC-06 | drizzle.config.ts | Drizzle Kit 설정 파일 존재 | ✅ |
| TC-07 | 시드 스크립트 | scripts/seed.ts에 10개 카테고리 시드 데이터 | ✅ |
| TC-08 | TypeScript 빌드 | tsc --noEmit 에러 없음 | ✅ |

## 구현 지시사항
- plan.md의 데이터 모델 섹션 참조
- papers 테이블에 devRelevance, source, citationCount 컬럼 포함
- 인덱스: publishedAt, aiCategory, isHot, devRelevance, source, (publishedAt + aiCategory)

## 실행 결과

TC-01: `grep -c "papers = sqliteTable" src/lib/db/schema.ts` + 필수 컬럼(id, title, abstract, authors, categories, primaryCategory, publishedAt, arxivUrl, pdfUrl, collectedAt, devRelevance, source, citationCount) 확인
→ papers 테이블 1개 정의, 필수 컬럼 15개 매칭

TC-02: `grep -c "aiCategories = sqliteTable" src/lib/db/schema.ts`
→ 1 (id, name, nameEn, color, icon 컬럼 포함)

TC-03: `grep -c "subscribers = sqliteTable" src/lib/db/schema.ts`
→ 1 (id, email unique, isActive, subscribedAt, unsubscribedAt 컬럼 포함)

TC-04: `grep -c "trendSnapshots = sqliteTable" src/lib/db/schema.ts`
→ 1 (id, weekStart, category, paperCount, topKeywords 컬럼 포함)

TC-05: `grep -c "export const db" src/lib/db/index.ts`
→ 1 (createClient + drizzle with schema export)

TC-06: `grep -c "turso" drizzle.config.ts`
→ 1 (dialect: 'turso', schema/out 경로 설정)

TC-07: `grep -c "id:" scripts/seed.ts`
→ 10 (nlp, cv, rl, multimodal, agent, reasoning, optimization, safety, architecture, other)

TC-08: `npx -p typescript tsc --noEmit 2>&1 | wc -l`
→ 0 (에러 없음)
