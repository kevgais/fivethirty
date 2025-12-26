/**
 * React Query hooks for Pantry operations
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { pantryApi, type PantryItem, type CreatePantryItemInput } from '../lib/api';

// Query keys
const pantryKeys = {
  all: ['pantry'] as const,
  lists: () => [...pantryKeys.all, 'list'] as const,
  list: (filters?: { category?: string; low?: boolean; expiring?: number; search?: string }) =>
    [...pantryKeys.lists(), filters] as const,
  detail: (id: number) => [...pantryKeys.all, 'detail', id] as const,
  stats: () => [...pantryKeys.all, 'stats'] as const,
};

// List pantry items with optional filters
export function usePantryItems(filters?: {
  category?: string;
  low?: boolean;
  expiring?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: pantryKeys.list(filters),
    queryFn: () => pantryApi.list(filters),
  });
}

// Get pantry stats
export function usePantryStats() {
  return useQuery({
    queryKey: pantryKeys.stats(),
    queryFn: () => pantryApi.stats(),
  });
}

// Get single pantry item
export function usePantryItem(id: number) {
  return useQuery({
    queryKey: pantryKeys.detail(id),
    queryFn: () => pantryApi.get(id),
    enabled: id > 0,
  });
}

// Add new pantry item
export function useAddPantryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePantryItemInput) => pantryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pantryKeys.stats() });
    },
  });
}

// Update pantry item
export function useUpdatePantryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreatePantryItemInput & { is_low: number }> }) =>
      pantryApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pantryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: pantryKeys.stats() });
    },
  });
}

// Delete pantry item
export function useDeletePantryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => pantryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pantryKeys.stats() });
    },
  });
}

// Decrement quantity
export function useDecrementPantryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => pantryApi.decrement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pantryKeys.stats() });
    },
  });
}

// Increment quantity
export function useIncrementPantryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => pantryApi.increment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.lists() });
    },
  });
}

// Toggle low stock flag
export function useToggleLowStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => pantryApi.toggleLow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pantryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: pantryKeys.stats() });
    },
  });
}

// Lookup barcode
export function useLookupBarcode() {
  return useMutation({
    mutationFn: (barcode: string) => pantryApi.lookupBarcode(barcode),
  });
}

// Group pantry items by category
export function groupByCategory(items: PantryItem[]): Record<string, PantryItem[]> {
  return items.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, PantryItem[]>);
}

// Calculate days until expiry
export function daysUntilExpiry(expiryDate: string | undefined): number | null {
  if (!expiryDate) return null;
  const expiry = new Date(expiryDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
