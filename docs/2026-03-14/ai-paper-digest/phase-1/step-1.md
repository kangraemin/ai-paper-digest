# Phase 1 - Step 1: 프로젝트 초기화

## 목표
Next.js 15 프로젝트를 생성하고 필요한 의존성을 모두 설치한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | Next.js 프로젝트 생성 | `package.json`에 next 15.x 존재 | |
| TC-02 | TypeScript 설정 | `tsconfig.json` 존재 + strict 모드 | |
| TC-03 | Tailwind CSS 설정 | `postcss.config` 존재 + `globals.css`에 tailwind 설정 | |
| TC-04 | shadcn/ui 초기화 | `components.json` 존재 + `src/components/ui/` 디렉토리 | |
| TC-05 | 필수 패키지 설치 | `package.json`에 drizzle-orm, @libsql/client, fast-xml-parser, @anthropic-ai/sdk, recharts, resend 존재 | |
| TC-06 | 개발 의존성 | drizzle-kit, tsx 설치 | |
| TC-07 | .env.example | TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, ANTHROPIC_API_KEY 포함 | |
| TC-08 | 빌드 성공 | `npm run build` 에러 없음 | |

## 구현 지시사항
- `npx create-next-app@latest` 사용 (App Router, TypeScript, Tailwind, src/ 디렉토리, ESLint)
- shadcn/ui는 `npx shadcn@latest init` 후 기본 컴포넌트 설치
- plan.md의 .env.example 내용 그대로 사용
