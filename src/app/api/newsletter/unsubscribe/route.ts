import { db } from '@/lib/db';
import { subscribers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse('토큰이 필요합니다.', { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  const subscriber = await db.select().from(subscribers).where(eq(subscribers.unsubscribeToken, token)).limit(1);

  if (subscriber.length === 0) {
    return new NextResponse('유효하지 않은 토큰입니다.', { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  if (!subscriber[0].isActive) {
    return new NextResponse('<html><body><h1>이미 구독이 해지되었습니다.</h1></body></html>', { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
  }

  await db.update(subscribers)
    .set({ isActive: false, unsubscribedAt: new Date().toISOString() })
    .where(eq(subscribers.unsubscribeToken, token));

  return new NextResponse(
    '<html><body><h1>구독이 해지되었습니다.</h1><p>더 이상 뉴스레터를 받지 않습니다.</p></body></html>',
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}
