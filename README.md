<div align="center">

# AI Paper Digest

**Claude AI가 매일 arXiv 최신 LLM 논문을 읽고, 한국어로 요약합니다.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Claude AI](https://img.shields.io/badge/Powered%20by-Claude%20AI-D97706)](https://anthropic.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-22C55E)](LICENSE)

</div>

---

논문 읽을 시간은 없지만 흐름은 놓치고 싶지 않은 개발자를 위한 도구입니다.

arXiv, Hacker News, Semantic Scholar에서 LLM 관련 논문을 자동 수집하고,
Claude가 **TL;DR · 핵심 메커니즘 · 실무 적용법 · 코드 예시**까지 한국어로 정리합니다.

## Features

- **자동 수집** — arXiv, Hacker News, Semantic Scholar에서 매일 최신 논문 가져오기
- **AI 요약** — Claude 3.5 Sonnet이 구조화된 한국어 요약 생성 (TL;DR, 증거, 적용 가이드, 코드 예시)
- **카테고리 분류** — Prompting / RAG / Agent / Fine-tuning / Eval / Cost-Speed / Security
- **개발자 관련도** — 논문마다 실무 적용 가능성 0–100% 점수화
- **트렌드 차트** — 주간·월간 카테고리별 흐름 시각화
- **북마크** — 읽고 싶은 논문 로컬 저장 및 필터링
- **RSS + 뉴스레터** — 구독 방식 자유롭게 선택
- **다크 모드** — 시스템 설정 자동 감지

## Quick Start

```bash
git clone https://github.com/your-username/ai-paper-digest.git
cd ai-paper-digest
npm install
cp .env.example .env.local
```

`.env.local`에 API 키 설정 후:

```bash
npm run db:push   # DB 스키마 생성
npm run dev       # http://localhost:3000
```

## Environment Variables

| 변수 | 필수 | 설명 |
|------|:----:|------|
| `ANTHROPIC_API_KEY` | ✅ | Claude API 키 |
| `DATABASE_URL` | ✅ | LibSQL 경로 (기본값: `file:./papers.db`) |
| `RESEND_API_KEY` | ❌ | 뉴스레터 이메일 발송 |

## Paper Pipeline

```
arXiv API
    └─ 키워드 필터링 (Claude Haiku)
           └─ 요약 생성 (Claude Sonnet 3.5)
                  └─ SQLite 저장 → UI
```

수동 실행:

```bash
npm run fetch     # 논문 수집
npm run summarize # 요약 생성
```

## Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | Next.js 15, React 19, TypeScript 5 |
| AI | Anthropic SDK — Claude 3.5 Sonnet / Haiku |
| Database | SQLite + Drizzle ORM |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Charts | Recharts |
| Email | Resend |

## Paper Detail Structure

Claude가 각 논문에 대해 생성하는 항목:

| 항목 | 설명 |
|------|------|
| `oneLiner` | 한 문장 요약 |
| `keyFindings` | 핵심 발견 3–5개 |
| `evidence` | 실험 결과 및 수치 근거 |
| `howToApply` | 개발자 실무 적용 가이드 |
| `codeExample` | 구현 코드 스니펫 |
| `glossary` | 주요 용어 한국어 설명 |
| `devRelevance` | 실무 관련도 점수 (0–100) |

## API Endpoints

```
GET /api/papers          # 논문 목록 (페이지네이션, 필터)
GET /api/papers/[id]     # 논문 상세
GET /api/search?q=       # 전문 검색
GET /api/trends          # 주간·월간 트렌드
GET /api/rss             # RSS 피드
POST /api/newsletter     # 뉴스레터 구독
```

## Contributing

PR 환영합니다. 버그 리포트와 기능 제안은 [Issues](../../issues)로 남겨주세요.

## License

MIT
