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
    <div className="flex gap-6">
      {SOURCES.map(source => (
        <button
          key={source.id}
          onClick={() => handleClick(source.id)}
          className={`flex flex-col items-center justify-center border-b-[2px] pb-2 font-medium text-[14px] transition-colors ${
            current === source.id
              ? 'border-b-white text-white'
              : 'border-b-transparent text-zinc-500 hover:text-white'
          }`}
        >
          {source.label}
        </button>
      ))}
    </div>
  );
}
