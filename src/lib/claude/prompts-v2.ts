// v2 요약 프롬프트: 한 번 호출로 한·영을 같이 쓰고, 구조화 출력(json_schema)으로 받는다.
// 독자가 읽고 나서 "이해된다 → 이렇게 적용하면 되겠다 → 지금 해볼까"까지 가게 만드는 것이 목표.

const TAGS = ['프롬프트엔지니어링', 'RAG', '청킹', '임베딩', '벡터검색', '에이전트', 'MCP', '함수호출', '도구사용',
  '파인튜닝', 'LoRA', 'RLHF', '추론최적화', '양자화', '캐싱', '평가', '벤치마크', '레드팀',
  '보안', '프롬프트인젝션', '프라이버시', '코드생성', '멀티모달'];
const CATEGORIES = ['prompting', 'rag', 'agent', 'fine-tuning', 'eval', 'cost-speed'];

const str = { type: 'string' };
const strs = { type: 'array', items: str };
const glossary = {
  type: 'array',
  items: { type: 'object', properties: { term: str, definition: str }, required: ['term', 'definition'], additionalProperties: false },
};
const LANG_FIELDS = ['oneLiner', 'targetAudience', 'keyFindings', 'evidence', 'howToApply', 'codeExample', 'glossary', 'tags'] as const;
const langProps = (suffix: string) => ({
  [`oneLiner${suffix}`]: str,
  [`targetAudience${suffix}`]: str,
  [`keyFindings${suffix}`]: strs,
  [`evidence${suffix}`]: strs,
  [`howToApply${suffix}`]: strs,
  [`codeExample${suffix}`]: str,
  [`glossary${suffix}`]: glossary,
  [`tags${suffix}`]: strs,
});

export const SUMMARY_SCHEMA_V2 = {
  type: 'object',
  properties: {
    insufficientContent: { type: 'boolean' },
    titleKo: str,
    ...langProps(''),
    ...langProps('En'),
    relatedResources: strs,
    aiCategory: { type: 'string', enum: CATEGORIES },
    devRelevance: { type: 'integer', enum: [1, 2, 3, 4, 5] },
  },
  required: ['insufficientContent', 'titleKo', ...LANG_FIELDS, ...LANG_FIELDS.map(f => `${f}En`), 'relatedResources', 'aiCategory', 'devRelevance'],
  additionalProperties: false,
};

const COMMON_RULES = `## 독자와 목표
독자는 LLM API·에이전트·RAG를 실무에 쓰는 개발자다. ML 전공은 아니다.
다 읽고 나서 세 가지가 바로 들어야 한다.
- 이해: "아, 이게 이런 얘기구나"
- 적용: "우리 서비스의 이 부분에 이렇게 넣으면 되겠다"
- 해보기: "지금 이 프롬프트(코드) 붙여넣고 돌려볼까"

## 사실 규칙 (가장 중요)
- 원문에 있는 것만 쓴다. 원문에 없는 수치·모델명·출시 계획·의도를 추측해 넣지 않는다("~로 추정", "~일 가능성" 금지).
- 수치는 원문 그대로, 무엇과 비교한 수치인지 함께 쓴다(예: "GPT-4o 대비 정답률 12%p↑, MMLU 기준").
- 원문에 근거가 없는 칸은 억지로 채우지 말고 짧게 쓴다.

## 항목 모양 (keyFindings·evidence·howToApply 공통)
배열의 한 항목은 문단이 아니라 아래 모양의 문자열이다. 줄바꿈은 \n.
  짧은 제목(한글 20자 안팎, 영어 6단어 안팎, 마침표 없음)
  - 문장 하나
  - 문장 하나
- 제목만 읽어도 요점이 잡혀야 한다(예: "Playwright는 비용만 올렸다", "effort 올리니 첫 시도 89%").
- 아래 줄은 1~3개. 한 줄에 의미 하나만, 한 문장으로. 접속사로 문장을 이어 붙이지 않는다.

## 칸별 규칙
- titleKo: 한글 제목. 기술 용어·모델명은 영어 그대로.
- oneLiner: 60자 이내 한 문장. "무엇을 했더니 무엇이 됐다". 이걸 보고 3초 안에 읽을지 정한다.
- targetAudience: 구체적 상황+역할 1문장. 예: "RAG 답변이 엉뚱한 문서를 인용해 고민인 백엔드 개발자".
- keyFindings: 3~6개 항목. 개발자끼리 슬랙에서 말하듯 쉽게. 번역체·논문체("~를 제안한다") 금지. 전문 용어는 처음 나올 때 괄호로 풀어 쓴다.
- howToApply: 2~4개 항목, 독자가 할 '액션'. 제목은 할 일("툴 응답 신뢰 필드에 nonce 붙이기"), 아래 줄은 언제·무엇을·어떻게. 명령문으로. "검토해 보면 좋다", "참고하자" 같은 막연한 말 금지. 첫 항목은 오늘 30분 안에 해 볼 수 있는 것.
- codeExample: 독자가 복사해서 바로 돌려볼 '해보기'. 다음 중 하나를 고른다.
  (a) Claude·ChatGPT·Claude Code에 그대로 붙여넣는 프롬프트 — 원문의 방법을 프롬프트로 옮긴 것. 맨 위 한 줄 주석으로 어디에 붙여넣는지 쓰고, 독자가 바꿔 넣을 곳은 {{문서}}·{{질문}}처럼 표시한다.
  (b) 바로 실행되는 짧은 코드(파이썬·TS·셸, 30줄 이내) — 원문에 공개 코드·라이브러리·CLI가 있을 때. 설치 명령 포함. 원문에 없는 API·패키지 이름을 지어내지 않는다.
  원문 방법이 학습·대규모 인프라라서 개인이 따라 할 수 없으면, 그 아이디어를 프롬프트 수준에서 흉내 내 보는 (a)를 쓰고 첫 줄 주석에 "논문 방법의 간이 버전"이라고 밝힌다. 그것도 의미 없으면 빈 문자열.
- glossary: 3~6개. 일반 개발자가 모를 용어만, 비유로 1~2문장.
- tags: 아래 목록에서 1~4개. ${TAGS.join(', ')}
- aiCategory: ${CATEGORIES.join(', ')} 중 하나.
- devRelevance (엄격하게): 5 지금 바로 코드·프롬프트에 적용 / 4 설정·구조 변경으로 적용 / 3 의사결정에 도움(벤치마크·비용 비교) / 2 배경지식 / 1 읽을 필요 없음.

## 영어 칸 (*En)
- 같은 내용을 자연스러운 영어로 쓴다(직역 아님). oneLinerEn은 20단어 이내.
- tagsEn은 tags를 같은 순서로 영어로 옮긴 것(예: 에이전트→Agents, 프롬프트엔지니어링→Prompt Engineering).
- codeExampleEn은 주석·안내문만 영어로 바꾸고 코드는 같게.

insufficientContent는 아래 '내용 부족' 조건일 때만 true. true면 나머지 칸은 빈 값으로 둔다.`;

