import { searchPapers } from '@/lib/db/queries';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '100');

  if (!q || q.trim().length === 0) {
    return NextResponse.json({ papers: [], total: 0 });
  }

  const { results, total } = await searchPapers(q, limit, (page - 1) * limit);

  return NextResponse.json({ papers: results, total, page, limit });
}
