# 홈 페이지 타임라인 피드 리디자인

## Context

현재 홈 페이지는 `PaperGrid` 컴포넌트에서 논문을 3열 카드 그리드(`sm:grid-cols-2 lg:grid-cols-3`)로 보여준다.
날짜별 구분이 없어 "하루하루 보이는 게 별로"라는 피드백이 있었다.

**목표**: 타임라인 피드 스타일로 변경
- 날짜 구분선 ("오늘", "어제", "3월 12일 (수)") + 스크롤
- 카드를 가로 리스트형으로 변경 (정사각 → 가로)
- devNote 💬 코멘트를 카드에 표시
- DateNav는 불필요해짐 (타임라인 자체가 날짜 네비게이션)

---

## 변경 파일별 상세

### 1. `src/components/paper-card.tsx`
- **변경 이유**: 정사각 그리드 카드 → 가로 리스트 카드. devNote 표시 추가.
- **Before** (현재 코드, 전체):
```tsx
interface PaperCardProps {
  id: string;
  title: string;
  titleKo: string | null;
  summaryKo: string | null;
  aiCategory: string | null;
  devRelevance: number | null;
  isHot: boolean | null;
  publishedAt: string;
  authors: string;
}

export function PaperCard({ id, title, titleKo, summaryKo, aiCategory, devRelevance, isHot, publishedAt, authors }: PaperCardProps) {
  const authorList = JSON.parse(authors) as string[];
  const displayAuthors = authorList.length > 3
    ? `${authorList.slice(0, 3).join(', ')} +${authorList.length - 3}`
    : authorList.join(', ');

  return (
    <Link href={`/papers/${id}`}>
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight">
              {titleKo || title}
            </CardTitle>
            {isHot && <HotBadge />}
          </div>
          <div className="flex items-center gap-2 pt-1">
            {aiCategory && (
              <Badge variant="secondary" className={`text-xs text-white ${CATEGORY_COLORS[aiCategory] || ''}`}>
                {aiCategory.toUpperCase()}
              </Badge>
            )}
            {devRelevance && devRelevance >= 4 && (
              <Badge variant="outline" className="text-xs">
                ⭐ {devRelevance}/5
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {summaryKo && (
            <p className="mb-2 line-clamp-3 text-sm text-muted-foreground">
              {summaryKo}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{displayAuthors}</span>
            <span>{new Date(publishedAt).toLocaleDateString('ko-KR')}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```
- **After** (변경 후):
```tsx
interface PaperCardProps {
  id: string;
  title: string;
  titleKo: string | null;
  summaryKo: string | null;
  aiCategory: string | null;
  devRelevance: number | null;
  devNote: string | null;       // ← 추가
  isHot: boolean | null;
  publishedAt: string;
  authors: string;
}

export function PaperCard({ id, title, titleKo, summaryKo, aiCategory, devRelevance, devNote, isHot, publishedAt, authors }: PaperCardProps) {
  const authorList = JSON.parse(authors) as string[];
  const displayAuthors = authorList.length > 3
    ? `${authorList.slice(0, 3).join(', ')} +${authorList.length - 3}`
    : authorList.join(', ');

  return (
    <Link href={`/papers/${id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 mb-1.5">
            {isHot && <HotBadge />}
            {aiCategory && (
              <Badge variant="secondary" className={`text-xs text-white ${CATEGORY_COLORS[aiCategory] || ''}`}>
                {aiCategory.toUpperCase()}
              </Badge>
            )}
            {devRelevance && devRelevance >= 4 && (
              <Badge variant="outline" className="text-xs">
                ⭐ {devRelevance}/5
              </Badge>
            )}
          </div>

          <h3 className="font-semibold leading-snug mb-1">
            {titleKo || title}
          </h3>

          {summaryKo && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-1.5">
              {summaryKo}
            </p>
          )}

          {devNote && (
            <p className="text-sm text-primary/80 italic mb-1.5">
              💬 {devNote}
            </p>
          )}

          <div className="text-xs text-muted-foreground">
            {displayAuthors}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
```
- **주요 변경점**:
  - `h-full` 제거 (그리드용 높이 맞춤 불필요)
  - `CardHeader` 제거 → `CardContent` 하나로 통합 (컴팩트)
  - `devNote` prop 추가 + 💬 이탈릭체로 표시
  - `publishedAt` 날짜를 카드에서 제거 (타임라인 헤더에 이미 표시)
  - `line-clamp-3` → `line-clamp-2` (카드 높이 축소)
- **영향 범위**: `page.tsx`, `src/app/bookmarks/page.tsx`, `src/app/papers/[id]/page.tsx`에서 PaperCard 사용 시 devNote prop 전달 필요

### 2. `src/app/page.tsx`
- **변경 이유**: 3열 그리드 → 타임라인 피드. 날짜별 그룹핑 + sticky 날짜 구분선.
- **Before** (현재 PaperGrid 함수):
```tsx
async function PaperGrid({ date, category, page }: { date?: string; category?: string; page?: string }) {
  const conditions = [];
  if (date) {
    const nextDay = new Date(date + "T00:00:00Z");
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    conditions.push(gte(papers.publishedAt, date));
    conditions.push(lt(papers.publishedAt, nextDay.toISOString().split("T")[0]));
  }
  if (category && category !== "all") {
    conditions.push(eq(papers.aiCategory, category));
  }
  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const pageNum = Math.max(1, Number(page || "1"));
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  const items = await db.select().from(papers)
    .where(where).orderBy(desc(papers.publishedAt)).limit(limit).offset(offset);

  if (items.length === 0) {
    return <div>해당 조건의 논문이 없습니다.</div>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((paper) => <PaperCard key={paper.id} ... />)}
    </div>
  );
}
```
- **After** (TimelineFeed로 교체):
```tsx
// 날짜 포맷: "오늘", "어제", "3월 12일 (수)"
function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return '오늘';
  if (date.toDateString() === yesterday.toDateString()) return '어제';

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;
}