export const PAPER_PROMPT_V2 = `AI/ML 논문을 실무 개발자에게 소개하는 글을 쓴다.

${COMMON_RULES}

## 논문 전용
- evidence: 2~4개 항목. 논문 실험의 구체적 숫자만(벤치마크 이름·비교 대상 포함). "성능이 좋았다" 금지.
- relatedResources: 논문에 나온 GitHub·데모·데이터셋 링크. 없으면 [].
- 내용 부족: 본문과 초록이 둘 다 사실상 비어 있을 때.

논문 제목: {title}
<paper_content>
{content}
</paper_content>`;

export const COMMUNITY_PROMPT_V2 = `Hacker News에서 화제가 된 AI 관련 글을 실무 개발자에게 소개하는 글을 쓴다.

${COMMON_RULES}

## HN 전용
- keyFindings는 원문 글의 사실만. 댓글 내용을 섞지 않는다.
- evidence는 '커뮤니티 반응' 칸이다: 댓글의 실사용 경험·반론·추가 정보 2~4개 항목. 각 항목 앞에 "댓글:"을 붙이지 말고, 의견이면 "~라는 의견", 경험이면 "~해 봤더니 ~였다는 경험"처럼 출처가 댓글임이 드러나게 쓴다. 쓸 만한 댓글이 없으면 [].
- relatedResources: 원본 URL을 첫 번째로, 그 뒤에 원문·댓글에 나온 링크.
- 원문이 제품 홍보·채용 공고뿐이면 devRelevance를 1~2로.
- 내용 부족: 원문이 150자 미만이고 쓸 만한 댓글도 없을 때.

제목: {title}
원본 URL: {url}
<article>
{content}
</article>
<comments>
{comments}
</comments>`;

// 구조화 출력 결과 → papers 테이블 칸
export function toPaperRow(r: any) {
  const j = (v: unknown) => JSON.stringify(v ?? []);
  return {
    titleKo: r.titleKo,
    oneLiner: r.oneLiner, targetAudience: r.targetAudience,
    keyFindings: j(r.keyFindings), evidence: j(r.evidence), howToApply: j(r.howToApply),
    codeExample: r.codeExample || '', glossary: j(r.glossary), tags: j(r.tags),
    oneLinerEn: r.oneLinerEn, targetAudienceEn: r.targetAudienceEn,
    keyFindingsEn: j(r.keyFindingsEn), evidenceEn: j(r.evidenceEn), howToApplyEn: j(r.howToApplyEn),
    codeExampleEn: r.codeExampleEn || '', glossaryEn: j(r.glossaryEn), tagsEn: j(r.tagsEn),
    relatedResources: j(r.relatedResources), relatedResourcesEn: j(r.relatedResources),
    aiCategory: r.aiCategory, devRelevance: r.devRelevance,
  };
}
