import { useState } from 'react';
import type { PantryItem } from '../../lib/api';
import { PantryItemCard } from './PantryItemCard';

interface CategorySectionProps {
  category: 'fridge' | 'freezer' | 'cupboard';
  items: PantryItem[];
  onIncrement: (id: number) => void;
  onDecrement: (id: number) => void;
  onToggleLow: (id: number) => void;
  onDelete: (id: number) => void;
}

const categoryConfig = {
  fridge: { emoji: '🧊', label: 'Fridge', color: 'bg-blue-50 border-blue-200' },
  freezer: { emoji: '❄️', label: 'Freezer', color: 'bg-indigo-50 border-indigo-200' },
  cupboard: { emoji: '🗄️', label: 'Cupboard', color: 'bg-amber-50 border-amber-200' },
};

export function CategorySection({
  category,
  items,
  onIncrement,
  onDecrement,
  onToggleLow,
  onDelete,
}: CategorySectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const config = categoryConfig[category];

  if (items.length === 0) return null;

  return (
    <div className="space-y-3">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full flex items-center justify-between p-3 rounded-lg border ${config.color}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">{config.emoji}</span>
          <span className="font-display text-charcoal">{config.label}</span>
          <span className="text-sm text-mushroom">({items.length})</span>
        </div>
        <svg
          className={`w-5 h-5 text-mushroom transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Items grid */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => (
            <PantryItemCard
              key={item.id}
              item={item}
              onIncrement={() => onIncrement(item.id)}
              onDecrement={() => onDecrement(item.id)}
              onToggleLow={() => onToggleLow(item.id)}
              onDelete={() => onDelete(item.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
