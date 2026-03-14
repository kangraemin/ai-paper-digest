# UX 전면 리워크

## 배경
현재 UI가 기본 shadcn 템플릿 느낌. 개성 없고 밋밋함. 학술적 카테고리(NLP/CV/RL)가 실무 개발자와 맞지 않음. devNote(핵심 차별점)가 묻혀 있음.

## 변경 파일별 상세

---

### `scripts/seed.ts`
- **변경 이유**: 학술 카테고리 10개 → 실무 카테고리 6개 변경
- **Before** (현재 코드):
```typescript
const categories = [
  { id: 'nlp', name: '자연어처리', nameEn: 'NLP', color: '#3B82F6', icon: '💬' },
  { id: 'cv', name: '컴퓨터비전', nameEn: 'CV', color: '#10B981', icon: '👁️' },
  { id: 'rl', name: '강화학습', nameEn: 'RL', color: '#F59E0B', icon: '🎮' },
  { id: 'multimodal', name: '멀티모달', nameEn: 'Multimodal', color: '#8B5CF6', icon: '🎨' },
  { id: 'agent', name: '에이전트', nameEn: 'Agent', color: '#EF4444', icon: '🤖' },
  { id: 'reasoning', name: '추론', nameEn: 'Reasoning', color: '#EC4899', icon: '🧠' },
  { id: 'optimization', name: '최적화', nameEn: 'Optimization', color: '#14B8A6', icon: '⚡' },
  { id: 'safety', name: '안전성', nameEn: 'Safety', color: '#F97316', icon: '🛡️' },
  { id: 'architecture', name: '아키텍처', nameEn: 'Architecture', color: '#6366F1', icon: '🏗️' },
  { id: 'other', name: '기타', nameEn: 'Other', color: '#6B7280', icon: '📄' },
];
```
- **After** (변경 후):
```typescript
const categories = [
  { id: 'prompting', name: '프롬프팅', nameEn: 'Prompting', color: '#3B82F6', icon: '💬' },
  { id: 'rag', name: 'RAG', nameEn: 'RAG', color: '#10B981', icon: '🔍' },
  { id: 'agent', name: '에이전트', nameEn: 'Agent', color: '#8B5CF6', icon: '🤖' },
  { id: 'fine-tuning', name: '파인튜닝', nameEn: 'Fine-tuning', color: '#F97316', icon: '🔧' },
  { id: 'eval', name: '평가', nameEn: 'Eval', color: '#EC4899', icon: '📊' },
  { id: 'cost-speed', name: '비용/속도', nameEn: 'Cost/Speed', color: '#14B8A6', icon: '⚡' },
];
```
- **영향 범위**: DB ai_categories 테이블, 기존 논문의 aiCategory 값

---

### `src/lib/claude/prompts.ts`
- **변경 이유**: Claude 분류 프롬프트를 새 6개 카테고리에 맞게 변경
- **Before**:
```
3. aiCategory: 아래 카테고리 중 하나만 선택
   - nlp: 자연어처리, 언어모델, 텍스트
   - cv: 컴퓨터비전, 이미지, 비디오
   - rl: 강화학습
   ...10개
```
- **After**:
```
3. aiCategory: 아래 카테고리 중 하나만 선택
   - prompting: 프롬프팅, 시스템 프롬프트, few-shot, CoT, 프롬프트 엔지니어링
   - rag: 검색 증강 생성, 청킹, 임베딩, 벡터 검색, 지식 기반
   - agent: AI 에이전트, 도구 사용, MCP, 멀티에이전트, 함수 호출
   - fine-tuning: 파인튜닝, RLHF, DPO, LoRA, 어댑터, 정렬
   - eval: 벤치마크, 평가, 품질 측정, 레드팀, 안전성 평가
   - cost-speed: 추론 최적화, 토큰 절약, 배치, 양자화, 디스틸레이션, 모델 압축
```
- **영향 범위**: 이후 수집되는 논문의 분류 기준

---

### `src/app/globals.css`
- **변경 이유**: 무채색 기본 테마 → 개발자 도구 느낌의 컬러 시스템
- **Before**: oklch 순수 무채색 (chroma 0)
- **After**:
  - Light: `--background: oklch(0.995 0.002 80)` (미세한 웜톤), `--primary: oklch(0.25 0.03 270)` (인디고 블랙)
  - Dark: `--background: oklch(0.15 0.01 270)` (블루 틴트 다크, VS Code 느낌), `--card: oklch(0.19 0.01 270)`
  - devNote 강조용 accent warm 색상 추가
- **영향 범위**: 전체 앱 색감

---

### `src/app/layout.tsx`
- **변경 이유**: 폰트 추가(모노스페이스) + 레이아웃 폭 조정
- **Before**:
```tsx
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
// ...
<main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
```
- **After**:
```tsx
import { JetBrains_Mono } from "next/font/google";
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
// ...
<body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
// ...
<main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
```
- **영향 범위**: 전체 레이아웃 폭, 모노스페이스 폰트 사용 가능

---

