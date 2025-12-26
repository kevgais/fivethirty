import { useState } from 'react';
import { DayColumn, DayRow } from './DayColumn';
import { RecipePicker } from './RecipePicker';
import { useMealPlan, useCreateMealPlan, useDeleteMealPlan, getWeekStart, getWeekDates } from '../../hooks/useMealPlan';
import type { MealPlan } from '../../lib/api';

interface WeekCalendarProps {
  weekStart?: string;
  onWeekChange?: (weekStart: string) => void;
}

export function WeekCalendar({ weekStart: propWeekStart, onWeekChange }: WeekCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => propWeekStart || getWeekStart());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const weekStart = propWeekStart || currentWeekStart;
  const { data: mealPlan, isLoading } = useMealPlan(weekStart);
  const createMealPlan = useCreateMealPlan();
  const deleteMealPlan = useDeleteMealPlan();

  const weekDates = getWeekDates(weekStart);

  // Create a map of date -> meal for quick lookup
  const mealsByDate = new Map<string, MealPlan>(
    mealPlan?.map((meal) => [meal.planned_date, meal]) || []
  );

  // Week navigation
  const goToPreviousWeek = () => {
    const prevWeek = new Date(weekStart);
    prevWeek.setDate(prevWeek.getDate() - 7);
    const newWeekStart = prevWeek.toISOString().split('T')[0];
    setCurrentWeekStart(newWeekStart);
    onWeekChange?.(newWeekStart);
  };

  const goToNextWeek = () => {
    const nextWeek = new Date(weekStart);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const newWeekStart = nextWeek.toISOString().split('T')[0];
    setCurrentWeekStart(newWeekStart);
    onWeekChange?.(newWeekStart);
  };

  const goToThisWeek = () => {
    const thisWeek = getWeekStart();
    setCurrentWeekStart(thisWeek);
    onWeekChange?.(thisWeek);
  };

  // Format week range for display
  const formatWeekRange = () => {
    const start = new Date(weekStart);
    const end = new Date(weekStart);
    end.setDate(end.getDate() + 6);

    const startMonth = start.toLocaleDateString('en-GB', { month: 'short' });
    const endMonth = end.toLocaleDateString('en-GB', { month: 'short' });

    if (startMonth === endMonth) {
      return `${start.getDate()} - ${end.getDate()} ${startMonth}`;
    }
    return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth}`;
  };

  // Check if viewing current week
  const isCurrentWeek = weekStart === getWeekStart();

  // Handle meal selection
  const handleSelectMeal = (date: string) => {
    setSelectedDate(date);
  };

  const handleRemoveMeal = async (mealId: number) => {
    try {
      await deleteMealPlan.mutateAsync(mealId);
    } catch (err) {
      console.error('Failed to remove meal:', err);
    }
  };

  const handleRecipeSelect = async (recipeId: number) => {
    if (!selectedDate) return;

    try {
      await createMealPlan.mutateAsync({
        recipe_id: recipeId,
        planned_date: selectedDate,
        meal_type: 'dinner',
      });
      setSelectedDate(null);
    } catch (err) {
      console.error('Failed to add meal:', err);
    }
  };

  // Count planned meals
  const plannedCount = mealPlan?.length || 0;

  return (
    <div className="space-y-4">
      {/* Week navigation header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousWeek}
          className="p-2 rounded-full hover:bg-mushroom/10 text-mushroom hover:text-charcoal transition-colors"
          aria-label="Previous week"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="text-center">
          <h2 className="font-display text-lg text-charcoal">{formatWeekRange()}</h2>
          {!isCurrentWeek && (
            <button
              onClick={goToThisWeek}
              className="text-xs text-terracotta hover:underline"
            >
              Back to this week
            </button>
          )}
        </div>

        <button
          onClick={goToNextWeek}
          className="p-2 rounded-full hover:bg-mushroom/10 text-mushroom hover:text-charcoal transition-colors"
          aria-label="Next week"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Desktop: Grid view */}
      <div className="hidden md:grid md:grid-cols-7 gap-3">
        {weekDates.map((date) => (
          <DayColumn
            key={date}
            date={date}
            meal={mealsByDate.get(date)}
            onSelectMeal={handleSelectMeal}
            onRemoveMeal={handleRemoveMeal}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Mobile: List view */}
      <div className="md:hidden space-y-2">
        {weekDates.map((date) => (
          <DayRow
            key={date}
            date={date}
            meal={mealsByDate.get(date)}
            onSelectMeal={handleSelectMeal}
            onRemoveMeal={handleRemoveMeal}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* Week summary */}
      <div className="text-center pt-4 border-t border-mushroom/10">
        <span className="text-sm text-mushroom">
          {plannedCount} of 7 days planned
        </span>
        {plannedCount === 7 && (
          <span className="text-sm text-sage ml-2">✓ Week complete!</span>
        )}
        {plannedCount === 0 && !isLoading && (
          <p className="text-xs text-mushroom/60 mt-1">
            Tap a day to add a meal
          </p>
        )}
      </div>

      {/* Recipe picker modal */}
      <RecipePicker
        isOpen={selectedDate !== null}
        onClose={() => setSelectedDate(null)}
        onSelect={handleRecipeSelect}
        selectedDate={selectedDate}
        isSubmitting={createMealPlan.isPending}
      />
    </div>
  );
}
