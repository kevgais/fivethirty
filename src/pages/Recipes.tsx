import { useState, useMemo } from 'react';
import { useRecipes, useDeleteRecipe } from '../hooks/useRecipes';
import { RecipeCard, RecipeEmptyState, RecipeCardSkeleton, AddRecipeForm } from '../components/recipes';

const FILTER_TAGS = [
  { id: 'all', label: 'All' },
  { id: 'quick', label: 'Quick' },
  { id: 'kid-friendly', label: 'Kid-friendly' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'spicy', label: 'Spicy' },
  { id: 'freezer-friendly', label: 'Freezer' },
];

export function Recipes() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const { data: recipes, isLoading, error } = useRecipes();
  const deleteRecipe = useDeleteRecipe();

  // Filter recipes based on search and tag
  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];

    return recipes.filter((recipe) => {
      // Search filter
      const matchesSearch =
        searchQuery === '' ||
        recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.notes?.toLowerCase().includes(searchQuery.toLowerCase());

      // Tag filter
      const matchesTag =
        activeFilter === 'all' ||
        recipe.tagsList.some((tag) =>
          tag.toLowerCase().includes(activeFilter.toLowerCase())
        );

      return matchesSearch && matchesTag;
    });
  }, [recipes, searchQuery, activeFilter]);

  const handleDeleteRecipe = async (id: number) => {
    try {
      await deleteRecipe.mutateAsync(id);
      setDeleteConfirmId(null);
    } catch (err) {
      console.error('Failed to delete recipe:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-charcoal">Recipes</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="btn-primary text-sm"
        >
          + Add
        </button>
      </header>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mushroom"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search recipes..."
          className="w-full pl-12 pr-4 py-3 bg-warm-white rounded-soft border border-mushroom/20
                     focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta
                     text-charcoal placeholder:text-mushroom"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-mushroom hover:text-charcoal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {FILTER_TAGS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
              tag whitespace-nowrap transition-colors
              ${
                activeFilter === filter.id
                  ? 'bg-terracotta/20 text-terracotta'
                  : 'bg-mushroom/10 text-mushroom hover:bg-mushroom/20'
              }
            `}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-terracotta/10 text-terracotta rounded-soft text-center">
          Failed to load recipes. Is the API running?
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-3">
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && recipes?.length === 0 && (
        <RecipeEmptyState onAddRecipe={() => setIsAddModalOpen(true)} />
      )}

      {/* No results state */}
      {!isLoading && !error && recipes && recipes.length > 0 && filteredRecipes.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-mushroom">No recipes match your search</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className="mt-3 text-sm text-terracotta hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Recipe Grid */}
      {!isLoading && !error && filteredRecipes.length > 0 && (
        <div className="space-y-3">
          {filteredRecipes.map((recipe) => (
            <div key={recipe.id} className="relative">
              <RecipeCard
                recipe={recipe}
                onDelete={() => setDeleteConfirmId(recipe.id)}
              />

              {/* Delete confirmation overlay */}
              {deleteConfirmId === recipe.id && (
                <div className="absolute inset-0 bg-warm-white/95 rounded-xl flex items-center justify-center gap-3 animate-in fade-in">
                  <span className="text-sm text-charcoal">Delete this recipe?</span>
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id)}
                    disabled={deleteRecipe.isPending}
                    className="px-3 py-1.5 bg-terracotta text-white text-sm rounded-soft hover:bg-terracotta/90"
                  >
                    {deleteRecipe.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-3 py-1.5 text-sm text-mushroom hover:text-charcoal"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recipe count */}
      {!isLoading && !error && recipes && recipes.length > 0 && (
        <p className="text-center text-sm text-mushroom pt-4">
          {filteredRecipes.length} of {recipes.length} recipes
        </p>
      )}

      {/* Add Recipe Modal */}
      <AddRecipeForm isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </div>
  );
}
