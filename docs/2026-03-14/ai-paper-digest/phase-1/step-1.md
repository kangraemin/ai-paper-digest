# Phase 1 - Step 1: 프로젝트 초기화

## 목표
Next.js 15 프로젝트를 생성하고 필요한 의존성을 모두 설치한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | Next.js 프로젝트 생성 | `package.json`에 next 15.x 존재 | ✅ |
| TC-02 | TypeScript 설정 | `tsconfig.json` 존재 + strict 모드 | ✅ |
| TC-03 | Tailwind CSS 설정 | `postcss.config.mjs` 존재 + `globals.css`에 tailwind 설정 | ✅ |
| TC-04 | shadcn/ui 초기화 | `components.json` 존재 + `src/components/ui/` 디렉토리 | ✅ |
| TC-05 | 필수 패키지 설치 | `package.json`에 drizzle-orm, @libsql/client, fast-xml-parser, @anthropic-ai/sdk, recharts, resend 존재 | ✅ |
| TC-06 | 개발 의존성 | drizzle-kit, tsx 설치 | ✅ |
| TC-07 | .env.example | TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, ANTHROPIC_API_KEY 포함 | ✅ |
| TC-08 | 빌드 성공 | `npm run build` 에러 없음 | ✅ |

## 구현 지시사항
- `npx create-next-app@latest` 사용 (App Router, TypeScript, Tailwind, src/ 디렉토리, ESLint)
- shadcn/ui는 `npx shadcn@latest init` 후 기본 컴포넌트 설치
- plan.md의 .env.example 내용 그대로 사용

## 실행 결과

TC-01: `node -e "const p = require('./package.json'); console.log(p.dependencies.next)"`
→ ^15.5.12

TC-02: `node -e "const t = require('./tsconfig.json'); console.log(t.compilerOptions.strict)"`
→ true

TC-03: `ls postcss.config.mjs && grep tailwind src/app/globals.css`
→ postcss.config.mjs 존재, globals.css에 `@import "tailwindcss"` 포함

TC-04: `ls src/components/ui/`
→ badge.tsx button.tsx card.tsx input.tsx tabs.tsx

TC-05: package.json dependencies 확인
→ drizzle-orm: ^0.45.1, @libsql/client: ^0.17.0, fast-xml-parser: ^5.5.5, @anthropic-ai/sdk: ^0.78.0, recharts: ^3.8.0, resend: ^6.9.3

TC-06: package.json devDependencies 확인
→ drizzle-kit: ^0.31.9, tsx: ^4.21.0

TC-07: `grep -E 'TURSO_DATABASE_URL|TURSO_AUTH_TOKEN|ANTHROPIC_API_KEY' .env.example`
→ 3개 모두 존재

TC-08: `npm run build`
→ ✓ Compiled successfully, ✓ Generating static pages (5/5), 빌드 성공
