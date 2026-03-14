# AI Paper Digest - 일일 AI 논문 요약 웹사이트

## 아키텍처

```
┌──────────────────────────────────────────────────────┐
│                  Vercel Platform                      │
│                                                       │
│  ┌──────────┐   ┌──────────────┐                     │
│  │ Next.js  │   │  API Routes  │                     │
│  │ App      │◄──┤ /api/papers  │                     │
│  │ Router   │   │ /api/search  │                     │
│  │          │   │ /api/trends  │                     │
│  │ Pages:   │   │ /api/newsletter│                    │
│  │ - Home   │   └──────┬───────┘                     │
│  │ - Detail │          │                              │
│  │ - Trends │   ┌──────┴───────────────────────┐     │
│  │ - Marks  │   │  Turso (hosted SQLite)       │     │
│  └──────────┘   │  + Drizzle ORM               │     │
│                  └──────────────────────────────┘     │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│              GitHub Actions (Cron)                     │
│                                                       │
│  ┌────────────────┐    ┌─────────────────────┐       │
│  │ collect.yml    │    │ summarize.yml       │       │
│  │ 매일 06:00 UTC │    │ collect 완료 후 실행  │       │
│  │                │    │                     │       │
│  │ 1. arXiv API  │───▶│ 1. 미요약 논문 조회   │       │
│  │ 2. XML 파싱   │    │ 2. Claude Haiku 요약 │       │
│  │ 3. DB 저장    │    │ 3. 카테고리 분류     │       │
│  └───────┬────────┘    │ 4. DB 업데이트      │       │
│          │             └─────────┬───────────┘       │
│          ▼                       ▼                    │
│    ┌──────────┐          ┌──────────────┐            │
│    │ arXiv    │          │ Claude API   │            │
│    │ Atom API │          │ (Haiku)      │            │
│    └──────────┘          └──────────────┘            │
└──────────────────────────────────────────────────────┘
```

## 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| Frontend | Next.js 15 (App Router) | SSR/SSG, Vercel 최적화 |
| Styling | Tailwind CSS + shadcn/ui | 빠른 UI 구축, 다크모드 내장 |
| DB | Turso (hosted SQLite) + Drizzle ORM | Serverless 호환, 무료 9GB |
| LLM | Claude Haiku (Anthropic SDK) | 저비용 (~$0.60/월), Sonnet 전환 용이 |
| 논문 소스 | arXiv Atom Feed API | 간단한 REST, XML 파싱 |
| 차트 | Recharts | React 네이티브 차트 라이브러리 |
| 이메일 | Resend | 개발자 친화적, 무료 100통/일 |
| 웹 배포 | Vercel | Next.js 네이티브, 원클릭 배포 |
| Cron | GitHub Actions | 시간 제한 없음(6h), 무료 2000분/월 |
| XML 파싱 | fast-xml-parser | 경량, 타입 안전 |

## 배포 전략 상세

### Vercel (웹 + API)
- **역할**: Next.js 앱 호스팅 + API Routes (논문 조회/검색/북마크)
- **설정**: GitHub 리포 연결 → main push 시 자동 배포
- **환경변수**: `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` 등 Vercel Dashboard에서 설정
- **도메인**: `ai-paper-digest.vercel.app` (무료) 또는 커스텀 도메인

### GitHub Actions (데이터 수집 + 요약)
- **역할**: 매일 arXiv 수집 + Claude 요약 (시간 제한 없이 100편 이상 처리)
- **워크플로우**:

