# Submit Paper Modal + Header Update

## 변경 파일별 상세

### `src/components/submit-paper-modal.tsx` (신규)
- **용도**: arXiv 논문 URL을 제출하는 command-palette 스타일 모달
- **핵심 기능**:
  - Portal 기반 오버레이 렌더링
  - arXiv URL 입력 필드 + Enter 제출 / ESC 닫기
  - POST /api/papers 호출
  - 에러 핸들링 + 로딩 상태

### `src/components/header.tsx`
- **변경 이유**: Submit Paper 버튼 추가 + 모달 상태 관리를 위해 client component로 전환
- **Before** (현재 코드):
```tsx
import Link from 'next/link';
import { Search, Bookmark } from 'lucide-react';

export function Header() {
  return (
    <header>...</header>
  );
}
```
- **After** (변경 후):
```tsx
'use client';
import Link from 'next/link';
import { Search, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { SubmitPaperModal } from './submit-paper-modal';

export function Header() {
  const [showSubmit, setShowSubmit] = useState(false);
  return (
    <>
      <header>
        ...
        <button onClick={() => setShowSubmit(true)}>Submit Paper</button>
      </header>
      <SubmitPaperModal open={showSubmit} onClose={() => setShowSubmit(false)} />
    </>
  );
}
```

## 검증
- 검증 명령어: `npm run build`
- 기대 결과: 빌드 성공 (exit code 0)
