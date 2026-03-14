'use client';

import { useState, useEffect, useRef } from 'react';
import { FileText, Link as LinkIcon, X, ArrowRight } from 'lucide-react';
import { createPortal } from 'react-dom';

interface SubmitPaperModalProps {
  open: boolean;
  onClose: () => void;
}

export function SubmitPaperModal({ open, onClose }: SubmitPaperModalProps) {
  const [url, setUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUrl('');
      setError(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  const handleSubmit = async () => {
    if (!url.trim()) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit');
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit');
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-zinc-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-[640px] bg-zinc-900 border border-zinc-800 rounded-sm shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-3">
          <FileText size={18} className="text-zinc-500" />
          <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">Request New Summary</span>
          <button onClick={onClose} className="ml-auto text-zinc-500 hover:text-zinc-100 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Input Area */}
        <div className="p-4 sm:p-6 flex flex-col gap-6">
          <div className="relative flex items-center group">
            <LinkIcon size={20} className="absolute left-0 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              ref={inputRef}
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
              placeholder="Paste arXiv URL..."
              className="w-full bg-transparent border-none text-xl text-zinc-50 placeholder:text-zinc-600 pl-8 pr-4 py-4 focus:ring-0 focus:outline-none border-b-2 border-transparent focus:border-blue-400 transition-colors"
              autoComplete="off"
            />
          </div>

          {error && <p className="text-red-400 text-sm font-mono">{error}</p>}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
            <div className="flex items-center gap-4 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1">
                <kbd className="bg-zinc-950 border border-zinc-800 rounded-sm px-1.5 py-0.5 text-[10px]">ESC</kbd> to cancel
              </span>
              <span className="flex items-center gap-1">
                <kbd className="bg-zinc-950 border border-zinc-800 rounded-sm px-1.5 py-0.5 text-[10px]">ENTER</kbd> to submit
              </span>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || !url.trim()}
              className="bg-white text-zinc-950 hover:bg-zinc-200 h-10 px-5 rounded-sm font-medium text-[13px] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit'}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Footer: supported sources */}
        <div className="bg-zinc-950/50 border-t border-zinc-800 px-4 py-3">
          <p className="text-xs font-mono text-zinc-500 mb-2">Supported sources</p>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-2 py-1 rounded-sm border border-zinc-800 bg-zinc-900 text-[11px] font-mono text-zinc-500">arxiv.org</span>
            <span className="inline-flex items-center px-2 py-1 rounded-sm border border-zinc-800 bg-zinc-900 text-[11px] font-mono text-zinc-500">huggingface.co/papers</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
