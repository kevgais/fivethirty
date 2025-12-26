/**
 * Five Thirty API Client
 * Handles all API communication with Cloudflare Workers backend
 */

const API_BASE = import.meta.env.DEV ? 'http://localhost:8788' : '';

// Types
export interface Recipe {
  id: number;
  name: string;
  description?: string;
  ingredients: string; // JSON array as string
  instructions?: string;
  prep_time_mins?: number;
  cook_time_mins?: number;
  servings: number;
  tags: string; // JSON array as string
  notes?: string;
  rating?: number;
  rating_count?: number;
  last_served?: string;
  image_url?: string;
  source_url?: string;
  created_at: string;
  updated_at: string;
}

export interface MealPlan {
  id: number;
  recipe_id: number;
  planned_date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner';
  status: 'planned' | 'cooked' | 'skipped';
  recipe_name?: string;
  prep_time_mins?: number;
  cook_time_mins?: number;
  tags?: string;
  image_url?: string;
}

export interface CreateRecipeInput {
  name: string;
  description?: string;
  ingredients: string[];
  instructions?: string;
  prep_time_mins?: number;
  cook_time_mins?: number;
  servings?: number;
  tags?: string[];
  notes?: string;
  image_url?: string;
  source_url?: string;
}

export interface CreateMealPlanInput {
  recipe_id: number;
  planned_date: string;
  meal_type?: 'breakfast' | 'lunch' | 'dinner';
}

// Pantry Types
export interface PantryItem {
  id: number;
  name: string;
  barcode?: string;
  category: 'fridge' | 'freezer' | 'cupboard';
  quantity: string;
  quantity_unit?: string;
  expiry_date?: string;
  is_low: number; // 0 or 1
  image_url?: string;
  added_at: string;
  updated_at?: string;
  used_at?: string;
}

export interface CreatePantryItemInput {
  name: string;
  category: 'fridge' | 'freezer' | 'cupboard';
  barcode?: string;
  quantity?: string;
  quantity_unit?: string;
  expiry_date?: string;
  image_url?: string;
}

export interface PantryStats {
  categories: Record<string, number>;
  total: number;
  low: number;
  expiring: number;
}

export interface BarcodeResult {
  found: boolean;
  barcode: string;
  name?: string;
  brand?: string;
  image_url?: string;
  quantity_info?: string;
  error?: string;
}

// Helper to parse JSON fields from recipe
export function parseRecipe(recipe: Recipe): Recipe & { ingredientsList: string[]; tagsList: string[] } {
  return {
    ...recipe,
    ingredientsList: parseJsonField(recipe.ingredients),
    tagsList: parseJsonField(recipe.tags),
  };
}

function parseJsonField(value: string | undefined): string[] {
  if (!value) return [];
  try {
    return JSON.parse(value);
  } catch {
    return [];
  }
}

// API Client
async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// Recipe API
export const recipesApi = {
  list: () => request<Recipe[]>('/api/recipes'),

  get: (id: number) => request<Recipe>(`/api/recipes/${id}`),

  search: (query: string, tag?: string) => {
    const params = new URLSearchParams({ q: query });
    if (tag) params.set('tag', tag);
    return request<Recipe[]>(`/api/recipes/search?${params}`);
  },

  create: (data: CreateRecipeInput) =>
    request<{ id: number; message: string }>('/api/recipes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<CreateRecipeInput>) =>
    request<{ message: string }>(`/api/recipes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<{ message: string }>(`/api/recipes/${id}`, {
      method: 'DELETE',
    }),
};

// Meal Plan API
export const mealPlanApi = {
  list: (weekStart?: string) => {
    const params = weekStart ? `?week=${weekStart}` : '';
    return request<MealPlan[]>(`/api/meal-plan${params}`);
  },

  create: (data: CreateMealPlanInput) =>
    request<{ id: number; message: string }>('/api/meal-plan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<{ message: string }>(`/api/meal-plan/${id}`, {
      method: 'DELETE',
    }),
};

// Health check
export const healthApi = {
  check: () => request<{ status: string; database: string; recipeCount: number }>('/api/health'),
};

// Pantry API
export const pantryApi = {
  list: (filters?: { category?: string; low?: boolean; expiring?: number; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.category) params.set('category', filters.category);
    if (filters?.low) params.set('low', 'true');
    if (filters?.expiring) params.set('expiring', String(filters.expiring));
    if (filters?.search) params.set('search', filters.search);
    const query = params.toString();
    return request<PantryItem[]>(`/api/pantry${query ? `?${query}` : ''}`);
  },

  get: (id: number) => request<PantryItem>(`/api/pantry/${id}`),

  create: (data: CreatePantryItemInput) =>
    request<{ id: number; message: string }>('/api/pantry', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<CreatePantryItemInput & { is_low: number }>) =>
    request<{ message: string }>(`/api/pantry/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    request<{ message: string }>(`/api/pantry/${id}`, {
      method: 'DELETE',
    }),

  decrement: (id: number) =>
    request<{ quantity: number; message: string }>(`/api/pantry/${id}/decrement`, {
      method: 'PATCH',
    }),

  increment: (id: number) =>
    request<{ quantity: number; message: string }>(`/api/pantry/${id}/increment`, {
      method: 'PATCH',
    }),

  toggleLow: (id: number) =>
    request<{ is_low: boolean; message: string }>(`/api/pantry/${id}/toggle-low`, {
      method: 'PATCH',
    }),

  lookupBarcode: (barcode: string) =>
    request<BarcodeResult>(`/api/pantry/barcode/${barcode}`, {
      method: 'POST',
    }),

  stats: () => request<PantryStats>('/api/pantry/stats'),
};
