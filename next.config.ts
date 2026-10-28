import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  // OpenNext(Cloudflare) 번들이 libsql의 workerd용 파일을 찾도록 추적에 넣는다
  outputFileTracingIncludes: {
    '/**': ['./node_modules/@libsql/**/*'],
  },
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
