# Phase 2 - Step 1: arXiv 클라이언트

## 목표
arXiv Atom Feed API에서 논문을 수집하고 파싱하는 클라이언트를 구현한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | ArxivEntry 타입 | types.ts에 ArxivEntry 인터페이스 정의 (id, title, abstract, authors, categories, primaryCategory, publishedAt, updatedAt, arxivUrl, pdfUrl) | ✅ |
| TC-02 | fetchRecentPapers 함수 | client.ts에 arXiv API 호출 + XML 파싱 함수 export | ✅ |
| TC-03 | XML 파서 설정 | fast-xml-parser 사용 + ignoreAttributes: false | ✅ |
| TC-04 | parseEntry 함수 | XML entry → ArxivEntry 변환 (id 정규화, 줄바꿈 제거) | ✅ |
| TC-05 | 카테고리 설정 | cs.AI, cs.CL, cs.LG 카테고리 쿼리 | ✅ |
| TC-06 | TypeScript 빌드 | npx tsc --noEmit 에러 없음 | ✅ |

## 구현 지시사항
- plan.md의 `src/lib/arxiv/client.ts` 코드 참조
- fast-xml-parser의 XMLParser 사용
- arXiv ID에서 버전 접미사(v1, v2 등) 제거

## 실행 결과

TC-01: `grep "ArxivEntry" src/lib/arxiv/types.ts`
→ ArxivEntry 인터페이스 정의 (10개 필드)

TC-02: `grep "fetchRecentPapers" src/lib/arxiv/client.ts`
→ export async function fetchRecentPapers 존재

TC-03: `grep "ignoreAttributes" src/lib/arxiv/client.ts`
→ ignoreAttributes: false

TC-04: `grep "parseEntry" src/lib/arxiv/client.ts`
→ parseEntry 함수 존재 (id 정규화 + 줄바꿈 제거)

TC-05: `grep "cs\." src/lib/arxiv/client.ts`
→ cs.AI, cs.CL, cs.LG

TC-06: `npx tsc --noEmit`
→ 에러 없음