```yaml
# .github/workflows/collect.yml
name: Daily Paper Collection
on:
  schedule:
    - cron: '0 6 * * *'  # 매일 UTC 06:00 (KST 15:00)
  workflow_dispatch:       # 수동 실행 가능

jobs:
  collect:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }
      - run: npm ci
      - run: npx tsx scripts/collect.ts    # arXiv 수집
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}
      - run: npx tsx scripts/summarize.ts  # Claude 요약
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### 스크립트 구조 (GitHub Actions용)

```
scripts/
├── collect.ts           # arXiv 신규 논문 → DB 수집
├── collect-popular.ts   # Semantic Scholar 인기 논문 5개 → DB 수집
├── summarize.ts         # 미요약 논문 → Claude 요약 + devRelevance → DB 업데이트
└── seed.ts              # 초기 카테고리 시드 데이터
```

**`scripts/collect.ts` 흐름**:
1. arXiv Atom API에서 최근 논문 fetch (cs.AI, cs.CL, cs.LG)
2. XML 파싱 → 논문 메타데이터 추출
3. Turso DB에 upsert (arXiv ID 기준 중복 방지, source='arxiv')
4. hotScore 초기 계산 (저자 수, 카테고리 교차)
5. 결과 로깅: `Collected 87 papers, 23 new`

**`scripts/collect-popular.ts` 흐름**:
1. Semantic Scholar API에서 AI/LLM 관련 인기 논문 조회
   - `GET /paper/search?query=large+language+model&year=2024-2026&sort=citationCount&limit=5`
   - 최근 인용수 급증 논문 우선
2. 이미 DB에 있는 논문은 citationCount만 업데이트
3. 새 논문은 source='semantic_scholar'로 insert
4. 결과 로깅: `Popular: 5 papers, 3 new`

**`scripts/summarize.ts` 흐름**:
1. DB에서 `summarizedAt IS NULL` 논문 전체 조회
2. 각 논문에 대해 Claude Haiku 호출 (병렬 5개씩, rate limit 준수)
3. 응답 파싱: `{ titleKo, summaryKo, aiCategory, devRelevance }`
4. DB 업데이트: summaryKo, aiCategory, devRelevance, summarizedAt
5. 실패한 논문 로깅 (다음 실행에서 재시도)
6. 결과: `Summarized 87/87 papers (0 failed)`

### 저장소 (Turso) 상세

**Turso란**: libSQL(SQLite 포크) 기반 호스팅 DB. Edge에서 접근 가능.

**설정 절차**:
1. `turso auth signup` (GitHub 로그인)
2. `turso db create ai-paper-digest`
3. `turso db tokens create ai-paper-digest`
4. 환경변수에 URL + Token 설정

**무료 플랜 한도**:
- 스토리지: 9GB (논문 텍스트 기준 수년치)
- Row reads: 25B/월 (충분)
- DB 수: 500개

**Drizzle ORM 연결**:
```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
```

## 데이터 모델

### papers
| 컬럼 | 타입 | 설명 |
|-------|------|------|
| id | TEXT PK | arXiv ID (e.g., "2403.12345") |
| title | TEXT NOT NULL | 원문 제목 |
| titleKo | TEXT | 한글 제목 (요약 시 생성) |
| abstract | TEXT NOT NULL | 초록 |
| authors | TEXT NOT NULL (JSON) | 저자 배열 `["Alice", "Bob"]` |
| categories | TEXT NOT NULL (JSON) | arXiv 카테고리 `["cs.AI", "cs.CL"]` |
| primaryCategory | TEXT NOT NULL | 주 카테고리 |
| publishedAt | TEXT NOT NULL | 게시일 (ISO 8601) |
| updatedAt | TEXT | 수정일 |
| arxivUrl | TEXT NOT NULL | arXiv 페이지 URL |
| pdfUrl | TEXT NOT NULL | PDF 다운로드 URL |
| summaryKo | TEXT | 한글 3~5줄 요약 |
| aiCategory | TEXT | AI 분류 (nlp/cv/rl/multimodal/agent/reasoning/optimization/safety/architecture/other) |
| devRelevance | INTEGER DEFAULT 3 | 개발자 관련도 (1~5). 5=직접 적용, 3=참고, 1=무관 |
| hotScore | INTEGER DEFAULT 0 | 핫 점수 (0~100) |
| isHot | BOOLEAN DEFAULT false | 핫 논문 여부 (상위 10%) |
| source | TEXT DEFAULT 'arxiv' | 수집 소스 ('arxiv' 또는 'semantic_scholar') |
| citationCount | INTEGER | 인용수 (Semantic Scholar에서 수집) |
| collectedAt | TEXT NOT NULL | 수집 시각 |
| summarizedAt | TEXT | 요약 생성 시각 |

**인덱스**: publishedAt, aiCategory, isHot, devRelevance, source, (publishedAt + aiCategory)

### ai_categories (시드 데이터)
| id | name | nameEn | color | icon |
|----|------|--------|-------|------|
| nlp | 자연어처리 | NLP | #3B82F6 | 💬 |
| cv | 컴퓨터비전 | CV | #10B981 | 👁️ |
| rl | 강화학습 | RL | #F59E0B | 🎮 |
| multimodal | 멀티모달 | Multimodal | #8B5CF6 | 🎨 |
| agent | 에이전트 | Agent | #EF4444 | 🤖 |
| reasoning | 추론 | Reasoning | #EC4899 | 🧠 |
| optimization | 최적화 | Optimization | #14B8A6 | ⚡ |
| safety | 안전성 | Safety | #F97316 | 🛡️ |
| architecture | 아키텍처 | Architecture | #6366F1 | 🏗️ |
| other | 기타 | Other | #6B7280 | 📄 |

### subscribers
| 컬럼 | 타입 | 설명 |
|-------|------|------|
| id | TEXT PK | UUID |
| email | TEXT UNIQUE NOT NULL | 이메일 |
| isActive | BOOLEAN DEFAULT true | 구독 상태 |
| subscribedAt | TEXT NOT NULL | 구독일 |
| unsubscribedAt | TEXT | 해지일 |

### trend_snapshots
| 컬럼 | 타입 | 설명 |
|-------|------|------|
| id | TEXT PK | UUID |
| weekStart | TEXT NOT NULL | 주 시작일 (월요일) |
| category | TEXT NOT NULL | 카테고리 ID |
| paperCount | INTEGER NOT NULL | 해당 주 논문 수 |
| topKeywords | TEXT (JSON) | 핫 키워드 배열 |

## 디렉토리 구조

```
ai-papers/
├── .github/
│   └── workflows/
│       └── collect.yml              # 일일 수집+요약 Cron
├── scripts/
│   ├── collect.ts                   # arXiv 수집 스크립트
│   ├── summarize.ts                 # Claude 요약 스크립트
│   └── seed.ts                      # 카테고리 시드
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (metadata, fonts, theme)
│   │   ├── page.tsx                 # Home: 오늘의 논문
│   │   ├── globals.css              # Tailwind + global styles
│   │   ├── papers/
│   │   │   └── [id]/
│   │   │       └── page.tsx         # 논문 상세
│   │   ├── trends/
│   │   │   └── page.tsx             # 트렌드 분석
│   │   ├── bookmarks/
│   │   │   └── page.tsx             # 북마크 목록
│   │   └── api/
│   │       ├── papers/
│   │       │   └── route.ts         # GET: 논문 목록 (날짜/카테고리/페이지)
│   │       ├── papers/[id]/
│   │       │   └── route.ts         # GET: 논문 상세
│   │       ├── search/
│   │       │   └── route.ts         # GET: 전문 검색
│   │       ├── trends/
│   │       │   └── route.ts         # GET: 트렌드 데이터
│   │       ├── rss/
│   │       │   └── route.ts         # GET: RSS Feed (Slack 연동용)
│   │       └── newsletter/
│   │           └── route.ts         # POST: 구독
│   ├── components/
│   │   ├── ui/                      # shadcn/ui 컴포넌트
│   │   ├── paper-card.tsx           # 논문 카드 (제목, 요약, 카테고리, 북마크)
│   │   ├── paper-list.tsx           # 논문 목록 (그리드/리스트 뷰)
│   │   ├── category-filter.tsx      # 카테고리 필터 탭
│   │   ├── date-nav.tsx             # 날짜 네비게이션 (이전/오늘/다음)
│   │   ├── search-bar.tsx           # 검색바 (디바운스)
│   │   ├── bookmark-button.tsx      # 북마크 토글 버튼
│   │   ├── trend-chart.tsx          # Recharts 트렌드 차트
│   │   ├── newsletter-form.tsx      # 뉴스레터 구독 폼
│   │   ├── hot-badge.tsx            # 🔥 핫 논문 배지
│   │   ├── header.tsx               # 사이트 헤더 + 네비게이션
│   │   └── theme-toggle.tsx         # 다크모드 토글
│   ├── lib/
│   │   ├── db/
│   │   │   ├── schema.ts           # Drizzle 스키마 정의
│   │   │   ├── index.ts            # Turso 클라이언트 + Drizzle 인스턴스
│   │   │   └── queries.ts          # 자주 쓰는 쿼리 함수
│   │   ├── arxiv/
│   │   │   ├── client.ts           # arXiv Atom Feed 클라이언트
│   │   │   ├── parser.ts           # XML → Paper 객체 파싱
│   │   │   └── types.ts            # ArxivEntry, ArxivFeed 타입
│   │   ├── semantic-scholar/
│   │   │   ├── client.ts           # Semantic Scholar API 클라이언트
│   │   │   └── types.ts            # S2Paper 타입
│   │   ├── claude/
│   │   │   ├── client.ts           # Anthropic SDK 래퍼
│   │   │   ├── prompts.ts          # 요약/분류 프롬프트 템플릿
│   │   │   └── types.ts            # SummaryResult 타입
│   │   ├── hot-scorer.ts           # hotScore 계산 로직
│   │   └── utils.ts                # 날짜 포맷, 페이지네이션 등
│   ├── hooks/
│   │   ├── use-bookmarks.ts        # localStorage 북마크 CRUD
│   │   └── use-papers.ts           # SWR/React Query 논문 fetching
│   └── types/
│       └── index.ts                # Paper, Category, TrendData 등 공유 타입
├── drizzle.config.ts                # Drizzle Kit 설정
├── next.config.ts                   # Next.js 설정
├── tailwind.config.ts               # Tailwind 설정
├── package.json
├── tsconfig.json
├── .env.example                     # 환경변수 템플릿
└── .gitignore
```

## 신규 파일 핵심 코드

### `src/lib/db/schema.ts`
- **용도**: 전체 데이터 모델 정의 (Drizzle ORM)
- **After**:
```typescript
import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

