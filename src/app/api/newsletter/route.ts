import { db } from '@/lib/db';
import { subscribers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { renderWelcomeEmail } from '@/lib/email/templates';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app').trim();

async function sendWelcomeEmail(email: string, token: string): Promise<boolean> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: 'AI Paper Digest <newsletter@send.paper-digest.app>',
    to: email,
    subject: 'Welcome to AI Paper Digest!',
    html: renderWelcomeEmail({ unsubscribeToken: token, siteUrl: SITE_URL }),
  });
  return !error;
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email', code: 'INVALID_EMAIL' }, { status: 400 });
    }

    const existing = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
    if (existing.length > 0) {
      if (existing[0].isActive) {
        return NextResponse.json({ error: 'Already subscribed', code: 'ALREADY_SUBSCRIBED' }, { status: 409 });
      }
      const token = existing[0].unsubscribeToken || crypto.randomUUID();
      const sent = await sendWelcomeEmail(email, token);
      if (!sent) {
        return NextResponse.json({ error: 'Email send failed', code: 'EMAIL_SEND_FAILED' }, { status: 422 });
      }
      await db.update(subscribers)
        .set({ isActive: true, unsubscribedAt: null, unsubscribeToken: token })
        .where(eq(subscribers.email, email));
      return NextResponse.json({ message: 'Reactivated' });
    }

    const token = crypto.randomUUID();
    const sent = await sendWelcomeEmail(email, token);
    if (!sent) {
      return NextResponse.json({ error: 'Email send failed', code: 'EMAIL_SEND_FAILED' }, { status: 422 });
    }

    await db.insert(subscribers).values({
      id: crypto.randomUUID(),
      email,
      isActive: true,
      subscribedAt: new Date().toISOString(),
      unsubscribeToken: token,
    });

    return NextResponse.json({ message: 'Subscribed' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error', code: 'SERVER_ERROR' }, { status: 500 });
  }
}
