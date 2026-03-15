import { db } from '../src/lib/db';
import { papers, subscribers } from '../src/lib/db/schema';
import { eq, isNull, and, gte, lt, desc, sql } from 'drizzle-orm';
import { Resend } from 'resend';
import { renderDailyDigest } from '../src/lib/email/templates';

const BATCH_LIMIT = 100;

async function main() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
  const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).toISOString();

  // 1. 오늘 요약된 논문 조회
  const todayPapers = await db.select().from(papers)
    .where(and(
      gte(papers.summarizedAt, todayStart),
      lt(papers.summarizedAt, tomorrowStart),
    ))
    .orderBy(desc(papers.hotScore));

  if (todayPapers.length === 0) {
    console.log('📭 오늘 요약된 논문이 없습니다. 발송을 건너뜁니다.');
    return;
  }

  console.log(`📬 오늘 요약된 논문: ${todayPapers.length}편`);

  // 2. 핫 논문 + 개발자 추천 분류
  const hotPapers = todayPapers.filter(p => p.isHot).slice(0, 5);
  const hotIds = new Set(hotPapers.map(p => p.id));
  const devPapers = todayPapers
    .filter(p => (p.devRelevance ?? 0) >= 4 && !hotIds.has(p.id))
    .slice(0, 5);

  // 3. 카테고리 집계
  const categoryMap = new Map<string, number>();
  for (const p of todayPapers) {
    const cat = p.aiCategory || 'other';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  }
  const categorySummary = Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // 4. 활성 구독자 조회
  const activeSubscribers = await db.select().from(subscribers)
    .where(eq(subscribers.isActive, true))
    .limit(BATCH_LIMIT);

  if (activeSubscribers.length === 0) {
    console.log('📭 활성 구독자가 없습니다. 발송을 건너뜁니다.');
    return;
  }

  // 5. 토큰 백필 (기존 구독자 중 unsubscribeToken 없는 경우)
  for (const sub of activeSubscribers) {
    if (!sub.unsubscribeToken) {
      const token = crypto.randomUUID();
      await db.update(subscribers)
        .set({ unsubscribeToken: token })
        .where(eq(subscribers.id, sub.id));
      sub.unsubscribeToken = token;
    }
  }

  // 구독자 수 경고
  const totalActive = await db.select({ count: sql<number>`count(*)` })
    .from(subscribers).where(eq(subscribers.isActive, true));
  if (totalActive[0].count > BATCH_LIMIT) {
    console.warn(`⚠️ 활성 구독자 ${totalActive[0].count}명 중 ${BATCH_LIMIT}명에게만 발송합니다 (Resend 무료 한도).`);
  }

  console.log(`📧 ${activeSubscribers.length}명에게 발송 준비 중...`);

  // 6. Resend 발송
  const resend = new Resend(process.env.RESEND_API_KEY);
  const siteUrl = process.env.SITE_URL || 'https://ai-paper-digest.vercel.app';
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  const toPaperItem = (p: typeof todayPapers[number]) => ({
    title: p.title,
    titleKo: p.titleKo,
    oneLiner: p.oneLiner,
    aiCategory: p.aiCategory,
    arxivUrl: p.arxivUrl,
  });

  const emails = activeSubscribers.map(sub => ({
    from: 'AI Paper Digest <onboarding@resend.dev>',
    to: [sub.email],
    subject: `[AI Paper Digest] ${date} - ${todayPapers.length}편의 새 논문`,
    html: renderDailyDigest({
      date,
      hotPapers: hotPapers.map(toPaperItem),
      devPapers: devPapers.map(toPaperItem),
      categorySummary,
      unsubscribeToken: sub.unsubscribeToken!,
      siteUrl,
    }),
  }));

  const { data, error } = await resend.batch.send(emails);

  if (error) {
    console.error('❌ 발송 실패:', error);
    process.exit(1);
  }

  console.log(`✅ ${data?.data?.length ?? 0}통 발송 완료`);
}

main().catch(console.error);