export const papers = sqliteTable('papers', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  titleKo: text('title_ko'),
  abstract: text('abstract').notNull(),
  authors: text('authors').notNull(),
  categories: text('categories').notNull(),
  primaryCategory: text('primary_category').notNull(),
  publishedAt: text('published_at').notNull(),
  updatedAt: text('updated_at'),
  arxivUrl: text('arxiv_url').notNull(),
  pdfUrl: text('pdf_url').notNull(),
  summaryKo: text('summary_ko'),
  aiCategory: text('ai_category'),
  hotScore: integer('hot_score').default(0),
  isHot: integer('is_hot', { mode: 'boolean' }).default(false),
  collectedAt: text('collected_at').notNull(),
  summarizedAt: text('summarized_at'),
}, (table) => ({
  publishedAtIdx: index('idx_published_at').on(table.publishedAt),
  aiCategoryIdx: index('idx_ai_category').on(table.aiCategory),
  isHotIdx: index('idx_is_hot').on(table.isHot),
}));
```

### `src/lib/db/index.ts`
- **용도**: Turso 연결 + Drizzle 인스턴스
- **After**:
```typescript
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
```

### `src/lib/arxiv/client.ts`
- **용도**: arXiv Atom Feed API로 논문 수집
- **After**:
```typescript
import { XMLParser } from 'fast-xml-parser';
import type { ArxivEntry } from './types';

