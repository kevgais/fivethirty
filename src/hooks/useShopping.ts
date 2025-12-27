/**
 * React Query hooks for Shopping List operations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  shoppingApi,
  type ShoppingItem,
  type CreateShoppingItemInput,
} from '../lib/api';

// Query keys
const shoppingKeys = {
  all: ['shopping'] as const,
  lists: () => [...shoppingKeys.all, 'lists'] as const,
  activeList: () => [...shoppingKeys.lists(), 'active'] as const,
  listWithItems: (id: number) => [...shoppingKeys.lists(), id] as const,
  items: (listId: number) => [...shoppingKeys.all, 'items', listId] as const,
};

// Get active shopping list
export function useActiveShoppingList() {
  return useQuery({
    queryKey: shoppingKeys.activeList(),
    queryFn: () => shoppingApi.getActiveList(),
  });
}

// Get shopping list with items
export function useShoppingListWithItems(listId: number) {
  return useQuery({
    queryKey: shoppingKeys.listWithItems(listId),
    queryFn: () => shoppingApi.getListWithItems(listId),
    enabled: listId > 0,
  });
}

// Get items for a list
export function useShoppingItems(listId: number) {
  return useQuery({
    queryKey: shoppingKeys.items(listId),
    queryFn: () => shoppingApi.getItems(listId),
    enabled: listId > 0,
  });
}

// Create new shopping list
export function useCreateShoppingList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name?: string) => shoppingApi.createList(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shoppingKeys.lists() });
    },
  });
}

// Add item to shopping list
export function useAddShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateShoppingItemInput) => shoppingApi.addItem(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: shoppingKeys.items(variables.list_id) });
      queryClient.invalidateQueries({ queryKey: shoppingKeys.listWithItems(variables.list_id) });
    },
  });
}

// Update shopping item
export function useUpdateShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name?: string; quantity?: string; category?: string } }) =>
      shoppingApi.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shoppingKeys.all });
    },
  });
}

// Delete shopping item
export function useDeleteShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => shoppingApi.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shoppingKeys.all });
    },
  });
}

// Toggle item checked status
export function useToggleShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => shoppingApi.toggleItem(id),
    // Optimistic update for snappy UX
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: shoppingKeys.all });

      // Update all shopping item queries optimistically
      queryClient.setQueriesData<ShoppingItem[]>(
        { queryKey: shoppingKeys.all },
        (old) => {
          if (!old) return old;
          return old.map((item) =>
            item.id === id ? { ...item, checked: item.checked ? 0 : 1 } : item
          );
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: shoppingKeys.all });
    },
  });
}

// Clear all checked items
export function useClearCheckedItems() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (listId: number) => shoppingApi.clearChecked(listId),
    onSuccess: (_, listId) => {
      queryClient.invalidateQueries({ queryKey: shoppingKeys.items(listId) });
      queryClient.invalidateQueries({ queryKey: shoppingKeys.listWithItems(listId) });
    },
  });
}

// Generate shopping list from meal plan
export function useGenerateShoppingList() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (weekStart: string) => shoppingApi.generateFromMealPlan(weekStart),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: shoppingKeys.all });
    },
  });
}

// Group shopping items by category
export function groupShoppingByCategory(items: ShoppingItem[]): Record<string, ShoppingItem[]> {
  const categoryOrder = ['dairy', 'meat', 'veg', 'fruit', 'bakery', 'frozen', 'cupboard', 'other'];

  const grouped = items.reduce((acc, item) => {
    const category = item.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, ShoppingItem[]>);

  // Return in preferred order
  const ordered: Record<string, ShoppingItem[]> = {};
  for (const cat of categoryOrder) {
    if (grouped[cat]) {
      ordered[cat] = grouped[cat];
    }
  }
  // Add any categories not in the order list
  for (const cat of Object.keys(grouped)) {
    if (!ordered[cat]) {
      ordered[cat] = grouped[cat];
    }
  }

  return ordered;
}

// Category display names
export const categoryDisplayNames: Record<string, string> = {
  dairy: 'Dairy',
  meat: 'Meat & Fish',
  veg: 'Vegetables',
  fruit: 'Fruit',
  bakery: 'Bakery',
  frozen: 'Frozen',
  cupboard: 'Cupboard',
  other: 'Other',
};

// Get week start date (Monday) for current week
export function getCurrentWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Monday
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split('T')[0];
}
