'use client';

import { Button } from '@/components/ui/button';
import { useBookmarks } from '@/hooks/use-bookmarks';
import type { Lang } from '@/lib/i18n';

interface BookmarkButtonProps {
  paperId: string;
  lang?: Lang;
}

export function BookmarkButton({ paperId, lang = 'ko' }: BookmarkButtonProps) {
  const { toggle, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(paperId);

  return (
    <Button
      variant={bookmarked ? 'default' : 'outline'}
      size="sm"
      onClick={() => toggle(paperId)}
    >
      {lang === 'en'
        ? (bookmarked ? '★ Saved' : '☆ Save')
        : (bookmarked ? '★ 북마크 해제' : '☆ 북마크')}
    </Button>
  );
}
