'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export function DateNav() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateStr = searchParams.get('date') || new Date().toISOString().split('T')[0];
  const date = new Date(dateStr + 'T00:00:00');

  const navigate = (offset: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + offset);
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', newDate.toISOString().split('T')[0]);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
        ← 이전
      </Button>
      <span className="text-sm font-medium">
        {date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
      </span>
      <Button variant="outline" size="sm" onClick={() => navigate(1)}>
        다음 →
      </Button>
    </div>
  );
}
