import { Link } from 'react-router-dom';
import { WeekCalendar } from '../components/calendar';
import { useMealPlan, getWeekStart } from '../hooks/useMealPlan';

export function Planner() {
  const weekStart = getWeekStart();
  const { data: mealPlan } = useMealPlan(weekStart);

  // Count planned meals for the generate button state
  const plannedCount = mealPlan?.length || 0;
  const canGenerateList = plannedCount > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header>
        <h1 className="text-2xl font-display text-charcoal">Meal Planner</h1>
        <p className="text-mushroom text-sm mt-1">
          Plan your week, shop once, stress less
        </p>
      </header>

      {/* Week Calendar */}
      <WeekCalendar />

      {/* Actions */}
      <div className="space-y-3 pt-4">
        {/* Generate Shopping List */}
        <Link
          to="/shopping"
          className={`
            btn-primary w-full py-3 flex items-center justify-center gap-2
            ${!canGenerateList ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Generate Shopping List
        </Link>

        {!canGenerateList && (
          <p className="text-center text-xs text-mushroom">
            Add at least one meal to generate a shopping list
          </p>
        )}

        {/* Quick Actions */}
        <div className="flex gap-3">
          <button
            className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-2"
            onClick={() => {
              // TODO: Implement copy last week
              alert('Copy last week - coming soon!');
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy last week
          </button>

          <button
            className="flex-1 btn-secondary py-2 text-sm flex items-center justify-center gap-2"
            onClick={() => {
              // TODO: Implement random fill
              alert('Random fill - coming soon!');
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Random fill
          </button>
        </div>
      </div>

      {/* Tips card */}
      {plannedCount === 0 && (
        <div className="card bg-butter/30 border-butter">
          <h3 className="font-display text-charcoal mb-2">Friday Planning Tip</h3>
          <p className="text-sm text-mushroom">
            Take 10 minutes each Friday to plan the week ahead. Tap any day to assign a recipe,
            then hit "Generate Shopping List" to know exactly what you need.
          </p>
        </div>
      )}

      {/* Full week success message */}
      {plannedCount === 7 && (
        <div className="card bg-sage/10 border-sage/30 text-center">
          <div className="text-3xl mb-2">🎉</div>
          <h3 className="font-display text-charcoal mb-1">Week Complete!</h3>
          <p className="text-sm text-mushroom">
            Every day is planned. Generate your shopping list and relax!
          </p>
        </div>
      )}
    </div>
  );
}
