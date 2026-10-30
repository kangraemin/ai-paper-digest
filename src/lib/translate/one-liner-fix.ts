// oneLinerEn 규칙 기반 후처리·검사기 (LLM 호출 없음, 의존성 없음).
// 어색함 기준: .claude/ralph-x-runs/translate-prompt-fix/log.md
//  - A/An/The/This/These/Researchers/Research 로 시작
//  - 2문장 이상 (편집자 꼬리말)
//  - "A study demonstrates" 같은 모호한 주어, 수동·격식체("is made more", "aims to", "serves as")

const ABBREVIATIONS = new Set([
  'e.g', 'i.e', 'vs', 'etc', 'inc', 'approx', 'fig', 'no', 'dr', 'mr', 'ms', 'cf', 'al',
]);

/** 첫 문장만 남긴다. 약어(vs. e.g.)·소수점·U.S. 에서는 자르지 않는다. */
export function firstSentence(text: string): string {
  const t = text.trim();
  const re = /([a-z0-9)\]%'"”’])\.\s+(?=["'“‘]?[A-Z])/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(t))) {
    const dotIdx = m.index + 1;
    const before = t.slice(0, dotIdx);
    const lastTok = (before.match(/([A-Za-z.]+)$/)?.[1] ?? '').toLowerCase();
    if (ABBREVIATIONS.has(lastTok)) continue;
    return t.slice(0, dotIdx + 1);
  }
  return t;
}

const BANNED_OPENER = /^(A|An|The|This|These|Those|Researchers?|Research)\s/;
const VAGUE_STUDY = /^(A|An|The)\s+((new|recent|large-scale|\d+-\w+)\s+)?(study|survey|paper|report|analysis|review)\b/i;
const FORMAL_PHRASES = /\b(aims? to|serves? as|is characterized by|is made (more|less)|are made (more|less))\b/i;

export function sentenceCount(text: string): number {
  let n = 0;
  let rest = text.trim();
  while (rest) {
    const s = firstSentence(rest);
    n++;
    if (s.length >= rest.length) break;
    rest = rest.slice(s.length).trim();
  }
  return n;
}

export function awkwardReasons(text: string): string[] {
  const r: string[] = [];
  const t = text.trim();
  if (BANNED_OPENER.test(t)) r.push('banned-opener');
  if (VAGUE_STUDY.test(t)) r.push('vague-study');
  if (sentenceCount(t) > 1) r.push('multi-sentence');
  if (FORMAL_PHRASES.test(t)) r.push('formal-passive');
  if (/\bis an? [\w\s-]+ (that|for|which) /i.test(t)) r.push('is-a-definition');
  return r;
}

export function isAwkwardOneLiner(text: string): boolean {
  return awkwardReasons(text).length > 0;
}

// ---------- 제목에서 고유 이름 뽑기 ----------

const GENERIC_FIRST = new Set([
  'towards', 'toward', 'on', 'understanding', 'exploring', 'rethinking', 'improving', 'efficient',
  'effective', 'unlocking', 'navigating', 'show', 'ask', 'why', 'how', 'what', 'can', 'is', 'are',
  'do', 'does', 'a', 'an', 'the', 'my', 'our', 'new', 'learning', 'beyond', 'when',
]);

export function coinedNameFromTitle(title?: string): string | null {
  if (!title) return null;
  const t = title.replace(/^Show HN:\s*/i, '').trim();
  const m = t.match(/^(.{2,40}?)\s*(?::|\s[–—-]\s)/);
  if (!m) return null;
  const cand = m[1].trim();
  if (/[$\\{}]/.test(cand)) return null;
  const words = cand.split(/\s+/);
  if (words.length > 3) return null;
  if (GENERIC_FIRST.has(words[0].toLowerCase())) return null;
  if (/\?$/.test(cand)) return null;
  const distinctive = /\d/.test(cand) || /[a-z][A-Z]|[A-Z]{2,}/.test(cand) || /-/.test(cand);
  const allCap = words.every((w) => /^[A-Z]/.test(w));
  if (words.length === 1 && (distinctive || (allCap && cand.length >= 4))) return cand;
  if (distinctive && allCap) return cand;
  if (words.length === 2 && allCap && !words.some((w) => /ing$/i.test(w))) return cand;
  return null;
}

// ---------- 명사구 주어 치환 ----------

const VERBS = new Set(`measures structures reduces cuts allowed identifies removes eliminates provides enables exploits
applies improves achieves blocks extracts searches scores boosts details detects generates shows reveals demonstrates
outperforms introduces uses learns lets reaches surpasses uncovers mitigates prevents compresses accelerates selects
routes trains finds offers helps combines leverages delivers raises lowers speeds saves yields causes outlines proposes
presents predicts evaluates tests maps converts automates costs makes requires supports runs preserves retains maintains
enabled reduced improved achieved showed revealed found built produced created caused exposed leaked gives
exceeds beats matches rivals bypasses steals injects hijacks breaks fixes protects secures verifies validates checks
adapts adopts trims prunes shrinks scales lifts drops increases decreases highlights
unlocks turns compares explains explores analyzes quantifies characterizes catches flags filters ranks
simulates tracks records stores retrieves reasons plans solves wins fails struggles remains works performs executes
halved faced leveraged discovered launched writes reads embeds decodes encodes aligns steers guides drives powers cracks crashes`.split(/\s+/));

