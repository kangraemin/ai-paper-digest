# HN 커뮤니티 요약 프롬프트 상세화

## Context
현재 `COMMUNITY_DIGEST_PROMPT`가 "짧고 직관적으로", "3~5개", "1~2개" 등 압축을 강조하여 요약이 너무 간략함. 원문의 핵심 내용이 충분히 전달되지 않아 이해하기 어려움. 더 풀어서 설명하는 방향으로 프롬프트 수정.

## 변경 파일

### 1. `src/lib/claude/community-prompts.ts`

**Before** (현재):
```typescript
export const COMMUNITY_DIGEST_PROMPT = `당신은 AI 커뮤니티 소식을 개발자에게 정리해주는 큐레이터입니다.

다음은 커뮤니티(Hacker News 등)에서 화제가 된 AI 관련 글입니다.
원문 내용과 커뮤니티 댓글을 읽고 JSON으로 정리하세요:

1. titleKo: 한글 제목
2. oneLiner: 한줄 요약 (한글, 1문장)
3. targetAudience: 누가 읽으면 좋은지. 구체적 상황과 역할. (한글, 1~2문장)
4. keyFindings: 원문 핵심 내용 정리. JSON 배열로 작성. (한글, 3~5개)
   규칙:
   - 논문체/번역체 절대 금지.
   - 개발자 슬랙 톤. 짧고 직관적으로.
   - 원문에서 가장 중요한 포인트만 뽑아라.
5. evidence: 커뮤니티 반응 정리. JSON 배열로 작성. (한글, 2~4개)
   - HN 댓글에서 주요 의견, 반론, 추가 정보를 정리
   - "커뮤니티에서는 ~라는 의견이 많았다" 식으로 작성
   - 댓글이 없거나 의미 없으면 "(댓글 정보 없음)"
6. howToApply: 개발자가 참고할 액션. JSON 배열로 작성. (한글, 1~2개)
7. codeExample: 관련 코드가 있으면. 없으면 빈 문자열.
8. relatedResources: 원문/댓글에서 언급된 링크들. 없으면 빈 배열 []
9. glossary: 어려운 용어 2~4개 설명 객체.
   - 키: 용어, 값: 비유나 일상 표현으로 풀어쓴 설명 (1~2문장)
10. tags: 관련 태그 1~4개. 한글로 작성.
   ...
11. aiCategory: ...
12. devRelevance: ...

제목: {title}
원문 내용:
{content}

커뮤니티 댓글:
{comments}

JSON만 출력하세요:`;
```

**After** (변경 후):
```typescript
export const COMMUNITY_DIGEST_PROMPT = `당신은 AI 커뮤니티 소식을 개발자에게 정리해주는 큐레이터입니다.

다음은 커뮤니티(Hacker News 등)에서 화제가 된 AI 관련 글입니다.
원문 내용과 커뮤니티 댓글을 꼼꼼히 읽고 JSON으로 정리하세요.

핵심 원칙: 읽는 사람이 원문을 안 봐도 내용을 충분히 이해할 수 있도록 자세히 풀어쓴다. 지나치게 압축하지 말 것.

1. titleKo: 한글 제목 (기술 용어는 영어 유지)
2. oneLiner: 한줄 요약. 무엇에 대한 글이고 왜 중요한지. (한글, 1~2문장)
3. targetAudience: 누가 읽으면 좋은지. 구체적 상황과 역할. (한글, 1~2문장)
   예: "LLM 기반 서비스를 운영 중인데 비용을 줄이고 싶은 백엔드 개발자"
4. keyFindings: 원문 핵심 내용 정리. JSON 배열로 작성. (한글, 5~8개)
   규칙:
   - 논문체/번역체 절대 금지. "~를 제안한다", "~를 달성했다" 금지.
   - 개발자끼리 대화하는 톤. 자연스럽게 풀어쓰기.
   - 각 항목은 1~2문장으로 맥락을 포함해서 설명. "X 때문에 Y를 했더니 Z가 됐다" 식.
   - 전문 용어는 처음 나올 때 풀어써라. 예: "LoRA(적은 파라미터만 학습하는 기법)"
   - 원문의 핵심 논점, 방법, 결과를 빠짐없이 커버.
   - 구체적 수치/모델명/도구명이 있으면 반드시 포함.
5. evidence (커뮤니티 토론): HN 댓글에서 나온 주요 토론 내용 정리. JSON 배열로 작성. (한글, 3~5개)
   - 주요 의견, 반론, 실사용 경험, 추가 정보를 맥락과 함께 서술
   - "~라는 의견에 대해 ~한 반론이 있었다", "실제로 ~에 적용해봤는데 ~했다는 경험 공유" 식
   - 가능하면 댓글의 구체적 경험담이나 수치를 인용
   - 댓글이 없거나 의미 없으면 "(댓글 정보 없음)"
