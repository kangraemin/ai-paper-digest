export interface PaperSummary {
  id: string;
  title: string;
  titleKo: string | null;
  oneLiner: string | null;
  aiCategory: string | null;
  devRelevance: number | null;
  arxivUrl: string;
}

export interface DigestData {
  date: string;
  totalCount: number;
  hotPapers: PaperSummary[];
  topDevPapers: PaperSummary[];
  categoryBreakdown: { category: string; count: number }[];
  siteUrl: string;
  unsubscribeUrl: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  nlp: '자연어처리',
  cv: '컴퓨터비전',
  rl: '강화학습',
  multimodal: '멀티모달',
  agent: '에이전트',
  reasoning: '추론',
  optimization: '최적화',
  safety: '안전성',
  architecture: '아키텍처',
  other: '기타',
};

function renderPaperRow(paper: PaperSummary): string {
  const title = paper.titleKo || paper.title;
  const category = paper.aiCategory ? (CATEGORY_LABELS[paper.aiCategory] || paper.aiCategory) : '';
  return `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
        <a href="${paper.arxivUrl}" style="color: #1d4ed8; text-decoration: none; font-weight: 600; font-size: 14px;">${title}</a>
        ${paper.oneLiner ? `<p style="margin: 4px 0 0; color: #4b5563; font-size: 13px;">${paper.oneLiner}</p>` : ''}
        ${category ? `<span style="display: inline-block; margin-top: 4px; padding: 2px 8px; background: #f3f4f6; border-radius: 4px; font-size: 11px; color: #6b7280;">${category}</span>` : ''}
      </td>
    </tr>`;
}

export function renderDailyDigest(data: DigestData): string {
  const { date, totalCount, hotPapers, topDevPapers, categoryBreakdown, siteUrl, unsubscribeUrl } = data;

  const hotSection = hotPapers.length > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr><td style="padding: 12px 0; font-size: 16px; font-weight: 700; color: #111827;">🔥 핫 논문</td></tr>
      ${hotPapers.map(renderPaperRow).join('')}
    </table>` : '';

  const devSection = topDevPapers.length > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr><td style="padding: 12px 0; font-size: 16px; font-weight: 700; color: #111827;">💡 개발자 추천</td></tr>
      ${topDevPapers.map(renderPaperRow).join('')}
    </table>` : '';

  const categoryRows = categoryBreakdown
    .sort((a, b) => b.count - a.count)
    .map(({ category, count }) => {
      const label = CATEGORY_LABELS[category] || category;
      return `<tr><td style="padding: 4px 0; font-size: 13px; color: #4b5563;">${label}</td><td style="padding: 4px 0; font-size: 13px; color: #111827; text-align: right; font-weight: 600;">${count}편</td></tr>`;
    }).join('');

  const categorySection = categoryBreakdown.length > 0 ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
      <tr><td colspan="2" style="padding: 12px 0; font-size: 16px; font-weight: 700; color: #111827;">📊 카테고리별 현황</td></tr>
      ${categoryRows}
    </table>` : '';

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; padding: 24px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: #111827; padding: 24px 32px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 20px; font-weight: 700;">AI Paper Digest</h1>
              <p style="margin: 4px 0 0; color: #9ca3af; font-size: 14px;">${date} · ${totalCount}편의 새 논문</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding: 24px 32px;">
              ${hotSection}
              ${devSection}
              ${categorySection}
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 16px 0;">
                    <a href="${siteUrl}" style="display: inline-block; padding: 12px 24px; background-color: #111827; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: 600;">전체 논문 보기</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 16px 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af; text-align: center;">
                이 이메일은 AI Paper Digest 구독자에게 발송됩니다.<br>
                <a href="${unsubscribeUrl}" style="color: #9ca3af; text-decoration: underline;">구독 해지</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
