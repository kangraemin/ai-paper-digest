| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | submit-paper-modal.tsx 파일 존재 + Portal 렌더링 | createPortal 사용, 'use client' 선언 | ✅ |
| TC-02 | arXiv URL 입력 필드 존재 | input placeholder "Paste arXiv URL..." | ✅ |
| TC-03 | ESC close + Enter submit 힌트 | kbd 요소로 ESC/ENTER 표시 | ✅ |
| TC-04 | POST /api/papers 호출 | fetch('/api/papers', { method: 'POST' }) 존재 | ✅ |
| TC-05 | header.tsx에 Submit Paper 버튼 추가 | "Submit Paper" 텍스트 버튼 존재 | ✅ |
| TC-06 | header.tsx에서 모달 열기 | useState + setShowSubmit(true) onClick | ✅ |
| TC-07 | npm run build 성공 | exit code 0 | ✅ |

## 실행출력

TC-01: grep -c "createPortal" src/components/submit-paper-modal.tsx && grep -c "'use client'" src/components/submit-paper-modal.tsx
→ 2 (createPortal 2회 사용: import + 호출), 1 ('use client' 선언)

TC-02: grep -c "Paste arXiv URL" src/components/submit-paper-modal.tsx
→ 1

TC-03: grep -c "<kbd" src/components/submit-paper-modal.tsx
→ 2 (ESC, ENTER)

TC-04: grep -c "fetch('/api/papers'" src/components/submit-paper-modal.tsx
→ 1

TC-05: grep -c "Submit Paper" src/components/header.tsx
→ 1

TC-06: grep -c "setShowSubmit(true)" src/components/header.tsx
→ 1

TC-07: npm run build
→ ✓ Build completed successfully. All 11 pages generated. Exit code 0.
