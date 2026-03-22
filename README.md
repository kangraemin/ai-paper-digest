<div align="center">

# AI Paper Digest

**LLM 최신 논문을 매일 수집해 개발자 관점으로 한국어 요약을 제공합니다.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Claude AI](https://img.shields.io/badge/Powered%20by-Claude%20AI-D97706)](https://anthropic.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-22C55E)](LICENSE)

</div>

## Features

- **자동 수집** — arXiv, Hacker News, Reddit, Semantic Scholar, Papers with Code에서 매일 수집
- **AI 요약** — Claude가 TL;DR · 핵심 메커니즘 · 실험 결과 · 적용 가이드 · 코드 예시 생성
- **개발자 관련도** — 논문마다 실무 적용 가능성 0–100% 점수화
- **카테고리 필터** — Prompting / RAG / Agent / Fine-tuning / Eval / Cost-Speed / Security
- **트렌드 차트** — 주간·월간 카테고리별 흐름 시각화
- **RSS + 뉴스레터** — 구독 방식 자유롭게 선택

## Quick Start

```bash
git clone https://github.com/your-username/ai-paper-digest.git
cd ai-paper-digest
npm install
cp .env.example .env.local
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
arXiv / HN / Reddit / Semantic Scholar / Papers with Code
    └─ 키워드 필터링 (Claude Haiku)
           └─ 요약 생성 (Claude Sonnet)
                  └─ SQLite 저장 → UI
```

수동 실행:

```bash
npx tsx scripts/collect.ts    # 논문 수집
npx tsx scripts/summarize.ts  # 요약 생성
```

## Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | Next.js 15, React 19, TypeScript 5 |
| AI | Anthropic SDK — Claude Sonnet / Haiku |
| Database | SQLite + Drizzle ORM + LibSQL |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Email | Resend |

## Contributing

PR 환영합니다. 버그 리포트와 기능 제안은 [Issues](../../issues)로 남겨주세요.

## License

MIT
