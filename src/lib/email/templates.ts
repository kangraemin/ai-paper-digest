interface PaperItem {
  title: string;
  titleKo?: string | null;
  oneLiner?: string | null;
  aiCategory?: string | null;
  arxivUrl: string;
}

interface DailyDigestData {
  date: string;
  hotPapers: PaperItem[];
  devPapers: PaperItem[];
  categorySummary: { category: string; count: number }[];
  unsubscribeToken: string;
  siteUrl: string;
}

interface WelcomeEmailData {
  unsubscribeToken: string;
  siteUrl: string;
}

export function renderWelcomeEmail(data: WelcomeEmailData): string {
  const { unsubscribeToken, siteUrl } = data;
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; background: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; background: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 24px; background: #1a1a2e; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 20px;">Welcome to AI Paper Digest!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <p style="margin: 0 0 16px; font-size: 16px; color: #333; line-height: 1.6;">
                구독해 주셔서 감사합니다! 🎉
              </p>
              <p style="margin: 0 0 16px; font-size: 14px; color: #666; line-height: 1.6;">
                매일 아침 최신 AI/LLM 논문 요약을 이메일로 보내드립니다.<br>
                Every morning, you'll receive a summary of the latest AI/LLM papers.
              </p>
              <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.6;">
                더 많은 논문은 <a href="${siteUrl}" style="color: #2563eb;">AI Paper Digest</a>에서 확인하세요.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px; background: #f9f9f9; text-align: center; font-size: 12px; color: #999;">
              <a href="${siteUrl}/api/newsletter/unsubscribe?token=${unsubscribeToken}" style="color: #999; text-decoration: underline;">구독 해지 / Unsubscribe</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderDailyDigest(data: DailyDigestData): string {
  const { date, hotPapers, devPapers, categorySummary, unsubscribeToken, siteUrl } = data;

  const renderPaperRow = (paper: PaperItem) => `
    <tr>
      <td style="padding: 12px 0; border-bottom: 1px solid #eee;">
        <a href="${paper.arxivUrl}" style="color: #2563eb; text-decoration: none; font-weight: 600;">
          ${paper.titleKo || paper.title}
        </a>
        ${paper.oneLiner ? `<p style="margin: 4px 0 0; color: #666; font-size: 14px;">${paper.oneLiner}</p>` : ''}
        ${paper.aiCategory ? `<span style="display: inline-block; margin-top: 4px; padding: 2px 8px; background: #f0f0f0; border-radius: 4px; font-size: 12px; color: #888;">${paper.aiCategory}</span>` : ''}
      </td>
    </tr>`;

  const renderCategoryRow = (item: { category: string; count: number }) => `
    <tr>
      <td style="padding: 4px 0; font-size: 14px;">${item.category}</td>
      <td style="padding: 4px 0; font-size: 14px; text-align: right; font-weight: 600;">${item.count}편</td>
    </tr>`;

  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; background: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; background: #ffffff; border-radius: 8px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 24px; background: #1a1a2e; color: #ffffff; text-align: center;">
              <h1 style="margin: 0; font-size: 20px;">AI 논문 데일리 다이제스트</h1>
              <p style="margin: 8px 0 0; font-size: 14px; opacity: 0.8;">${date}</p>
            </td>
          </tr>

          <!-- Hot Papers -->
          ${hotPapers.length > 0 ? `
          <tr>
            <td style="padding: 24px;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #e11d48;">🔥 핫 논문</h2>
              <table role="presentation" style="width: 100%;">
                ${hotPapers.map(renderPaperRow).join('')}
              </table>
            </td>
          </tr>` : ''}

          <!-- Dev Papers -->
          ${devPapers.length > 0 ? `
          <tr>
            <td style="padding: 24px;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #2563eb;">💻 개발자 추천</h2>
              <table role="presentation" style="width: 100%;">
                ${devPapers.map(renderPaperRow).join('')}
              </table>
            </td>
          </tr>` : ''}

          <!-- Category Summary -->
          ${categorySummary.length > 0 ? `
          <tr>
            <td style="padding: 24px;">
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #333;">📊 카테고리 요약</h2>
              <table role="presentation" style="width: 100%;">
                ${categorySummary.map(renderCategoryRow).join('')}
              </table>
            </td>
          </tr>` : ''}

          <!-- Footer -->
          <tr>
            <td style="padding: 24px; background: #f9f9f9; text-align: center; font-size: 12px; color: #999;">
              <p style="margin: 0;">더 많은 논문은 <a href="${siteUrl}" style="color: #2563eb;">웹사이트</a>에서 확인하세요.</p>
              <p style="margin: 8px 0 0;">
                <a href="${siteUrl}/api/newsletter/unsubscribe?token=${unsubscribeToken}" style="color: #999; text-decoration: underline;">구독 해지</a>
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
