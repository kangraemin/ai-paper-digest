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
  keyFindings?: string | null;
  howToApply?: string | null;
  targetAudience?: string | null;
}

function getSourceLabel(source: string | null | undefined): string {
  switch (source) {
    case 'hacker_news': return 'Hacker News';
    case 'reddit': return 'Reddit';
    case 'arxiv': return '논문 (arXiv)';
case 'hugging_face': return '논문 (HuggingFace)';
    default: return '논문';
  }
}

export function buildSlackPayload(paper: PaperForSlack, siteUrl: string) {
  const title = paper.titleKo || paper.title;
  const category = paper.aiCategory || 'AI';
  const sourceLabel = getSourceLabel(paper.source);
  const pageUrl = `${siteUrl}/papers/${paper.id}`;
  const color = categoryColors[category] ?? '#6b7280';

  const findings = parseJsonArray(paper.keyFindings).slice(0, 2);
  const applies = parseJsonArray(paper.howToApply).slice(0, 2);
  const audience = truncate(paper.targetAudience, 300);

  const bodyParts: string[] = [];
  if (paper.oneLiner) bodyParts.push(`*TL;DR*\n${paper.oneLiner}`);
  if (findings.length > 0) bodyParts.push(`*Core Mechanics*\n${findings.map(f => `• ${f}`).join('\n')}`);
  if (applies.length > 0) bodyParts.push(`*How to apply*\n${applies.map(a => `• ${a}`).join('\n')}`);
  if (audience) bodyParts.push(`*대상 독자*\n${audience}`);

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
  webhookUrl: string,
  siteUrl: string
): Promise<boolean> {
  const payload = buildSlackPayload(paper, siteUrl);
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return res.ok;
}
