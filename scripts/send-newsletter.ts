import { db } from '../src/lib/db';
import { papers, subscribers } from '../src/lib/db/schema';
import { eq, and, like, isNull, desc, sql } from 'drizzle-orm';
import { Resend } from 'resend';
import { renderDailyDigest } from '../src/lib/email/templates';

if (!process.env.RESEND_API_KEY) {
  console.error('[send-newsletter] RESEND_API_KEY is not set');
  process.exit(1);
}
const resend = new Resend(process.env.RESEND_API_KEY);
const SITE_URL = process.env.SITE_URL || 'https://localhost:3000';
const BATCH_SIZE = 100;

async function main() {
  const today = new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]; // KST YYYY-MM-DD

  // 1. 오늘 요약된 논문 조회
  const todayPapers = await db.select().from(papers)
    .where(sql`DATE(datetime(${papers.summarizedAt}, '+9 hours')) = ${today}`)
    .orderBy(desc(papers.devRelevance))
    .limit(50);

  if (todayPapers.length === 0) {
    console.log('📭 오늘 요약된 논문이 없습니다. 발송을 건너뜁니다.');
    return;
  }

  console.log(`📰 오늘 논문 ${todayPapers.length}편 발견`);

  // 2. 핫 논문 & 개발자 추천 분류
  const hotPapers = todayPapers
    .filter(p => p.isHot)
    .slice(0, 5)
    .map(p => ({ title: p.title, titleKo: p.titleKo, oneLiner: p.oneLiner, aiCategory: p.aiCategory, arxivUrl: p.arxivUrl }));

  const devPapers = todayPapers
    .filter(p => (p.devRelevance ?? 0) >= 4)
    .slice(0, 5)
    .map(p => ({ title: p.title, titleKo: p.titleKo, oneLiner: p.oneLiner, aiCategory: p.aiCategory, arxivUrl: p.arxivUrl }));

  // 3. 카테고리 요약
  const categoryMap = new Map<string, number>();
  for (const p of todayPapers) {
    const cat = p.aiCategory || '기타';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  }
  const categorySummary = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // 4. 활성 구독자 조회
  const activeSubscribers = await db.select().from(subscribers)
    .where(eq(subscribers.isActive, true))
    .limit(BATCH_SIZE);

  if (activeSubscribers.length === 0) {
    console.log('📭 활성 구독자가 없습니다.');
    return;
  }

  // 5. 토큰 백필
  for (const sub of activeSubscribers) {
    if (!sub.unsubscribeToken) {
      const token = crypto.randomUUID();
      await db.update(subscribers)
        .set({ unsubscribeToken: token })
        .where(eq(subscribers.id, sub.id));
      sub.unsubscribeToken = token;
    }
  }

  console.log(`📧 ${activeSubscribers.length}명에게 발송 중...`);

  // 6. Resend batch 발송
  const emails = activeSubscribers.map(sub => ({
    from: 'AI Papers <newsletter@paper-digest.app>',
    to: sub.email,
    subject: `[AI Papers] ${today} 데일리 다이제스트 (${todayPapers.length}편)`,
    html: renderDailyDigest({
      date: today,
      hotPapers,
      devPapers,
      categorySummary,
      unsubscribeToken: sub.unsubscribeToken!,
      siteUrl: SITE_URL,
    }),
  }));

  const { data, error } = await resend.batch.send(emails);

  if (error) {
    console.error('❌ 발송 실패:', error);
    process.exit(1);
  }

  console.log(`✅ ${activeSubscribers.length}명에게 발송 완료`, data);
}

main().catch(console.error);
