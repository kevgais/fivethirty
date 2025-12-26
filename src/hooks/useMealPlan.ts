import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mealPlanApi, type MealPlan, type CreateMealPlanInput } from '../lib/api';

// Query keys
export const mealPlanKeys = {
  all: ['mealPlan'] as const,
  lists: () => [...mealPlanKeys.all, 'list'] as const,
  list: (week?: string) => [...mealPlanKeys.lists(), week || 'all'] as const,
};

// Get start of current week (Monday)
export function getWeekStart(date: Date = new Date()): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}

// Get array of week dates (Mon-Sun)
export function getWeekDates(weekStart: string): string[] {
  const dates: string[] = [];
  const start = new Date(weekStart);
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

// Format date for display
export function formatDate(dateString: string): { day: string; date: number; isToday: boolean } {
  const date = new Date(dateString + 'T12:00:00'); // Noon to avoid timezone issues
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();

  return {
    day: date.toLocaleDateString('en-GB', { weekday: 'short' }),
    date: date.getDate(),
    isToday,
  };
}

// Fetch meal plan for a week
export function useMealPlan(weekStart?: string) {
  const week = weekStart || getWeekStart();

  return useQuery({
    queryKey: mealPlanKeys.list(week),
    queryFn: () => mealPlanApi.list(week),
  });
}

// Get today's meal
export function useTodaysMeal() {
  const today = new Date().toISOString().split('T')[0];
  const weekStart = getWeekStart();

  const { data: mealPlan, ...query } = useMealPlan(weekStart);

  const todaysMeal = mealPlan?.find(
    (meal) => meal.planned_date === today && meal.meal_type === 'dinner'
  );

  return {
    ...query,
    data: todaysMeal,
  };
}

// Create meal plan entry
export function useCreateMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMealPlanInput) => mealPlanApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.lists() });
    },
  });
}

// Delete meal plan entry
export function useDeleteMealPlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => mealPlanApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: mealPlanKeys.lists() });
    },
  });
}

// Group meal plan by date
export function groupMealsByDate(mealPlan: MealPlan[]): Map<string, MealPlan[]> {
  const grouped = new Map<string, MealPlan[]>();

  for (const meal of mealPlan) {
    const existing = grouped.get(meal.planned_date) || [];
    grouped.set(meal.planned_date, [...existing, meal]);
  }

  return grouped;
}
