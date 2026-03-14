'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const search = useCallback((q: string) => {
    if (q.trim()) {
      router.push(`/?q=${encodeURIComponent(q)}`);
    }
  }, [router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        search(query);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  return (
    <Input
      placeholder="논문 검색..."
      value={query}
      onChange={e => setQuery(e.target.value)}
      className="max-w-sm"
    />
  );
}
