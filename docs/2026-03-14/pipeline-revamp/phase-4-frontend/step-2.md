# Step 2: 상세 페이지 7항목 렌더링

## TC

| TC ID | 검증 항목 | 검증 방법 | 기대 결과 | 상태 |
|-------|----------|----------|----------|------|
| TC-01 | 7항목 섹션 렌더링 | papers/[id]/page.tsx 확인 | oneLiner, targetAudience, keyFindings, evidence, howToApply, codeExample, relatedResources 섹션 존재 | ✅ |
| TC-02 | codeExample 코드블록 | page.tsx 확인 | pre/code 태그로 렌더링 | ✅ |
| TC-03 | relatedResources 링크 | page.tsx 확인 | a 태그 리스트로 렌더링 | ✅ |
| TC-04 | tsc --noEmit 에러 0 | npx tsc --noEmit | 에러 0 | ✅ |

## 실행출력

TC-01: `src/app/papers/[id]/page.tsx` 7항목 섹션 확인
→ L63-67: oneLiner 렌더링 (강조 텍스트, amber 색상)
→ L69-74: targetAudience 섹션 ("누가 읽으면 좋은지")
→ L76-81: keyFindings 섹션 ("주요 내용")
→ L83-88: evidence 섹션 ("근거")
→ L90-95: howToApply 섹션 ("적용 방법")
→ L97-102: codeExample 섹션 ("바로 써보기")
→ L104-120: relatedResources 섹션 ("관련 리소스")

TC-02: codeExample 코드블록 확인
→ L100: `<pre className="..."><code>{paper.codeExample}</code></pre>`

TC-03: relatedResources 링크 확인
→ L105: JSON.parse로 배열 파싱
→ L112: `<a href={url} target="_blank" rel="noopener noreferrer" ...>{url}</a>`
→ ul/li 리스트 구조

TC-04: `npx tsc --noEmit`
→ 출력 없음 (에러 0)
