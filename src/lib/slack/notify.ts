const categoryColors: Record<string, string> = {
  prompting: '#3b82f6',
  rag: '#10b981',
  agent: '#8b5cf6',
  'fine-tuning': '#f97316',
  finetuning: '#f97316',
  eval: '#ec4899',
  'cost-speed': '#14b8a6',
  cost: '#14b8a6',
  security: '#ef4444',
};

function parseJsonArray(value: string | null | undefined): string[] {
  if (!value) return [];
  try {
    const arr = JSON.parse(value);
    if (Array.isArray(arr)) return arr;
  } catch {}
  return value.split('\n').filter(l => l.trim()).map(l => l.replace(/^-\s*/, ''));
}

function truncate(s: string | null | undefined, n: number): string {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '...' : s;
}

export interface PaperForSlack {
  id: string;
  title: string;
  titleKo?: string | null;
  aiCategory?: string | null;
  source?: string | null;
  oneLiner?: string | null;
  oneLinerEn?: string | null;
  keyFindings?: string | null;
  keyFindingsEn?: string | null;
  howToApply?: string | null;
  howToApplyEn?: string | null;
  targetAudience?: string | null;
  targetAudienceEn?: string | null;
}

function getSourceLabel(source: string | null | undefined, lang: string): string {
  const isEn = lang === 'en';
  switch (source) {
    case 'hacker_news': return 'Hacker News';
    case 'reddit': return 'Reddit';
    case 'arxiv': return isEn ? 'Paper (arXiv)' : '논문 (arXiv)';
    case 'hugging_face': return isEn ? 'Paper (HuggingFace)' : '논문 (HuggingFace)';
    default: return isEn ? 'Paper' : '논문';
  }
}

export function buildSlackPayload(paper: PaperForSlack, siteUrl: string, lang: string = 'ko') {
  const isEn = lang === 'en';
  const title = isEn ? (paper.title) : (paper.titleKo || paper.title);
  const category = paper.aiCategory || 'AI';
  const sourceLabel = getSourceLabel(paper.source, lang);
  const pageUrl = `${siteUrl}/${lang}/papers/${paper.id}`;
  const color = categoryColors[category] ?? '#6b7280';

  const oneLiner = isEn ? (paper.oneLinerEn || paper.oneLiner) : paper.oneLiner;
  const findings = parseJsonArray(isEn ? (paper.keyFindingsEn || paper.keyFindings) : paper.keyFindings).slice(0, 2);
  const applies = parseJsonArray(isEn ? (paper.howToApplyEn || paper.howToApply) : paper.howToApply).slice(0, 2);
  const audience = truncate(isEn ? (paper.targetAudienceEn || paper.targetAudience) : paper.targetAudience, 300);

  const bodyParts: string[] = [];
  if (oneLiner) bodyParts.push(`*TL;DR*\n${oneLiner}`);
  if (findings.length > 0) bodyParts.push(`*Core Mechanics*\n${findings.map(f => `• ${f}`).join('\n')}`);
  if (applies.length > 0) bodyParts.push(`*How to apply*\n${applies.map(a => `• ${a}`).join('\n')}`);
  if (audience) bodyParts.push(`*${isEn ? 'Who Should Read' : '대상 독자'}*\n${audience}`);

  const headerText = truncate(`[${category}][${sourceLabel}] ${title}`, 149);

  return {
    attachments: [
      {
        color,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*<${pageUrl}|${headerText}>*`,
            },
          },
          ...(bodyParts.length > 0
            ? [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: bodyParts.join('\n\n'),
                  },
                },
              ]
            : []),
        ],
      },
    ],
  };
}

export async function sendSlackNotification(
  paper: PaperForSlack,
  botToken: string,
  channelId: string,
  siteUrl: string,
  lang: string = 'ko'
): Promise<boolean> {
  const payload = buildSlackPayload(paper, siteUrl, lang);
  const res = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${botToken}`,
    },
    body: JSON.stringify({ channel: channelId, ...payload }),
  });
  const data = await res.json();
  return data.ok;
}
