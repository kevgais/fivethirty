import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesApi, type Recipe, type CreateRecipeInput, parseRecipe } from '../lib/api';

// Query keys
export const recipeKeys = {
  all: ['recipes'] as const,
  lists: () => [...recipeKeys.all, 'list'] as const,
  list: (filters: string) => [...recipeKeys.lists(), filters] as const,
  details: () => [...recipeKeys.all, 'detail'] as const,
  detail: (id: number) => [...recipeKeys.details(), id] as const,
};

// Fetch all recipes
export function useRecipes() {
  return useQuery({
    queryKey: recipeKeys.lists(),
    queryFn: recipesApi.list,
    select: (data) => data.map(parseRecipe),
  });
}

// Fetch single recipe
export function useRecipe(id: number) {
  return useQuery({
    queryKey: recipeKeys.detail(id),
    queryFn: () => recipesApi.get(id),
    select: parseRecipe,
    enabled: id > 0,
  });
}

// Search recipes
export function useRecipeSearch(query: string, tag?: string) {
  return useQuery({
    queryKey: recipeKeys.list(`search:${query}:${tag || ''}`),
    queryFn: () => recipesApi.search(query, tag),
    select: (data) => data.map(parseRecipe),
    enabled: query.length > 0 || !!tag,
  });
}

// Create recipe mutation
export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecipeInput) => recipesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

// Update recipe mutation
export function useUpdateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateRecipeInput> }) =>
      recipesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
      queryClient.invalidateQueries({ queryKey: recipeKeys.detail(id) });
    },
  });
}

// Delete recipe mutation
export function useDeleteRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => recipesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recipeKeys.lists() });
    },
  });
}

// Get total cooking time helper
export function getTotalTime(recipe: Recipe): number {
  return (recipe.prep_time_mins || 0) + (recipe.cook_time_mins || 0);
}

// Format time helper
export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}
