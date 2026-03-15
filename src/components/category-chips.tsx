'use client';

const CATEGORIES = [
  { id: 'all', label: 'All Topics', color: null },
  { id: 'prompting', label: 'Prompting', color: 'cat-prompting' },
  { id: 'rag', label: 'RAG', color: 'cat-rag' },
  { id: 'agent', label: 'Agent', color: 'cat-agent' },
  { id: 'finetuning', label: 'Fine-tuning', color: 'cat-finetuning' },
  { id: 'eval', label: 'Eval', color: 'cat-eval' },
  { id: 'cost', label: 'Cost', color: 'cat-cost' },
  { id: 'security', label: 'Security', color: 'cat-security' },
];

const colorMap: Record<string, string> = {
  'cat-prompting': '#3b82f6',
  'cat-rag': '#10b981',
  'cat-agent': '#8b5cf6',
  'cat-finetuning': '#f97316',
  'cat-eval': '#ec4899',
  'cat-cost': '#14b8a6',
  'cat-security': '#ef4444',
};

interface CategoryChipsProps {
  current: string;
  onChange: (category: string) => void;
}

export function CategoryChips({ current, onChange }: CategoryChipsProps) {
  const handleClick = (id: string) => {
    onChange(id);
  };

  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {CATEGORIES.map(cat => {
        const isActive = current === cat.id;

        if (!cat.color) {
          return (
            <button
              key={cat.id}
              onClick={() => handleClick(cat.id)}
              className={`flex h-7 shrink-0 items-center justify-center rounded-full px-3 font-mono text-[12px] transition-colors border ${
                isActive
                  ? 'border-zinc-600 bg-zinc-800 text-white'
                  : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-700 text-zinc-300'
              }`}
            >
              {cat.label}
            </button>
          );
        }

        const hex = colorMap[cat.color] ?? '#888';

        return (
          <button
            key={cat.id}
            onClick={() => handleClick(cat.id)}
            style={{
              borderColor: `${hex}30`,
              backgroundColor: isActive ? `${hex}33` : `${hex}1a`,
              color: hex,
            }}
            className="flex h-7 shrink-0 items-center justify-center rounded-full px-3 font-mono text-[12px] transition-colors border"
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
