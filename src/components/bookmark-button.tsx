'use client';

import { Button } from '@/components/ui/button';
import { useBookmarks } from '@/hooks/use-bookmarks';

interface BookmarkButtonProps {
  paperId: string;
}

export function BookmarkButton({ paperId }: BookmarkButtonProps) {
  const { toggle, isBookmarked } = useBookmarks();
  const bookmarked = isBookmarked(paperId);

  return (
    <Button
      variant={bookmarked ? 'default' : 'outline'}
      size="sm"
      onClick={() => toggle(paperId)}
    >
      {bookmarked ? '★ 북마크 해제' : '☆ 북마크'}
    </Button>
  );
}
