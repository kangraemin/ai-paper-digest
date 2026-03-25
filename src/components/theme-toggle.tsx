'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/ga';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => {
        const next = theme === 'dark' ? 'light' : 'dark';
        trackEvent('theme_toggle', { from: theme, to: next });
        setTheme(next);
      }}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </Button>
  );
}