const ARXIV_API = 'https://export.arxiv.org/api/query';
const CATEGORIES = ['cs.AI', 'cs.CL', 'cs.LG'];

export async function fetchRecentPapers(maxResults = 100): Promise<ArxivEntry[]> {
  const query = CATEGORIES.map(c => `cat:${c}`).join('+OR+');
  const url = `${ARXIV_API}?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=${maxResults}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`arXiv API error: ${res.status}`);

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);

  const entries = parsed.feed?.entry;
  if (!entries) return [];

  return (Array.isArray(entries) ? entries : [entries]).map(parseEntry);
}

function parseEntry(entry: any): ArxivEntry {
  const id = entry.id.split('/abs/').pop()?.replace(/v\d+$/, '') ?? entry.id;
  return {
    id,
    title: entry.title.replace(/\n/g, ' ').trim(),
    abstract: entry.summary.replace(/\n/g, ' ').trim(),
    authors: (Array.isArray(entry.author) ? entry.author : [entry.author])
      .map((a: any) => a.name),
    categories: (Array.isArray(entry.category) ? entry.category : [entry.category])
      .map((c: any) => c['@_term']),
    primaryCategory: entry['arxiv:primary_category']?.['@_term'] ?? '',
    publishedAt: entry.published,
    updatedAt: entry.updated,
    arxivUrl: `https://arxiv.org/abs/${id}`,
    pdfUrl: `https://arxiv.org/pdf/${id}`,
  };
}
```

### `src/lib/claude/client.ts`
- **용도**: Claude Haiku로 논문 요약 + 카테고리 분류
- **After**:
```typescript
import Anthropic from '@anthropic-ai/sdk';
import { SUMMARY_PROMPT } from './prompts';
import type { SummaryResult } from './types';

