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
  const handleClick = (id: string) => { onChange(id); };

  return (
    <div className="flex gap-4 sm:gap-6">
      {SOURCES.map(source => (
        <button
          key={source.id}
          onClick={() => handleClick(source.id)}
          className={`flex flex-col items-center justify-center border-b-[2px] py-2 font-medium text-[14px] transition-all ${
            current === source.id
              ? 'border-b-white text-white'
              : 'border-b-transparent text-zinc-500 hover:text-zinc-200'
          }`}
        >
          {source.label}
        </button>
      ))}
    </div>
  );
}