6. howToApply: 개발자가 바로 참고할 수 있는 액션. JSON 배열로 작성. (한글, 2~4개)
   - 구체적 시나리오 제시. "~하는 경우에 ~를 적용하면 ~한 효과를 얻을 수 있다" 식.
   - 추상적인 조언("공부해보면 좋다") 금지. 실제 행동 가능한 내용만.
7. codeExample: 관련 코드 스니펫 또는 설정 예시. 없으면 빈 문자열.
   - 원문이나 댓글에서 언급된 코드, 명령어, 설정이 있으면 포함
8. relatedResources: 원문/댓글에서 언급된 링크들. 없으면 빈 배열 []
9. glossary: 어려운 용어 설명 객체. (3~6개)
   - 키: 용어 (영어 약자면 영어 그대로)
   - 값: 비유나 일상 표현으로 풀어쓴 설명 (1~2문장)
   - ML 전공이 아닌 일반 개발자가 모를 만한 용어만
10. tags: 관련 태그 1~4개. 한글로 작성.
    사용 가능한 태그:
    "프롬프트엔지니어링", "RAG", "청킹", "임베딩", "벡터검색",
    "에이전트", "MCP", "함수호출", "도구사용",
    "파인튜닝", "LoRA", "RLHF",
    "추론최적화", "양자화", "캐싱",
    "평가", "벤치마크", "레드팀",
    "보안", "프롬프트인젝션", "프라이버시",
    "코드생성", "멀티모달"
11. aiCategory: prompting, rag, agent, fine-tuning, eval, cost-speed 중 하나
12. devRelevance: 1~5 점수
    - 5: 지금 바로 코드에 적용 가능
    - 4: 설정/아키텍처 변경으로 적용
    - 3: 알아두면 의사결정에 도움
    - 2: 배경지식으로 유용
    - 1: 읽을 필요 없음

제목: {title}
원문 내용:
{content}

커뮤니티 댓글:
{comments}

JSON만 출력하세요:`;
```

프롬프트 하단 입력부에 URL 추가:
```
제목: {title}
원본 URL: {url}
원문 내용:
{content}
```

`relatedResources` 설명에 원본 링크 필수 포함 규칙 추가:
```
8. relatedResources: 원문/댓글에서 언급된 링크들. 원본 URL은 반드시 첫 번째로 포함. 없으면 원본 URL만 담은 배열.
```

### 2. `scripts/digest-community.ts`

**Before** (line 63~66):
```typescript
const prompt = COMMUNITY_DIGEST_PROMPT
  .replace('{title}', item.title)
  .replace('{content}', content || '(원문을 가져올 수 없습니다)')
  .replace('{comments}', comments.length > 0 ? comments.join('\n---\n') : '(댓글 없음)');
```

**After**:
```typescript
const prompt = COMMUNITY_DIGEST_PROMPT
  .replace('{title}', item.title)
  .replace('{url}', item.arxivUrl)
  .replace('{content}', content || '(원문을 가져올 수 없습니다)')
  .replace('{comments}', comments.length > 0 ? comments.join('\n---\n') : '(댓글 없음)');
```

### 3. `scripts/bulk-collect.ts`

**Before** (line 90):
```typescript
const stories = await fetchHNStoriesAlgolia({ daysBack: 180, minScore: 50 });
```

**After**:
```typescript
const stories = await fetchHNStoriesAlgolia({ daysBack: 240, minScore: 50 });
```

8개월(240일) 분량으로 확장. `fetchHNStoriesAlgolia`는 이미 `daysBack` 파라미터를 지원하므로 값만 변경.

## 주요 변경 요약

| 항목 | Before | After |
|------|--------|-------|
| 핵심 원칙 | 없음 | "원문을 안 봐도 이해할 수 있도록 자세히 풀어쓴다" 추가 |
| oneLiner | 1문장 | 1~2문장, "왜 중요한지" 포함 |
| keyFindings | 3~5개, "짧고 직관적으로" | 5~8개, "1~2문장으로 맥락 포함", 전문용어 풀어쓰기, 수치/모델명 필수 |
| evidence | 2~4개, 이름만 "evidence" | 3~5개, 라벨을 "커뮤니티 토론"으로 변경, 맥락 서술 강조 |
| howToApply | 1~2개 | 2~4개, 구체적 시나리오 필수, 추상적 조언 금지 |
| glossary | 2~4개 | 3~6개 |
| 톤 | "짧고 직관적으로" | "개발자끼리 대화하는 톤. 자연스럽게 풀어쓰기" |
| relatedResources | 링크 있으면 포함 | 원본 URL 반드시 첫 번째 포함 |
| 프롬프트 입력 | title, content, comments | title, **url**, content, comments |
| HN 수집 기간 | 180일 (6개월) | 240일 (8개월) |

## 검증
- `npx tsx scripts/digest-community.ts` 실행하여 HN 글 1개 요약 생성
- 생성된 요약의 keyFindings 항목 수(5~8개), evidence 항목 수(3~5개) 확인
- 각 항목이 1~2문장으로 맥락을 포함하는지 확인
