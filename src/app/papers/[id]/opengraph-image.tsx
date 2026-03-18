import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const alt = 'AI Paper Digest';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Image({ params }: Props) {
  const { id } = await params;
  const result = await db
    .select({ titleKo: papers.titleKo, title: papers.title, oneLiner: papers.oneLiner })
    .from(papers)
    .where(eq(papers.id, id))
    .limit(1);

  const paper = result[0];
  const title = paper?.titleKo || paper?.title || 'AI Paper Digest';
  const description = paper?.oneLiner || '매일 업데이트되는 AI/LLM 논문 한글 요약';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div style={{ color: '#000000', fontSize: 20, fontWeight: 400, marginBottom: 32, letterSpacing: '2px' }}>
          AI PAPER DIGEST
        </div>
        <div
          style={{
            color: '#000000',
            fontSize: title.length > 60 ? 42 : 54,
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: 28,
          }}
        >
          {title.length > 80 ? title.slice(0, 80) + '…' : title}
        </div>
        {description && (
          <div style={{ color: '#000000', fontSize: 26, fontWeight: 400, lineHeight: 1.5 }}>
            {description.length > 100 ? description.slice(0, 100) + '…' : description}
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}
