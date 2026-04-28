import Link from 'next/link';
import { headers } from 'next/headers';
import { Button } from '@/components/ui/button';

export default async function NotFound() {
  const h = await headers();
  const xLang = h.get('x-lang');
  const accept = h.get('accept-language') ?? '';
  const lang: 'ko' | 'en' = xLang === 'en' || (xLang !== 'ko' && !accept.toLowerCase().includes('ko')) ? 'en' : 'ko';
  const t = lang === 'en'
    ? { msg: 'Page not found.', back: 'Back to home' }
    : { msg: '페이지를 찾을 수 없습니다.', back: '홈으로 돌아가기' };
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">{t.msg}</p>
      <Link href={`/${lang}`}>
        <Button>{t.back}</Button>
      </Link>
    </div>
  );
}
