'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'ai-paper-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setBookmarks(JSON.parse(stored));
    }
  }, []);

  const toggle = useCallback((id: string) => {
    setBookmarks(prev => {
      const next = prev.includes(id)
        ? prev.filter(b => b !== id)
        : [...prev, id];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  return { bookmarks, toggle, isBookmarked };
}
