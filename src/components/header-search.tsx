'use client';
import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Lang } from '@/lib/i18n';
import { t } from '@/lib/i18n';

export function HeaderSearch({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const handleChange = (val: string) => {
    setQuery(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const trimmed = val.trim();
      if (trimmed.length > 0 && trimmed.length < 2) return;
      const url = trimmed ? `/${lang}?q=${encodeURIComponent(val)}` : `/${lang}`;
      router.replace(url, { scroll: false });
    }, 600);
  };

  const handleClose = () => {
    setOpen(false);
    setQuery('');
    if (timerRef.current) clearTimeout(timerRef.current);
    router.replace(`/${lang}`, { scroll: false });
  };

  if (open) {
    return (
      <form action={`/${lang}`} method="GET" className="flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          name="q"
          value={query}
          onChange={e => handleChange(e.target.value)}
          placeholder={t('search.placeholder', lang)}
          className="w-48 sm:w-72 bg-card border border-border rounded-sm px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
        />
        <button
          type="button"
          onClick={handleClose}
          className="flex items-center justify-center rounded-sm h-8 w-8 bg-card hover:bg-accent text-muted-foreground hover:text-foreground border border-border transition-colors"
        >
          <X size={16} />
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="flex items-center justify-center rounded-sm h-8 w-8 bg-card hover:bg-accent text-muted-foreground hover:text-foreground border border-border transition-colors"
    >
      <Search size={16} />
    </button>
  );
}