const client = new Anthropic();

export async function summarizePaper(title: string, abstract: string): Promise<SummaryResult> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: SUMMARY_PROMPT.replace('{title}', title).replace('{abstract}', abstract),
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text);
}

// 병렬 처리 (rate limit 준수)
export async function summarizeBatch(
  papers: { id: string; title: string; abstract: string }[],
  concurrency = 5
): Promise<Map<string, SummaryResult>> {
  const results = new Map<string, SummaryResult>();

  for (let i = 0; i < papers.length; i += concurrency) {
    const batch = papers.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map(p => summarizePaper(p.title, p.abstract))
    );

    settled.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        results.set(batch[idx].id, result.value);
      } else {
        console.error(`Failed to summarize ${batch[idx].id}:`, result.reason);
      }
    });

    // Rate limit: 1초 대기
    if (i + concurrency < papers.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return results;
}
```

### `src/lib/claude/prompts.ts`
- **용도**: 요약/분류 프롬프트 템플릿
- **After**:
```typescript
export const SUMMARY_PROMPT = `당신은 AI/ML 논문 요약 전문가입니다.

다음 논문의 초록을 읽고 JSON으로 응답하세요:

1. titleKo: 한글 제목 (학술 용어는 영어 유지)
2. summaryKo: 한글 요약 3~5줄 (일반 개발자가 이해할 수 있는 수준, 핵심 기여와 방법론 포함)
3. aiCategory: 아래 카테고리 중 하나만 선택
   - nlp: 자연어처리, 언어모델, 텍스트
   - cv: 컴퓨터비전, 이미지, 비디오
   - rl: 강화학습
   - multimodal: 멀티모달 (텍스트+이미지 등)
   - agent: AI 에이전트, 도구 사용
   - reasoning: 추론, 사고 체인
   - optimization: 학습 최적화, 효율성
   - safety: AI 안전, 정렬
   - architecture: 모델 아키텍처, 트랜스포머
   - other: 위에 해당 없음
4. devRelevance: LLM을 사용하는 개발자에게 얼마나 유용한지 1~5 점수
   - 5: 직접 적용 가능 (새 프롬프팅 기법, 파인튜닝, RAG, 에이전트 패턴, API 활용)
   - 4: 실무에 참고 (벤치마크, 성능 비교, 아키텍처 개선, 추론 최적화)
   - 3: 알면 좋음 (새 모델 발표, 학습 방법론, 데이터셋)
   - 2: 학술적 (이론 중심, 수학 증명, 특수 도메인)
   - 1: 개발자와 무관 (순수 언어학, 뇌과학, 물리 시뮬레이션)

논문 제목: {title}
초록: {abstract}

JSON만 출력하세요:`;
```

**홈 페이지 큐레이션 전략**:
- 수집은 100편 이상 (데이터 보존용)
- **기본 표시: devRelevance ≥ 4인 상위 10개만** (개발자에게 유용한 것만)
- "이번 주 인기" 섹션: Semantic Scholar 인기 논문 5개
- "더 보기" 버튼으로 devRelevance 3 이상 전체 목록 확인 가능
- 하루에 읽어야 할 양: **최대 15편** (신규 10 + 인기 5)

### `scripts/collect.ts`
- **용도**: GitHub Actions에서 실행되는 arXiv 수집 스크립트
- **After**:
```typescript
import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { fetchRecentPapers } from '../src/lib/arxiv/client';
import { calculateHotScore } from '../src/lib/hot-scorer';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('📄 Fetching papers from arXiv...');
  const fetched = await fetchRecentPapers(200);
  console.log(`Found ${fetched.length} papers`);

  let newCount = 0;
  for (const paper of fetched) {
    const hotScore = calculateHotScore(paper);
    await db.insert(papers).values({
      ...paper,
      authors: JSON.stringify(paper.authors),
      categories: JSON.stringify(paper.categories),
      hotScore,
      isHot: hotScore >= 70,
      collectedAt: new Date().toISOString(),
    }).onConflictDoNothing();
    newCount++;
  }

  console.log(`✅ Collected ${fetched.length} papers, ${newCount} new`);
}

