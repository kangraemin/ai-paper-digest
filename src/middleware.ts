import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED = ['ko', 'en'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Already has lang prefix
  const firstSegment = pathname.split('/')[1];
  if (SUPPORTED.includes(firstSegment)) return NextResponse.next();

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
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt|opengraph-image|.*\\.(?:ico|png|jpg|svg|webp|xml)).*)'],
};
