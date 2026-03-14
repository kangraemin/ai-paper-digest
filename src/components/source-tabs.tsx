'use client';

import { useRouter, useSearchParams } from 'next/navigation';

const SOURCES = [
  { id: 'all', label: 'All' },
  { id: 'papers', label: 'Papers' },
  { id: 'community', label: 'Community' },
];

export function SourceTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('source') || 'all';

  const handleClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') {
      params.delete('source');
    } else {
      params.set('source', id);
    }
    params.delete('category');
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex gap-6">
      {SOURCES.map(source => (
        <button
          key={source.id}
          onClick={() => handleClick(source.id)}
          className={`flex flex-col items-center justify-center border-b-[2px] pb-2 font-medium text-[14px] transition-colors ${
            current === source.id
              ? 'border-b-white text-white'
              : 'border-b-transparent text-zinc-500 hover:text-white'
          }`}
        >
          {source.label}
        </button>
      ))}
    </div>
  );
}
