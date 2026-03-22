<div align="center">

# AI Paper Digest

**AI 논문과 커뮤니티 트렌드를 매일 아침 개발자 관점으로 한국어 요약.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![Claude AI](https://img.shields.io/badge/Powered%20by-Claude%20AI-D97706)](https://anthropic.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![License](https://img.shields.io/badge/license-MIT-22C55E)](LICENSE)

**[ai-paper-delta.vercel.app](https://ai-paper-delta.vercel.app)**

</div>

---

## What It Does

- **자동 수집** — arXiv · HuggingFace · Hacker News · Reddit에서 매일 최대 15개 선별
- **엄격한 스크리닝** — Claude가 품질 점수화 (논문 score ≥ 7, 커뮤니티 score ≥ 6)
- **한국어 요약** — TL;DR · 핵심 발견 · 적용 가이드 · 코드 예시까지 자동 생성
- **스크리닝 캐시** — 이미 평가한 항목 재스크리닝 방지 (15일 TTL)

## Quick Start

```bash
git clone https://github.com/kangraemin/ai-paper-digest.git
cd ai-paper-digest
npm install
cp .env.example .env.local   # 환경변수 설정
npx drizzle-kit push          # DB 스키마 생성
npm run dev                   # http://localhost:3000
```

## Environment Variables

| 변수 | 필수 | 설명 |
|------|:----:|------|
| `ANTHROPIC_API_KEY` | ✅ | Claude API 키 |
| `TURSO_DATABASE_URL` | ✅ | Turso DB URL |
| `TURSO_AUTH_TOKEN` | ✅ | Turso 인증 토큰 |
| `SLACK_WEBHOOK_URL` | ❌ | 요약 완료 시 Slack 알림 |
| `SITE_URL` | ❌ | 배포된 사이트 URL |
| `RESEND_API_KEY` | ❌ | 뉴스레터 이메일 발송 |

## Pipeline

매일 KST 07:00 자동 실행:

```
논문  arXiv 100개 + HuggingFace 40개  →  score ≥ 7  →  top 5
커뮤  HN 100개 + Reddit 150개         →  score ≥ 6  →  top 10
                        ↓
              Claude 한국어 요약 → Slack → Vercel 리디플로이
```

수동 실행:

```bash
npx tsx scripts/collect-papers.ts     # 논문 수집
npx tsx scripts/collect-community.ts  # 커뮤니티 수집
npx tsx scripts/summarize.ts          # 요약 생성
```

## Tech Stack

| 영역 | 기술 |
|------|------|
| Framework | Next.js 15, React 19, TypeScript 5 |
| AI | Claude Sonnet (요약) · Haiku (스크리닝) |
| Database | Turso + Drizzle ORM |
| Styling | Tailwind CSS v4 + shadcn/ui |

## Contributing

PR 환영합니다. 버그 리포트와 기능 제안은 [Issues](../../issues)로 남겨주세요.

## License

MIT
