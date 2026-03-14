'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

const SOURCES = [
  { id: 'papers', label: '논문' },
  { id: 'community', label: '커뮤니티' },
];

export function SourceTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('source') || 'papers';

  const handleClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('source', id);
    params.delete('category');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit">
      {SOURCES.map(source => (
        <Button
          key={source.id}
          variant={current === source.id ? 'default' : 'ghost'}
          size="sm"
          onClick={() => handleClick(source.id)}
          className="rounded-md"
        >
          {source.label}
        </Button>
      ))}
    </div>
  );
}
