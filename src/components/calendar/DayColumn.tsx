import type { MealPlan } from '../../lib/api';
import { MealSlot, MealSlotSkeleton } from './MealSlot';
import { formatDate } from '../../hooks/useMealPlan';

interface DayColumnProps {
  date: string;
  meal?: MealPlan;
  onSelectMeal: (date: string) => void;
  onRemoveMeal: (mealId: number) => void;
  isLoading?: boolean;
  compact?: boolean;
}

export function DayColumn({
  date,
  meal,
  onSelectMeal,
  onRemoveMeal,
  isLoading = false,
  compact = false,
}: DayColumnProps) {
  const { day, date: dateNum, isToday } = formatDate(date);

  return (
    <div
      className={`
        flex flex-col
        ${compact ? 'gap-2' : 'gap-3'}
      `}
    >
      {/* Day header */}
      <div
        className={`
          text-center pb-2 border-b border-mushroom/10
          ${isToday ? 'border-terracotta/30' : ''}
        `}
      >
        <div
          className={`
            text-xs uppercase tracking-wide
            ${isToday ? 'text-terracotta font-medium' : 'text-mushroom'}
          `}
        >
          {day}
        </div>
        <div
          className={`
            text-lg font-display
            ${isToday ? 'text-terracotta' : 'text-charcoal'}
          `}
        >
          {dateNum}
        </div>
        {isToday && (
          <div className="text-[10px] text-terracotta mt-0.5">Today</div>
        )}
      </div>

      {/* Meal slot */}
      {isLoading ? (
        <MealSlotSkeleton compact={compact} />
      ) : (
        <MealSlot
          meal={meal}
          onSelect={() => onSelectMeal(date)}
          onRemove={meal ? () => onRemoveMeal(meal.id) : undefined}
          isToday={isToday}
          compact={compact}
        />
      )}
    </div>
  );
}

// Horizontal day view for mobile
export function DayRow({
  date,
  meal,
  onSelectMeal,
  onRemoveMeal,
  isLoading = false,
}: Omit<DayColumnProps, 'compact'>) {
  const { day, date: dateNum, isToday } = formatDate(date);

  return (
    <div
      className={`
        flex items-center gap-4 p-3 rounded-soft
        ${isToday ? 'bg-butter/30' : ''}
      `}
    >
      {/* Date */}
      <div
        className={`
          w-14 text-center shrink-0
          ${isToday ? 'text-terracotta' : 'text-mushroom'}
        `}
      >
        <div className="text-xs uppercase">{day}</div>
        <div className="text-lg font-display">{dateNum}</div>
      </div>

      {/* Meal slot */}
      <div className="flex-1">
        {isLoading ? (
          <MealSlotSkeleton compact />
        ) : (
          <MealSlot
            meal={meal}
            onSelect={() => onSelectMeal(date)}
            onRemove={meal ? () => onRemoveMeal(meal.id) : undefined}
            isToday={isToday}
            compact
          />
        )}
      </div>
    </div>
  );
}
