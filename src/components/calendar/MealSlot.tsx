import type { MealPlan } from '../../lib/api';
import { formatTime } from '../../hooks/useRecipes';

interface MealSlotProps {
  meal?: MealPlan;
  onSelect: () => void;
  onRemove?: () => void;
  isToday?: boolean;
  compact?: boolean;
}

export function MealSlot({ meal, onSelect, onRemove, isToday = false, compact = false }: MealSlotProps) {
  const totalTime = meal ? (meal.prep_time_mins || 0) + (meal.cook_time_mins || 0) : 0;

  if (!meal) {
    // Empty slot
    return (
      <button
        onClick={onSelect}
        className={`
          w-full p-3 rounded-soft border-2 border-dashed border-mushroom/20
          hover:border-terracotta/40 hover:bg-terracotta/5 transition-colors
          flex items-center justify-center gap-2 group
          ${isToday ? 'border-terracotta/30 bg-terracotta/5' : ''}
          ${compact ? 'py-2' : 'py-4'}
        `}
      >
        <svg
          className="w-5 h-5 text-mushroom/40 group-hover:text-terracotta/60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <span className="text-sm text-mushroom/60 group-hover:text-terracotta/80">
          Add meal
        </span>
      </button>
    );
  }

  // Filled slot
  return (
    <div
      className={`
        relative group rounded-soft bg-warm-white border border-mushroom/10
        hover:shadow-md hover:border-sage/30 transition-all
        ${isToday ? 'ring-2 ring-terracotta/20' : ''}
        ${compact ? 'p-2' : 'p-3'}
      `}
    >
      {/* Main content - clickable to change */}
      <button onClick={onSelect} className="w-full text-left">
        <div className="flex items-start gap-3">
          {/* Recipe icon/image */}
          <div className={`
            bg-butter rounded-soft flex items-center justify-center shrink-0
            ${compact ? 'w-10 h-10 text-lg' : 'w-12 h-12 text-xl'}
          `}>
            {meal.image_url ? (
              <img src={meal.image_url} alt="" className="w-full h-full object-cover rounded-soft" />
            ) : (
              '🍽️'
            )}
          </div>

          {/* Recipe info */}
          <div className="flex-1 min-w-0">
            <h4 className={`font-medium text-charcoal truncate ${compact ? 'text-sm' : ''}`}>
              {meal.recipe_name}
            </h4>
            {totalTime > 0 && (
              <span className="text-xs text-clock-gold flex items-center gap-1 mt-0.5">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatTime(totalTime)}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Remove button - show on hover */}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="
            absolute -top-2 -right-2 w-6 h-6 rounded-full
            bg-warm-white border border-mushroom/20 shadow-sm
            flex items-center justify-center
            opacity-0 group-hover:opacity-100 transition-opacity
            hover:bg-terracotta hover:border-terracotta hover:text-white
            text-mushroom
          "
          aria-label="Remove meal"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Cooked/status indicator */}
      {meal.status === 'cooked' && (
        <div className="absolute bottom-1 right-1">
          <span className="text-xs bg-sage/20 text-sage px-1.5 py-0.5 rounded-full">
            ✓ Made
          </span>
        </div>
      )}
    </div>
  );
}

// Loading skeleton
export function MealSlotSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`animate-pulse rounded-soft bg-mushroom/10 ${compact ? 'h-14' : 'h-20'}`} />
  );
}
