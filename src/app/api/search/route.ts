import { searchPapers } from '@/lib/db/queries';
import type { Lang } from '@/lib/i18n';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = Math.min(Math.max(1, parseInt(searchParams.get('limit') || '20') || 20), 100);
  const langRaw = searchParams.get('lang');
  const lang: Lang = langRaw === 'en' ? 'en' : 'ko';

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ papers: [], total: 0 });
  }

  const { results, total } = await searchPapers(q, limit, (page - 1) * limit, lang);

  return NextResponse.json({ papers: results, total, page, limit, lang });
}