main().catch(console.error);
```

### `scripts/summarize.ts`
- **용도**: GitHub Actions에서 실행되는 Claude 요약 스크립트
- **After**:
```typescript
import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { summarizeBatch } from '../src/lib/claude/client';
import { eq, isNull } from 'drizzle-orm';

async function main() {
  const unsummarized = await db.select()
    .from(papers)
    .where(isNull(papers.summarizedAt))
    .limit(200);

  console.log(`📝 ${unsummarized.length} papers to summarize`);
  if (unsummarized.length === 0) return;

  const results = await summarizeBatch(
    unsummarized.map(p => ({ id: p.id, title: p.title, abstract: p.abstract })),
    5
  );

  for (const [id, result] of results) {
    await db.update(papers)
      .set({
        titleKo: result.titleKo,
        summaryKo: result.summaryKo,
        aiCategory: result.aiCategory,
        summarizedAt: new Date().toISOString(),
      })
      .where(eq(papers.id, id));
  }

  console.log(`✅ Summarized ${results.size}/${unsummarized.length} papers`);
}

main().catch(console.error);
```

### `src/lib/hot-scorer.ts`
- **용도**: 핫 논문 점수 계산 (arXiv에서 인용수는 바로 못 가져오므로 휴리스틱)
- **After**:
```typescript
import type { ArxivEntry } from './arxiv/types';

const BUZZ_KEYWORDS = [
  'GPT', 'LLM', 'ChatGPT', 'foundation model', 'large language',
  'reasoning', 'chain-of-thought', 'agent', 'multimodal',
  'benchmark', 'state-of-the-art', 'SOTA', 'scaling',
];

