import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED = ['ko', 'en'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Already has lang prefix
  const firstSegment = pathname.split('/')[1];
  if (SUPPORTED.includes(firstSegment)) {
    const res = NextResponse.next();
    res.headers.set('x-lang', firstSegment);
    return res;
  }

  // Detect lang: cookie → Accept-Language → default ko
  const cookie = req.cookies.get('lang')?.value;
  let lang = 'ko';
  if (cookie && SUPPORTED.includes(cookie)) {
    lang = cookie;
  } else {
    const acceptLang = req.headers.get('accept-language') ?? '';
    if (!acceptLang.includes('ko')) {
      lang = 'en';
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname}`;
  // 루트는 검색엔진용으로 영구 리다이렉트(308). 언어 감지 결과라 브라우저가 캐시하지 않게 no-store
  const res = NextResponse.redirect(url, 308);
  res.headers.set('Cache-Control', 'no-store');
  return res;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|llms\\.txt|d21984cc03f0f2507f63cc8dbac26fa5\\.txt|opengraph-image|.*\\.(?:ico|png|jpg|svg|webp|xml)).*)'],
};
