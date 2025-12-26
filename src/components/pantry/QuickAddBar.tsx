interface QuickAddItem {
  name: string;
  emoji: string;
  category: 'fridge' | 'freezer' | 'cupboard';
}

const quickItems: QuickAddItem[] = [
  { name: 'Milk', emoji: '🥛', category: 'fridge' },
  { name: 'Eggs', emoji: '🥚', category: 'fridge' },
  { name: 'Bread', emoji: '🍞', category: 'cupboard' },
  { name: 'Butter', emoji: '🧈', category: 'fridge' },
  { name: 'Chicken', emoji: '🍗', category: 'fridge' },
  { name: 'Cheese', emoji: '🧀', category: 'fridge' },
  { name: 'Pasta', emoji: '🍝', category: 'cupboard' },
  { name: 'Rice', emoji: '🍚', category: 'cupboard' },
];

interface QuickAddBarProps {
  onQuickAdd: (item: QuickAddItem) => void;
}

export function QuickAddBar({ onQuickAdd }: QuickAddBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
      {quickItems.map((item) => (
        <button
          key={item.name}
          onClick={() => onQuickAdd(item)}
          className="flex-shrink-0 px-3 py-2 bg-cream hover:bg-terracotta/10 rounded-full flex items-center gap-1.5 transition-colors"
        >
          <span>{item.emoji}</span>
          <span className="text-sm text-charcoal whitespace-nowrap">{item.name}</span>
        </button>
      ))}
    </div>
  );
}

export type { QuickAddItem };