export function calculateHotScore(paper: ArxivEntry): number {
  let score = 0;

  // 저자 수 (대형 팀 = 관심도 높음)
  if (paper.authors.length >= 10) score += 20;
  else if (paper.authors.length >= 5) score += 10;

  // 카테고리 교차 (여러 분야 = 범용성)
  if (paper.categories.length >= 3) score += 15;
  else if (paper.categories.length >= 2) score += 5;

  // 버즈워드 매칭
  const text = `${paper.title} ${paper.abstract}`.toLowerCase();
  const matchCount = BUZZ_KEYWORDS.filter(kw => text.includes(kw.toLowerCase())).length;
  score += Math.min(matchCount * 10, 40);

  // 제목 길이 (짧고 임팩트 있는 제목)
  if (paper.title.length < 60) score += 5;

  return Math.min(score, 100);
}
```

### `src/app/api/rss/route.ts`
- **용도**: RSS 2.0 피드 — Slack, Feedly 등에서 구독 가능
- **After**:
```typescript
import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const hotOnly = searchParams.get('hot') === 'true';

  let query = db.select().from(papers)
    .orderBy(desc(papers.publishedAt))
    .limit(50);

  // 필터링은 where 절로 추가

  const items = await query;

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Paper Digest</title>
    <link>${req.url}</link>
    <description>매일 업데이트되는 AI/LLM 논문 한글 요약</description>
    <language>ko</language>
    <atom:link href="${req.url}" rel="self" type="application/rss+xml"/>
    ${items.map(p => `
    <item>
      <title>${escapeXml(p.titleKo || p.title)}</title>
      <link>${p.arxivUrl}</link>
      <description>${escapeXml(p.summaryKo || p.abstract)}</description>
      <category>${p.aiCategory || 'other'}</category>
      <guid isPermaLink="false">${p.id}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
```

### `.github/workflows/collect.yml`
- **용도**: 일일 논문 수집 + 요약 자동화
- **After**:
```yaml
name: Daily Paper Collection
on:
  schedule:
    - cron: '0 6 * * *'    # 매일 UTC 06:00 (KST 15:00)
  workflow_dispatch:         # 수동 실행

jobs:
  collect-and-summarize:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci

      - name: Collect papers from arXiv
        run: npx tsx scripts/collect.ts
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}

      - name: Collect popular papers from Semantic Scholar
        run: npx tsx scripts/collect-popular.ts
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}

      - name: Summarize with Claude
        run: npx tsx scripts/summarize.ts
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
```

### `.env.example`
- **용도**: 환경변수 템플릿
- **After**:
```
# Turso (hosted SQLite)
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-auth-token

# Claude API
ANTHROPIC_API_KEY=sk-ant-...

# Resend (뉴스레터, Phase 4)
RESEND_API_KEY=re_...

# Cron Secret (API 보호용)
CRON_SECRET=your-random-secret
```

## API 엔드포인트

| Method | Path | 설명 | 파라미터 |
|--------|------|------|----------|
| GET | `/api/papers` | 논문 목록 | `date`, `category`, `page`, `limit` |
| GET | `/api/papers/[id]` | 논문 상세 | - |
| GET | `/api/search` | 전문 검색 | `q`, `category`, `page` |
| GET | `/api/trends` | 트렌드 데이터 | `period` (weekly/monthly) |
| GET | `/api/rss` | RSS Feed | `category` (선택) |
| POST | `/api/newsletter` | 뉴스레터 구독 | `email` |

## 개발 Phase 상세

### Phase 1: Foundation (기반 구축)

**Step 1: 프로젝트 초기화**
- Next.js 15 + TypeScript + Tailwind CSS 생성
- shadcn/ui 초기화 + 기본 컴포넌트 설치
- Drizzle ORM + @libsql/client 설치
- fast-xml-parser, @anthropic-ai/sdk 설치
- .env.example, .gitignore 생성
- 검증: `npm run dev` → localhost:3000 페이지 렌더링

**Step 2: DB 스키마 + 마이그레이션**
- `src/lib/db/schema.ts` — papers, ai_categories, subscribers, trend_snapshots
- `src/lib/db/index.ts` — Turso 연결
- `drizzle.config.ts` 설정
- `npx drizzle-kit push` — 테이블 생성
- `scripts/seed.ts` — 카테고리 시드 데이터 실행
- 검증: DB 연결 + 시드 데이터 조회

### Phase 2: Data Pipeline (데이터 수집)

**Step 1: arXiv 클라이언트**
- `src/lib/arxiv/client.ts` — Atom Feed 수집 + XML 파싱
- `src/lib/arxiv/parser.ts` — 파싱 유틸
- `src/lib/arxiv/types.ts` — ArxivEntry 타입
- 검증: 스크립트 실행 → 논문 10개 콘솔 출력

**Step 2: 수집 스크립트 + GitHub Actions**
- `scripts/collect.ts` — arXiv 신규 논문 수집 → DB 저장
- `scripts/collect-popular.ts` — Semantic Scholar 인기 논문 5개/일 수집
- `src/lib/semantic-scholar/client.ts` — Semantic Scholar API 클라이언트
- `src/lib/hot-scorer.ts` — hotScore 계산
- `.github/workflows/collect.yml` — Cron 워크플로우 (arXiv + S2 + 요약)
- 검증: `npx tsx scripts/collect.ts` + `npx tsx scripts/collect-popular.ts` → DB 저장 확인

**Step 3: Claude 요약 파이프라인**
- `src/lib/claude/client.ts` — Anthropic SDK 래퍼 + 배치 처리
- `src/lib/claude/prompts.ts` — 요약 프롬프트
- `src/lib/claude/types.ts` — SummaryResult 타입
- `scripts/summarize.ts` — 배치 요약 스크립트
- 검증: 논문 3개 요약 생성 + 카테고리 분류 확인

### Phase 3: Core UI (핵심 화면)

**Step 1: 레이아웃 + 홈 페이지**
- `src/app/layout.tsx` — Header, 다크모드, 폰트
- `src/app/page.tsx` — 오늘의 논문 (Server Component)
- `src/components/header.tsx` — 사이트 헤더 + 네비게이션
- `src/components/paper-card.tsx` — 논문 카드
- `src/components/paper-list.tsx` — 논문 그리드
- `src/components/category-filter.tsx` — 카테고리 탭 필터
- `src/components/date-nav.tsx` — 날짜 네비게이션
- `src/components/hot-badge.tsx` — 핫 배지
- `src/app/api/papers/route.ts` — 논문 목록 API
- 검증: 브라우저에서 논문 목록 + 필터 동작

**Step 2: 논문 상세 + 북마크**
- `src/app/papers/[id]/page.tsx` — 상세 페이지
- `src/app/api/papers/[id]/route.ts` — 상세 API
- `src/components/bookmark-button.tsx` — 북마크 버튼
- `src/hooks/use-bookmarks.ts` — localStorage CRUD
- `src/app/bookmarks/page.tsx` — 북마크 목록
- 검증: 상세 표시 + 북마크 추가/삭제/목록

**Step 3: 검색 + RSS Feed**
- `src/components/search-bar.tsx` — 디바운스 검색바
- `src/app/api/search/route.ts` — LIKE 검색 API
- `src/app/api/rss/route.ts` — RSS 2.0 XML 피드 (Slack RSS 앱으로 구독 가능)
- `src/lib/db/queries.ts` — 검색 쿼리
- 검증: 키워드 검색 → 결과 표시 + RSS XML 응답 확인

**RSS Feed 상세**:
- URL: `https://your-domain.vercel.app/api/rss` (또는 `?category=nlp`)
- 형식: RSS 2.0 XML
- 내용: 최근 50편 논문 (제목, 한글 요약, 카테고리, arXiv 링크)
- Slack 연동: Slack에서 `/feed subscribe [RSS URL]` 명령으로 채널 구독
- 핫 논문만: `?hot=true` 파라미터로 핫 논문만 필터

### Phase 4: Advanced (고급 기능)

**Step 1: 핫 논문 하이라이트**
- 홈 상단에 핫 논문 섹션 추가
- 핫 배지 UI 개선
- 핫 필터 탭 추가
- 검증: 상위 5개 핫 논문 하이라이트

**Step 2: 트렌드 분석**
- `src/app/trends/page.tsx` — 트렌드 페이지
- `src/components/trend-chart.tsx` — Recharts 라인/바 차트
- `src/app/api/trends/route.ts` — 트렌드 집계 API
- 검증: 주간/월간 트렌드 차트 렌더링

**Step 3: 뉴스레터**
- `src/components/newsletter-form.tsx` — 구독 폼
- `src/app/api/newsletter/route.ts` — 구독 API (Resend)
- 이메일 HTML 템플릿 (일일 다이제스트)
- 검증: 테스트 이메일 발송

### Phase 5: Deploy (배포)

**Step 1: UI 폴리시**
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 다크모드 완성
- 로딩 스켈레톤 + 에러 상태
- SEO 메타태그 + OG 이미지

**Step 2: Vercel 배포**
- Vercel에 GitHub 리포 연결
- 환경변수 설정 (Turso, Anthropic)
- GitHub Actions secrets 설정
- Cron 동작 확인
- 커스텀 도메인 (선택)
- 검증: 프로덕션 URL에서 전체 기능 동작

## 비용 추정

| 항목 | 월간 비용 | 비고 |
|------|----------|------|
| Claude Haiku (100편/일) | ~$0.60 | 70K tokens/일 |
| Turso 무료 플랜 | $0 | 9GB, 25B reads |
| Vercel 무료 플랜 | $0 | 100GB 대역폭 |
| GitHub Actions | $0 | 2000분/월 (1일 ~5분) |
| Resend 무료 플랜 | $0 | 100통/일 |
| **합계** | **~$0.60/월** | |

## 검증

### Phase별 검증
1. Phase 1: `npm run dev` + DB 연결 + 시드 데이터 확인
2. Phase 2: `npx tsx scripts/collect.ts` + `npx tsx scripts/summarize.ts` 실행
3. Phase 3: 브라우저에서 전체 UI 동작 (목록/상세/검색/북마크)
4. Phase 4: 핫 논문 표시 + 트렌드 차트 + 테스트 이메일
5. Phase 5: Vercel 프로덕션 URL + GitHub Actions Cron 로그

### 최종 E2E
1. `npm run build` — 빌드 성공
2. GitHub Actions 수동 실행 → 수집+요약 완료
3. Vercel 배포 URL 접속 → 논문 목록 표시
4. 카테고리 필터 + 날짜 이동 + 검색 동작
5. 논문 상세 + 한글 요약 표시
6. 북마크 추가/삭제/목록
7. 트렌드 차트 렌더링
8. 뉴스레터 구독 테스트
