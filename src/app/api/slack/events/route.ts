import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slackWorkspaces } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { createHmac } from 'crypto';

function verifySlackSignature(req: NextRequest, body: string): boolean {
  const secret = process.env.SLACK_SIGNING_SECRET;
  if (!secret) return false;
  const timestamp = req.headers.get('x-slack-request-timestamp') || '';
  const signature = req.headers.get('x-slack-signature') || '';
  const base = `v0:${timestamp}:${body}`;
  const hash = 'v0=' + createHmac('sha256', secret).update(base).digest('hex');
  return hash === signature;
}

export async function POST(req: NextRequest) {
  const body = await req.text();

  if (!verifySlackSignature(req, body)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = JSON.parse(body);

  if (payload.type === 'url_verification') {
    return NextResponse.json({ challenge: payload.challenge });
  }

  if (payload.event?.type === 'app_uninstalled') {
    const teamId = payload.team_id;
    if (teamId) {
      await db.delete(slackWorkspaces).where(eq(slackWorkspaces.teamId, teamId));
    }
  }

  return NextResponse.json({ ok: true });
}
