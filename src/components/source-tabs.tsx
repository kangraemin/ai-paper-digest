'use client';

const SOURCES = [
  { id: 'all', label: 'All' },
  { id: 'papers', label: 'Papers' },
  { id: 'community', label: 'Community' },
];

interface SourceTabsProps {
  current: string;
  onChange: (source: string) => void;
}

export function SourceTabs({ current, onChange }: SourceTabsProps) {
  return (
    <div className="flex gap-4 sm:gap-6">
      {SOURCES.map(source => (
        <button
          key={source.id}
          onClick={() => onChange(source.id)}
          className={`flex flex-col items-center justify-center border-b-[2px] py-2 font-medium text-[14px] transition-all ${
            current === source.id
              ? 'border-b-foreground text-foreground'
              : 'border-b-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          {source.label}
        </button>
      ))}
    </div>
  );
}
