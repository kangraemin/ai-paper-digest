'use client';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/ga';

export function PaperViewTracker({ paperId, source, category, lang }: {
  paperId: string; source: string | null; category: string | null; lang: string;
}) {
  useEffect(() => {
    trackEvent('paper_view', { paper_id: paperId, source, category, lang });
  }, [paperId, source, category, lang]);
  return null;
}