const FILLER_ADJ = /^(novel|new|comprehensive|unified|simple|systematic|first|recent|open-source|large-scale)\s+/i;
const OPENERS = /^(A|An|The|This|These)\s+/;
const REL_CLAUSE = /\b(that|which|where|who|whose)\b/i;
const PARTICIPLE_IN_NP = /\b(applying|using|leveraging|composed|based|featuring|built|powered|trained|designed|combining|relying)\b/i;
const EDITORIAL_TAIL = /,\s*(highlighting|underscoring|raising|illustrating|emphasizing|signaling|showing the need|revealing the need)\b.*$/i;
const ACRONYM_ONLY = /^(LLMs?|AI|ML|RL|NLP|MLLMs?|VLMs?)$/;

function capFirst(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface Split { np: string; rest: string }

function splitAtVerb(text: string): Split | null {
  const tokens = text.split(/\s+/);
  for (let i = 1; i < Math.min(tokens.length, 14); i++) {
    const w = tokens[i].replace(/[,;]$/, '').toLowerCase();
    if (VERBS.has(w)) {
      return { np: tokens.slice(0, i).join(' '), rest: tokens.slice(i).join(' ') };
    }
  }
  return null;
}

/** NP 안에 의미 있는 고유 개체(따옴표 용어·숫자·대문자 고유명사)가 있나. LLM/AI 같은 범용 약어는 제외. */
function hasSpecificEntity(np: string): boolean {
  if (/['‘“"][^'’”"]{2,}['’”"]/.test(np)) return true;
  const toks = np.split(/\s+/).slice(1);
  return toks.some((w) => {
    const c = w.replace(/[^\w-]/g, '');
    if (!c || ACRONYM_ONLY.test(c)) return false;
    return /\d/.test(c) || /^[A-Z][a-z]+[A-Z]/.test(c) || /^[A-Z]{2,}\d*$/.test(c) || /^[A-Z][a-z]{2,}$/.test(c);
  });
}

function stripLeadingFiller(s: string): string {
  let out = s;
  while (FILLER_ADJ.test(out)) out = out.replace(FILLER_ADJ, '');
  return out;
}

/** "A study demonstrates that X" -> "X" */
function stripStudyLead(text: string): string | null {
  const m = text.match(/^(A|An|The)\s+((new|recent|large-scale|\d+-\w+)\s+)?(study|analysis|report|paper|survey)\s+(demonstrates?|shows?|reveals?|finds?|indicates?|suggests?)\s+(that\s+)?(.+)$/i);
  if (!m) return null;
  let rest = m[7];
  const wh = rest.match(/^while\s+(.+?),\s+(?:it|they)\s+(.+)$/i);
  if (wh) rest = `${wh[1]} but ${wh[2]}`;
  return capFirst(rest);
}

/** 규칙만으로 고칠 수 있는 만큼 고친다. 못 고치면 (첫 문장 자르기만 적용한) 원문 반환. */
export function ruleFixOneLiner(raw: string, title?: string): string {
  let text = firstSentence(raw.trim().replace(/^(["'])([\s\S]*)\1$/, '$2'));
  text = text.replace(EDITORIAL_TAIL, '.');
  if (!/[.!?]["'”’)]*$/.test(text)) text += '.';

  const study = stripStudyLead(text);
  if (study) text = study;

  if (!BANNED_OPENER.test(text)) return text;

  const rr = text.match(/^Researchers?\s+(?:have\s+)?(?:demonstrate|show|find|reveal|report)s?\s+(?:that\s+)?(.+)$/i);
  if (rr) return capFirst(rr[1]);

  if (!OPENERS.test(text)) return text;
  const sp = splitAtVerb(text);
  if (!sp) return text;
  const np = sp.np;
  const name = coinedNameFromTitle(title);
  const bare = stripLeadingFiller(np.replace(OPENERS, ''));

  if (REL_CLAUSE.test(np)) return text;

  // 1) NP 에 구체적 개체가 있으면 관사만 뗀다 (분사구가 붙은 NP 는 제외)
  if (hasSpecificEntity(np) && !PARTICIPLE_IN_NP.test(np) && np.split(/\s+/).length <= 8) {
    return capFirst(`${bare} ${sp.rest}`);
  }
  // 2) 제목의 고유 이름이 있으면 NP 전체를 이름으로 교체
  if (name && !text.includes(name)) {
    return `${name} ${sp.rest}`;
  }
  // 3) LLM/AI 같은 범용 약어뿐이어도 짧고 분사구가 없으면 관사만 뗀다
  const toks = bare.split(/\s+/);
  if (toks.some((w) => ACRONYM_ONLY.test(w.replace(/[^\w]/g, ''))) && toks.length <= 6 && !PARTICIPLE_IN_NP.test(np)) {
    return capFirst(`${bare} ${sp.rest}`);
  }
  return text;
}
