'use client';
import { useRef } from 'react';
import { X, Search } from 'lucide-react';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  lang?: Lang;
}

export function SearchBar({ value, onChange, lang = 'ko' }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative w-full">
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        placeholder={t('search.placeholder', lang)}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-card border border-border rounded-md pl-8 pr-8 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-border"
      />
      {value && (
        <button
          onClick={() => { onChange(''); inputRef.current?.focus(); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
