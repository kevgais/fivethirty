import { useState, useMemo } from 'react';
import { Modal } from '../ui/Modal';
import { useRecipes } from '../../hooks/useRecipes';
import { RecipeCard, RecipeCardSkeleton } from '../recipes/RecipeCard';
import { formatDate } from '../../hooks/useMealPlan';
import type { Recipe } from '../../lib/api';

interface RecipePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (recipeId: number) => void;
  selectedDate: string | null;
  isSubmitting?: boolean;
}

export function RecipePicker({
  isOpen,
  onClose,
  onSelect,
  selectedDate,
  isSubmitting = false,
}: RecipePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: recipes, isLoading } = useRecipes();

  // Filter recipes based on search
  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    if (!searchQuery) return recipes;

    const query = searchQuery.toLowerCase();
    return recipes.filter(
      (recipe) =>
        recipe.name.toLowerCase().includes(query) ||
        recipe.tagsList.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [recipes, searchQuery]);

  const handleSelect = (recipe: Recipe & { tagsList: string[] }) => {
    onSelect(recipe.id);
  };

  // Format the date for display
  const dateDisplay = selectedDate ? formatDate(selectedDate) : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dateDisplay ? `${dateDisplay.day} ${dateDisplay.date} - Choose Recipe` : 'Choose Recipe'}
      size="lg"
    >
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-mushroom"
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
            className="w-full pl-10 pr-4 py-2 bg-cream rounded-soft border border-mushroom/20
                       focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta
                       text-charcoal placeholder:text-mushroom text-sm"
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-mushroom hover:text-charcoal"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Recipe list */}
        <div className="max-h-[400px] overflow-y-auto space-y-2 -mx-2 px-2">
          {isLoading ? (
            <>
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
            </>
          ) : filteredRecipes.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-3">🔍</div>
              <p className="text-mushroom">
                {searchQuery ? 'No recipes match your search' : 'No recipes yet'}
              </p>
            </div>
          ) : (
            filteredRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className={`
                  cursor-pointer transition-all
                  ${isSubmitting ? 'opacity-50 pointer-events-none' : ''}
                `}
              >
                <RecipeCard
                  recipe={recipe}
                  onClick={() => handleSelect(recipe)}
                  compact
                />
              </div>
            ))
          )}
        </div>

        {/* Quick filters */}
        {!isLoading && recipes && recipes.length > 5 && (
          <div className="flex gap-2 flex-wrap pt-2 border-t border-mushroom/10">
            <span className="text-xs text-mushroom">Quick filter:</span>
            {['quick', 'kid-friendly'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className={`
                  text-xs px-2 py-1 rounded-full transition-colors
                  ${searchQuery === tag
                    ? 'bg-terracotta/20 text-terracotta'
                    : 'bg-mushroom/10 text-mushroom hover:bg-mushroom/20'
                  }
                `}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Cancel button */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-mushroom hover:text-charcoal transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