### `src/components/header.tsx`
- **변경 이유**: 개성 없는 헤더 → 터미널 느낌의 개발자 도구 헤더
- **Before**:
```tsx
<Link href="/" className="text-xl font-bold">AI Paper Digest</Link>
<nav>Home | Trends | Bookmarks | ThemeToggle</nav>
```
- **After**:
```tsx
<header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
    <Link href="/" className="font-mono text-lg font-bold tracking-tight">
      <span className="text-muted-foreground">{'>'}</span> paper.digest<span className="animate-pulse">_</span>
    </Link>
    <nav className="flex items-center gap-3">
      <Link href="/trends" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">trends</Link>
      <Link href="/bookmarks" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">saved</Link>
      <ThemeToggle />
    </nav>
  </div>
</header>
```
- **영향 범위**: 헤더 시각적 변화, sticky 동작 추가

---

### `src/components/paper-card.tsx`
- **변경 이유**: shadcn Card 래퍼 제거, devNote 최우선 배치, 리스트형 레이아웃
- **Before**:
```tsx
<Card className="transition-shadow hover:shadow-md">
  <CardContent className="py-4">
    // badges → title → summary → devNote → authors
  </CardContent>
</Card>
```
- **After**:
```tsx
<div className="py-4 border-b border-border hover:bg-muted/30 transition-colors">
  {/* devNote 최상단 강조 */}
  {devNote && (
    <p className="text-[15px] font-medium text-amber-700 dark:text-amber-400 mb-1.5">
      {devNote}
    </p>
  )}

  {/* 타이틀 + 카테고리 인라인 */}
  <div className="flex items-start gap-2 mb-1">
    <h3 className="font-semibold leading-snug flex-1">{titleKo || title}</h3>
    {isHot && <span className="text-orange-500 shrink-0">🔥</span>}
  </div>

  {/* 카테고리 필 + 요약 한 줄 + 메타 */}
  <div className="flex items-center gap-2 text-xs text-muted-foreground">
    {aiCategory && (
      <span className={`font-mono px-1.5 py-0.5 rounded ${CATEGORY_STYLES[aiCategory]}`}>
        {aiCategory}
      </span>
    )}
    {summaryKo && <span className="line-clamp-1 flex-1">{summaryKo}</span>}
  </div>

  <div className="text-xs text-muted-foreground mt-1 font-mono">
    {displayAuthors}
  </div>
</div>
```
- CATEGORY_STYLES를 반투명 배경+색상 텍스트로 변경 (예: `bg-blue-500/15 text-blue-700 dark:text-blue-300`)
- **영향 범위**: 카드 시각적 전면 변경

---

### `src/components/category-filter.tsx`
- **변경 이유**: 10개 필터 버튼 → 제거 (하루 10편에 필터 불필요)
- **Before**: 10개 카테고리 버튼 + URL param 필터
- **After**: 컴포넌트 유지하되 page.tsx에서 렌더링 제거. URL param `?category=` 동작은 유지 (직접 URL 입력 시 작동).
- **영향 범위**: 홈페이지에서 필터 UI 사라짐

---

### `src/app/page.tsx`
- **변경 이유**: Hot Papers 그리드 제거, 단일 타임라인 피드, 빈 상태 개선
- **Before**:
```tsx
<HotPapers />  {/* 별도 그리드 섹션 */}
<h1>최근 논문</h1>
<CategoryFilter />
<TimelineFeed />
<NewsletterForm />
```
- **After**:
```tsx
{/* Hot Papers 섹션 제거 — hot 논문은 타임라인에서 인라인 강조 */}
{/* CategoryFilter 제거 */}
<TimelineFeed category={params.category} />
{/* NewsletterForm은 footer로 이동 */}
```
- TimelineFeed 내부: 날짜 그룹 내에서 `devRelevance` 내림차순 정렬 추가
- 빈 상태: 개성 있는 디자인 (`¯\_(ツ)_/¯` + "오늘은 조용한 날")
- **영향 범위**: 홈페이지 구조 전면 변경

---

### `src/components/newsletter-form.tsx`
- **변경 이유**: 본문 영역에서 눈에 띄는 카드형 → 푸터 컴팩트 인라인 폼
- **Before**: `rounded-lg border bg-card p-6 text-center` 카드 스타일
- **After**: `border-t py-6` 푸터 스타일, 한 줄 레이아웃:
  ```
  매일 아침 AI 논문 다이제스트 받기  [email] [구독]
  ```
- **영향 범위**: 뉴스레터 폼 위치/스타일 변경

---

## 신규 파일

없음. 기존 파일 수정만으로 구현.

## 검증
- 검증 명령어: `npm run dev` → localhost에서 시각적 확인
- `npm run build` → 빌드 에러 없음 확인
- 기대 결과:
  - 터미널 느낌 모노스페이스 로고 헤더
  - devNote가 카드 최상단에 눈에 띄게 표시
  - Hot Papers 별도 섹션 없이 타임라인에 인라인 강조
  - 카테고리 필터 UI 없음
  - 뉴스레터 폼 하단 컴팩트
  - 다크모드: VS Code 느낌의 블루 틴트
