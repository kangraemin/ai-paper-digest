# AI Paper Digest - UI Design Prompt (v0.dev / Stitch)

AI Paper Digest - a daily curated AI/LLM content aggregator for developers who use GPT/Claude APIs.

## Problem Statement
Developers who use LLM APIs (GPT, Claude) want to stay updated on practical AI research, but:
1. arXiv papers are too academic and hard to understand
2. Hacker News / Reddit discussions are scattered and noisy
3. No single place curates "what matters for API developers" with actionable summaries
4. Existing paper digest services write for ML researchers, not app developers

## Target User
Backend/frontend developers who call GPT/Claude APIs daily. They don't train models. They want to know: "what new technique can I use in my prompts/RAG/agent tomorrow?"

## Core UX Principles
- Scannable: 3 seconds to decide "read or skip"
- Actionable: every summary ends with "how to apply" and code examples
- Approachable: jargon is always explained (glossary section)
- No information overload: screened, curated, max 5-10 items/day

## Design Direction
Dark theme (zinc-950 bg). Developer tool aesthetic - think Linear meets Hacker News. Monospace accents. Minimal color, category colors as left border accents only. No gradients, no illustrations, no decorative elements. Information density over whitespace.

---

## Page 1: Home (Feed)

### Header
- Monospace logo: `> paper.digest_` with blinking cursor animation
- Nav: `trends` `saved` + theme toggle (sun/moon)
- Sticky, frosted glass bg

### Source Tabs (below header)
Three pill-style tabs: [전체] [논문] [커뮤니티]
- 전체: everything mixed chronologically
- 논문: arXiv papers only
- 커뮤니티: HN + Reddit posts
- Active tab: filled bg, others: ghost

### Topic Filter (below tabs)
Horizontal scrollable chip row:
프롬프팅 · RAG · 에이전트 · 파인튜닝 · 평가 · 최적화 · 보안
- Each chip toggleable, muted default, highlighted on active
- "전체" chip at left (default selected)

### Card List
Cards separated by date headers:
```
─── 오늘 · 5편 ───
[card]
[card]
─── 어제 · 3편 ───
[card]
```

### Card Component (critical - needs to feel organized and scannable)
```
┌──────────────────────────────────────────────────┐
│ ▎ AGENT · 에이전트 · 보안 · 도구사용              │
│ ▎                                                │
│ ▎ AI Agent 시스템의 Security 고려사항        🔥   │
│ ▎                                                │
│ ▎ LLM 에이전트의 보안 위협과 방어 전략을           │
│ ▎ Perplexity 운영 경험 기반으로 정리한 보고서      │
│ ▎                                                │
│ ▎ 👤 에이전트 파이프라인 설계하는 백엔드 개발자     │
│ ▎ ⭐⭐⭐⭐ 관련도 4/5                    3.14    │
└──────────────────────────────────────────────────┘
```

Structure top-to-bottom:
1. **Tag line**: Category badge (colored) + topic tags (outline badges) — establishes context
2. **Title**: Bold, 16-18px, max 2 lines — the hook
3. **One-liner**: Muted color, 14px, max 2 lines with line-clamp — the pitch
4. **Target audience**: Small text with 👤 prefix — who should care
5. **Footer**: Star rating (filled/empty) + relevance label + relative date — metadata

Left border: 3px solid, color matches category (blue/emerald/violet/orange/pink/teal)
Community posts: small HN(orange) or Reddit(blue) icon badge next to category
Hover: subtle bg change + translateY(-1px) shadow

### Empty State
```
¯\_(ツ)_/¯
오늘은 조용한 날이네요.
```

---

## Page 2: Paper Detail

### Top Section
- Back arrow ← link
- Title (text-2xl, bold)
- Original English title (text-sm, muted)
- Flex row: category badge + tag badges + relevance badge with label ("관련도 4/5 · 설정 변경") + bookmark button
- Meta: authors · date · arXiv link · PDF link

### One-liner Highlight
- Amber/yellow tinted background strip
- Large text, the "elevator pitch"

### Content Sections (each with clear heading + divider)

**누가 읽으면 좋은지**
- Plain text, 1-2 sentences

**주요 내용**
- Bullet list (• prefix), each bullet is one key fact
- Clean spacing between bullets

**근거**
- Bullet list with concrete numbers
- Numbers highlighted or bold

**적용 방법**
- Bullet list with actionable steps

**바로 써보기**
- Code block with dark bg (zinc-900), monospace font
- Copy button in top-right corner
- Syntax highlighting if possible

**관련 리소스**
- Link list with external link icons

**용어 사전**
- Grid of term cards (2 columns on desktop, 1 on mobile)
- Each card: term in mono font (bold), explanation below in normal text
- Subtle muted background per card

**Abstract** (collapsible)
- Toggle "원문 Abstract 보기 ▼"
- Muted text when expanded

---

## Design Tokens
- Font: Inter (sans), JetBrains Mono (mono/code)
- Dark bg: zinc-950
- Card bg: zinc-900/50 with zinc-800 border
- Surface: zinc-900
- Text primary: zinc-100
- Text muted: zinc-400
- Text subtle: zinc-500
- Accent: amber-400 (highlights, one-liner)
- Links: blue-400
- Category colors (left border + badge bg):
  - prompting: blue-500
  - rag: emerald-500
  - agent: violet-500
  - fine-tuning: orange-500
  - eval: pink-500
  - cost-speed: teal-500
  - security: red-500
- Radius: rounded-lg (cards), rounded-full (badges)
- Spacing: 4px grid system

## Tech
- Next.js 14+ App Router with Server Components
- Tailwind CSS v4
- shadcn/ui (Badge, Button, Collapsible)
- Korean language UI
- Responsive: single column, max-w-3xl centered

---

## Sample Data (for prototyping)

### Card 1
```json
{
  "aiCategory": "agent",
  "tags": ["에이전트", "보안", "프롬프트인젝션", "도구사용"],
  "title": "AI Agent 시스템의 Security 고려사항",
  "oneLiner": "LLM 에이전트의 보안 위협과 방어 전략을 Perplexity 운영 경험 기반으로 정리한 NIST 대응 보고서",
  "targetAudience": "에이전트 파이프라인 설계하는 백엔드 개발자",
  "devRelevance": 4,
  "isHot": true,
  "source": "arxiv",
  "publishedAt": "2026-03-14"
}
```

### Card 2
```json
{
  "aiCategory": "rag",
  "tags": ["RAG", "청킹", "코드생성"],
  "title": "QChunker: RAG용 질문 인식 텍스트 청킹",
  "oneLiner": "질문을 인식해서 최적의 청크 크기를 자동으로 결정하는 RAG 청킹 프레임워크",
  "targetAudience": "RAG 파이프라인에서 청크 전략을 고민하는 백엔드 개발자",
  "devRelevance": 5,
  "isHot": false,
  "source": "arxiv",
  "publishedAt": "2026-03-13"
}
```

### Card 3 (Community)
```json
{
  "aiCategory": "agent",
  "tags": ["에이전트", "MCP"],
  "title": "Claude Code로 MCP 서버 자동 생성하기",
  "oneLiner": "Claude Code의 에이전트 모드로 MCP 서버를 5분 만에 만드는 방법",
  "targetAudience": "MCP 서버를 처음 만들어보려는 개발자",
  "devRelevance": 5,
  "isHot": true,
  "source": "hacker_news",
  "publishedAt": "2026-03-14"
}
```
