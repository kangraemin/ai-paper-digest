# 검증 라운드 3: 통합 검증

## 검증 항목
| # | 항목 | 결과 | 비고 |
|---|------|------|------|
| 1 | 워크플로우 순서 | PASS | collect-hn.ts(step 3) -> digest-community.ts(step 4) -> summarize.ts(step 5) 순서 정확 |
| 2 | DB 스키마 호환 | PASS | digest-community.ts에서 사용하는 13개 필드(titleKo, oneLiner, targetAudience, keyFindings, evidence, howToApply, codeExample, relatedResources, glossary, tags, aiCategory, devRelevance, summarizedAt) 모두 schema.ts papers 테이블에 존재 |
| 3 | 의존성 체인 | PASS | 6개 import 모두 실제 파일/패키지 존재 확인: `src/lib/db/index.ts`, `src/lib/db/schema.ts`, `drizzle-orm`(package.json), `src/lib/content-fetcher.ts`(fetchContent), `src/lib/hacker-news/client.ts`(fetchHNComments), `src/lib/claude/community-prompts.ts`(COMMUNITY_DIGEST_PROMPT), `child_process`(Node built-in) |
| 4 | plan 일치 | PASS | plan(mossy-humming-chipmunk.md)의 설계 포인트와 구현이 일치: content-fetcher 범용 모듈, fetchHNComments HN 전용, community-prompts 별도 파일, claude -p --model opus 실행, abstract 원문 2000자 교체, 원문 5000자+댓글 15개 제한, workflow step 위치 모두 plan 대로 구현됨 |

## 상세 검증

### 1. 워크플로우 순서
`.github/workflows/collect.yml` step 순서:
1. Collect papers from arXiv (`collect.ts`)
2. Collect popular papers from Semantic Scholar (`collect-popular.ts`)
3. Collect AI stories from Hacker News (`collect-hn.ts`)
4. Digest community content (`digest-community.ts`)
5. Summarize with Claude (`summarize.ts`)

collect-hn -> digest-community -> summarize 순서 정확.

### 2. DB 스키마 호환성
digest-community.ts에서 `.set()`으로 업데이트하는 필드:
- `abstract` - schema.ts L7
- `titleKo` - schema.ts L6
- `oneLiner` - schema.ts L20
- `targetAudience` - schema.ts L21
- `keyFindings` - schema.ts L22
- `evidence` - schema.ts L23
- `howToApply` - schema.ts L24
- `codeExample` - schema.ts L25
- `relatedResources` - schema.ts L26
- `glossary` - schema.ts L27
- `tags` - schema.ts L28
- `aiCategory` - schema.ts L16
- `devRelevance` - schema.ts L17
- `summarizedAt` - schema.ts L34

WHERE 조건에서 사용하는 `source`(L31), `id`(L4) 필드도 존재.

### 3. 의존성 체인
| import | 파일 존재 | export 확인 |
|--------|-----------|-------------|
| `../src/lib/db` | `src/lib/db/index.ts` | db export |
| `../src/lib/db/schema` | `src/lib/db/schema.ts` | papers export |
| `drizzle-orm` | package.json v0.45.1 | eq, isNull, and |
| `../src/lib/content-fetcher` | `src/lib/content-fetcher.ts` | fetchContent |
| `../src/lib/hacker-news/client` | `src/lib/hacker-news/client.ts` | fetchHNComments |
| `../src/lib/claude/community-prompts` | `src/lib/claude/community-prompts.ts` | COMMUNITY_DIGEST_PROMPT |
| `child_process` | Node.js built-in | spawn |

### 4. plan 일치
| plan 설계 포인트 | 구현 상태 |
|-----------------|-----------|
| content-fetcher.ts 범용 모듈 | 구현됨 |
| fetchHNComments HN 전용 | 구현됨 (limit=15) |
| community-prompts.ts 별도 프롬프트 | 구현됨 |
| claude -p --model opus | 구현됨 |
| abstract 원문 2000자 교체 | 구현됨 (`content.slice(0, 2000)`) |
| 원문 5000자 제한 | content-fetcher maxChars=5000 |
| 댓글 15개 제한 | fetchHNComments(hnId, 15) |
| workflow: collect-hn 후 digest 전 summarize | 구현됨 |
| digest에 ANTHROPIC_API_KEY 불필요 | workflow env에 미포함 (claude -p 사용) |

## 결론
PASS - 4개 항목 모두 통과
