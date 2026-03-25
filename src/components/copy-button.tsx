'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { trackEvent } from '@/lib/ga';

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    trackEvent('copy_summary');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Copy code"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      <span className="text-[12px] font-medium hidden sm:inline">
        {copied ? 'Copied!' : 'Copy'}
      </span>
    </button>
  );
}
