import type { PantryItem } from '../../lib/api';
import { daysUntilExpiry } from '../../hooks';

interface PantryItemCardProps {
  item: PantryItem;
  onIncrement: () => void;
  onDecrement: () => void;
  onToggleLow: () => void;
  onDelete: () => void;
}

export function PantryItemCard({
  item,
  onIncrement,
  onDecrement,
  onToggleLow,
  onDelete,
}: PantryItemCardProps) {
  const expiryDays = daysUntilExpiry(item.expiry_date);
  const isExpiringSoon = expiryDays !== null && expiryDays <= 3;
  const isExpired = expiryDays !== null && expiryDays < 0;
  const quantity = parseInt(item.quantity) || 1;

  return (
    <div className="card p-3 space-y-2">
      {/* Header row */}
      <div className="flex items-start gap-2">
        {/* Product image or placeholder */}
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-12 h-12 rounded object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded bg-cream flex items-center justify-center text-2xl flex-shrink-0">
            {getCategoryEmoji(item.category)}
          </div>
        )}

        {/* Name and badges */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-charcoal truncate">{item.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {item.is_low === 1 && (
              <span className="px-1.5 py-0.5 bg-clock-gold/20 text-clock-gold text-xs rounded">
                Low
              </span>
            )}
            {isExpired && (
              <span className="px-1.5 py-0.5 bg-terracotta/20 text-terracotta text-xs rounded">
                Expired
              </span>
            )}
            {isExpiringSoon && !isExpired && (
              <span className="px-1.5 py-0.5 bg-terracotta/20 text-terracotta text-xs rounded">
                {expiryDays === 0 ? 'Today' : `${expiryDays}d`}
              </span>
            )}
            {item.quantity_unit && (
              <span className="px-1.5 py-0.5 bg-sage/20 text-sage text-xs rounded">
                {item.quantity_unit}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={onDelete}
          className="p-1 text-mushroom hover:text-terracotta"
          title="Remove"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center justify-between pt-2 border-t border-cream">
        <div className="flex items-center gap-2">
          <button
            onClick={onDecrement}
            disabled={quantity <= 0}
            className="w-8 h-8 rounded-full bg-cream hover:bg-terracotta/10 text-charcoal hover:text-terracotta disabled:opacity-50 flex items-center justify-center"
          >
            -
          </button>
          <span className="w-8 text-center font-medium text-charcoal">{quantity}</span>
          <button
            onClick={onIncrement}
            className="w-8 h-8 rounded-full bg-cream hover:bg-sage/10 text-charcoal hover:text-sage flex items-center justify-center"
          >
            +
          </button>
        </div>

        {/* Low stock flag button */}
        <button
          onClick={onToggleLow}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            item.is_low
              ? 'bg-clock-gold text-white'
              : 'bg-cream text-mushroom hover:bg-clock-gold/20 hover:text-clock-gold'
          }`}
        >
          {item.is_low ? 'Low Stock' : 'Mark Low'}
        </button>
      </div>
    </div>
  );
}

function getCategoryEmoji(category: string): string {
  switch (category) {
    case 'fridge':
      return '🧊';
    case 'freezer':
      return '❄️';
    case 'cupboard':
      return '🗄️';
    default:
      return '📦';
  }
}
