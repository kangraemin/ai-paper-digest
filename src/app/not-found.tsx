import Link from 'next/link';
import { Button } from '@/components/ui/button';

// headers()로 언어를 고르면 앱 전체가 매 요청 렌더가 되므로 두 언어를 함께 보여준다
export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">페이지를 찾을 수 없습니다. / Page not found.</p>
      <div className="flex gap-2">
        <Link href="/ko"><Button>홈으로 돌아가기</Button></Link>
        <Link href="/en"><Button variant="outline">Back to home</Button></Link>
      </div>
    </div>
  );
}
