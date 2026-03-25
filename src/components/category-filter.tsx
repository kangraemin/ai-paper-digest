'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { trackEvent } from '@/lib/ga';

const CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'nlp', label: 'NLP' },
  { id: 'cv', label: 'CV' },
  { id: 'rl', label: 'RL' },
  { id: 'multimodal', label: 'Multimodal' },
  { id: 'agent', label: 'Agent' },
  { id: 'reasoning', label: 'Reasoning' },
  { id: 'optimization', label: 'Optimization' },
  { id: 'safety', label: 'Safety' },
  { id: 'architecture', label: 'Architecture' },
  { id: 'other', label: 'Other' },
];

export function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('category') || 'all';

  const handleClick = (id: string) => {
    trackEvent('category_filter', { category: id });
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') {
      params.delete('category');
    } else {
      params.set('category', id);
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(cat => (
        <Button
          key={cat.id}
          variant={current === cat.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleClick(cat.id)}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
