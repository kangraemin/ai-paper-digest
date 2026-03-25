'use client';
import { trackEvent } from '@/lib/ga';

export function TrackedExternalLink({ href, paperId, source, label, children, className }: {
  href: string;
  paperId: string;
  source: string | null;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={() => trackEvent('arxiv_link_click', { paper_id: paperId, source, label })}
    >
      {children}
    </a>
  );
}
