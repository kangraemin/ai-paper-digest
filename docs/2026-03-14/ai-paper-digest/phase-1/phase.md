# Phase 1: Foundation (기반 구축)

## 목표
Next.js 15 프로젝트 초기화 + Turso DB 스키마 구성으로 전체 개발의 기반을 마련한다.

## 범위
- Next.js 15 (App Router) + TypeScript + Tailwind CSS 프로젝트 생성
- shadcn/ui 초기화 + 필수 의존성 설치
- Drizzle ORM 스키마 정의 (papers, ai_categories, subscribers, trend_snapshots)
- Turso 연결 설정 + drizzle.config.ts
- 카테고리 시드 스크립트
- .env.example, .gitignore 구성

## Steps

### Step 1: 프로젝트 초기화
- Next.js 15 + TypeScript + Tailwind CSS 생성
- shadcn/ui 초기화 + Button, Card, Input, Badge, Tabs 기본 컴포넌트 설치
- 필수 패키지 설치: drizzle-orm, @libsql/client, fast-xml-parser, @anthropic-ai/sdk, recharts, resend
- devDependencies: drizzle-kit, tsx
- .env.example 생성
- .gitignore 확인/수정
- 검증: `npm run build` 성공

### Step 2: DB 스키마 + 마이그레이션
- `src/lib/db/schema.ts` — papers, ai_categories, subscribers, trend_snapshots 테이블
- `src/lib/db/index.ts` — Turso 클라이언트 + Drizzle 인스턴스
- `drizzle.config.ts` 설정
- `scripts/seed.ts` — 카테고리 시드 데이터
- 검증: 스키마 빌드 성공 + TypeScript 타입 체크 통과
