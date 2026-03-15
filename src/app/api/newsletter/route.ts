import { db } from '@/lib/db';
import { subscribers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: '유효한 이메일을 입력하세요.' }, { status: 400 });
    }

    const existing = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
    if (existing.length > 0) {
      if (existing[0].isActive) {
        return NextResponse.json({ error: '이미 구독 중입니다.' }, { status: 409 });
      }
      await db.update(subscribers)
        .set({ isActive: true, unsubscribedAt: null, unsubscribeToken: existing[0].unsubscribeToken || crypto.randomUUID() })
        .where(eq(subscribers.email, email));
      return NextResponse.json({ message: '구독이 재활성화되었습니다.' });
    }

    const id = crypto.randomUUID();
    await db.insert(subscribers).values({
      id,
      email,
      isActive: true,
      subscribedAt: new Date().toISOString(),
      unsubscribeToken: crypto.randomUUID(),
    });

    return NextResponse.json({ message: '구독이 완료되었습니다.' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
