import { Link } from 'react-router-dom';
import { useTodaysMeal, useMealPlan, getWeekStart, getWeekDates, formatDate } from '../hooks/useMealPlan';
import { formatTime } from '../hooks/useRecipes';

export function Home() {
  const { data: todaysMeal, isLoading: todayLoading } = useTodaysMeal();
  const weekStart = getWeekStart();
  const { data: mealPlan, isLoading: weekLoading } = useMealPlan(weekStart);

  // Create a map of date -> meal for quick lookup
  const mealsByDate = new Map(
    mealPlan?.map((meal) => [meal.planned_date, meal]) || []
  );

  const weekDates = getWeekDates(weekStart);

  // Get total time for today's meal
  const todaysTotalTime = todaysMeal
    ? (todaysMeal.prep_time_mins || 0) + (todaysMeal.cook_time_mins || 0)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="text-center py-4">
        <h1 className="text-3xl font-display text-charcoal">
          Five<span className="text-terracotta">:</span>Thirty
        </h1>
        <p className="text-mushroom mt-1">Kill the 5:30 panic</p>
      </header>

      {/* Today's Plan Card */}
      <Link to="/planner" className="block">
        <div className="card hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-display text-charcoal">Tonight's Dinner</h2>
            {todaysTotalTime > 0 && (
              <span className="tag-quick">{formatTime(todaysTotalTime)}</span>
            )}
          </div>

          {todayLoading ? (
            <div className="animate-pulse">
              <div className="h-6 bg-mushroom/20 rounded w-3/4 mb-2" />
              <div className="h-4 bg-mushroom/10 rounded w-1/2" />
            </div>
          ) : todaysMeal ? (
            <>
              <p className="text-charcoal font-medium text-lg">{todaysMeal.recipe_name}</p>
              <p className="text-sage text-sm mt-1 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Dinner sorted!
              </p>
            </>
          ) : (
            <>
              <p className="text-charcoal font-medium">No meal planned yet</p>
              <p className="text-mushroom text-sm mt-1">Tap to choose from your recipes</p>
            </>
          )}
        </div>
      </Link>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Link
          to="/recipes"
          className="card flex flex-col items-center py-6 hover:border-terracotta border-2 border-transparent transition-colors"
        >
          <span className="text-2xl mb-2">🍳</span>
          <span className="text-sm font-medium text-charcoal">What's for dinner?</span>
        </Link>
        <Link
          to="/shopping"
          className="card flex flex-col items-center py-6 hover:border-sage border-2 border-transparent transition-colors"
        >
          <span className="text-2xl mb-2">🛒</span>
          <span className="text-sm font-medium text-charcoal">Shopping list</span>
        </Link>
      </div>

      {/* This Week Summary */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-display text-charcoal">This Week</h2>
          <Link to="/planner" className="text-sm text-terracotta hover:underline">
            Plan meals
          </Link>
        </div>

        {weekLoading ? (
          <div className="space-y-3 animate-pulse">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="w-10 h-4 bg-mushroom/20 rounded" />
                <div className="flex-1 h-4 bg-mushroom/10 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {weekDates.map((dateStr) => {
              const { day, date, isToday } = formatDate(dateStr);
              const meal = mealsByDate.get(dateStr);

              return (
                <div
                  key={dateStr}
                  className={`
                    flex items-center justify-between py-2 border-b border-mushroom/10 last:border-0
                    ${isToday ? 'bg-butter/30 -mx-4 px-4 rounded-soft' : ''}
                  `}
                >
                  <span className={`text-sm w-12 ${isToday ? 'font-medium text-terracotta' : 'text-mushroom'}`}>
                    {day} {date}
                  </span>
                  <span className={`text-sm flex-1 ${meal ? 'text-charcoal' : 'text-mushroom/60'}`}>
                    {meal ? meal.recipe_name : 'Not planned'}
                  </span>
                  {meal && (
                    <svg className="w-4 h-4 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Week summary */}
        {!weekLoading && mealPlan && (
          <div className="mt-4 pt-3 border-t border-mushroom/10 text-center">
            <span className="text-sm text-mushroom">
              {mealPlan.length} of 7 days planned
            </span>
            {mealPlan.length === 7 && (
              <span className="text-sm text-sage ml-2">✓ Week complete!</span>
            )}
          </div>
        )}
      </div>

      {/* Pantry reminder - subtle CTA */}
      <Link
        to="/pantry"
        className="flex items-center gap-3 p-4 bg-butter/30 rounded-soft hover:bg-butter/50 transition-colors"
      >
        <span className="text-xl">🧊</span>
        <div className="flex-1">
          <p className="text-sm font-medium text-charcoal">Update your pantry</p>
          <p className="text-xs text-mushroom">Know what you've got before you shop</p>
        </div>
        <svg className="w-5 h-5 text-mushroom" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