// 논문을 날짜별로 그룹핑
function groupByDate(items: typeof papers.$inferSelect[]): Record<string, typeof papers.$inferSelect[]> {
  const groups: Record<string, typeof papers.$inferSelect[]> = {};
  for (const item of items) {
    const date = item.publishedAt.split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  }
  return groups;
}

async function TimelineFeed({ category }: { category?: string }) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const conditions = [];
  conditions.push(gte(papers.publishedAt, sevenDaysAgo.toISOString().split('T')[0]));
  if (category && category !== 'all') {
    conditions.push(eq(papers.aiCategory, category));
  }

  const items = await db.select().from(papers)
    .where(and(...conditions))
    .orderBy(desc(papers.publishedAt))
    .limit(100);

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        최근 7일 내 논문이 없습니다. 수집을 실행해주세요.
      </div>
    );
  }

  const grouped = groupByDate(items);

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([date, datePapers]) => (
        <section key={date}>
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {formatDateHeader(date)} · {datePapers.length}편
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>
          <div className="space-y-3">
            {datePapers.map(paper => (
              <PaperCard
                key={paper.id}
                id={paper.id}
                title={paper.title}
                titleKo={paper.titleKo}
                summaryKo={paper.summaryKo}
                aiCategory={paper.aiCategory}
                devRelevance={paper.devRelevance}
                devNote={paper.devNote}
                isHot={paper.isHot}
                publishedAt={paper.publishedAt}
                authors={paper.authors}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
```
- **Home 컴포넌트 변경**:
```tsx
// Before
export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="space-y-6">
      <Suspense><HotPapers /></Suspense>
      <div className="flex ...">
        <h1>오늘의 논문</h1>
        <Suspense><DateNav /></Suspense>       // ← 제거
      </div>
      <Suspense><CategoryFilter /></Suspense>
      <Suspense><PaperGrid date={...} category={...} page={...} /></Suspense>  // ← TimelineFeed로 교체
      <NewsletterForm />
    </div>
  );
}

// After
export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="space-y-6">
      <Suspense><HotPapers /></Suspense>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">최근 논문</h1>
      </div>
      <Suspense><CategoryFilter /></Suspense>
      <Suspense fallback={<div className="py-12 text-center text-muted-foreground">로딩 중...</div>}>
        <TimelineFeed category={params.category} />
      </Suspense>
      <NewsletterForm />
    </div>
  );
}
```
- **주요 변경점**:
  - `PaperGrid` → `TimelineFeed`로 교체
  - `DateNav` 제거 (타임라인 자체가 날짜별 스크롤)
  - `date`, `page` searchParams 불필요해짐 → `category`만 사용
  - 날짜 구분선: 가운데 정렬 선 + "오늘 · 5편" 형식
  - `sticky top-0` + `backdrop-blur`로 스크롤 시 날짜 고정
  - HotPapers 섹션은 그대로 유지 (상단)
  - `Props` interface에서 `date`, `page` 제거 가능 (하위 호환 위해 유지해도 됨)

- **영향 범위**:
  - `DateNav` import 제거 (컴포넌트 자체는 삭제하지 않음 — 다른 곳에서 쓸 수 있음)
  - `PaperGrid` 함수 삭제 → `TimelineFeed`로 대체
  - `HotPapers`의 PaperCard에도 `devNote` prop 추가 필요

### 3. HotPapers 섹션 수정 (page.tsx 내)
- **Before**: `<PaperCard ... />` devNote prop 없음
- **After**: `devNote={paper.devNote}` 추가
- **영향 범위**: 없음 (page.tsx 내부 함수)

---

## 개발 Phase 구성

### Phase 1: UI 리디자인 (2 Steps)

**Step 1: PaperCard 가로 레이아웃 + devNote**
- `src/components/paper-card.tsx` 전체 수정
- props에 `devNote: string | null` 추가
- CardHeader 제거, CardContent 하나로 통합
- 💬 devNote 이탈릭체 표시
- 날짜 표시 제거 (타임라인 헤더에서 표시)
- 검증: `npx tsc --noEmit` 에러 0건

**Step 2: page.tsx 타임라인 피드**
- `PaperGrid` → `TimelineFeed` 교체
- `groupByDate()`, `formatDateHeader()` 유틸 함수 추가
- DateNav import/사용 제거
- HotPapers에 devNote prop 추가
- sticky 날짜 구분선 (backdrop-blur)
- 검증: `npx tsc --noEmit` + `npm run build` 성공

### Phase 2: 빌드 검증 (1 Step)

**Step 1: 전체 빌드 + 로컬 확인**
- `npm run build` 성공
- 로컬 서버에서 타임라인 렌더링 확인
- 빈 상태 메시지 "최근 7일 내 논문이 없습니다" 확인

---

## 검증

### 빌드 검증
- `npx tsc --noEmit` — 에러 0건
- `npm run build` — 성공 (11 routes)

### 시각 검증 (로컬)
- http://localhost:3000 접속
- 날짜 구분선이 "오늘 · N편" / "어제 · N편" 형식으로 표시
- 카드가 가로 리스트 형태로 배치
- devNote가 💬 이탈릭체로 표시
- 스크롤 시 날짜 구분선이 sticky로 상단에 고정
