import { ImageResponse } from 'next/og';

export const alt = 'AI Paper Digest';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#ffffff',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        <div style={{ color: '#000000', fontSize: 80, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1 }}>
          AI Paper Digest
        </div>
        <div style={{ color: '#000000', fontSize: 28, marginTop: 24, fontWeight: 400 }}>
          매일 업데이트되는 AI · LLM 논문 한글 요약
        </div>
      </div>
    ),
    { ...size }
  );
}
