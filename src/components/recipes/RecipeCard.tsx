import type { Recipe } from '../../lib/api';
import { formatTime, getTotalTime } from '../../hooks/useRecipes';

interface RecipeCardProps {
  recipe: Recipe & { tagsList: string[] };
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  compact?: boolean;
}

// Tag styling helper
function getTagStyle(tag: string): string {
  const tagLower = tag.toLowerCase().replace(/[^a-z]/g, '');

  if (tagLower.includes('quick')) return 'bg-clock-gold/20 text-clock-gold';
  if (tagLower.includes('kid') || tagLower.includes('friendly')) return 'bg-sage/20 text-sage';
  if (tagLower.includes('spicy')) return 'bg-terracotta/20 text-terracotta';
  if (tagLower.includes('vegetarian') || tagLower.includes('veg')) return 'bg-sage/20 text-sage';
  if (tagLower.includes('freezer')) return 'bg-blue-100 text-blue-600';

  return 'bg-mushroom/10 text-mushroom';
}

// Format tag for display
function formatTag(tag: string): string {
  return tag.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

export function RecipeCard({ recipe, onClick, onEdit, onDelete, compact = false }: RecipeCardProps) {
  const totalTime = getTotalTime(recipe);

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`
          flex items-center gap-3 p-3 bg-warm-white rounded-soft border border-mushroom/10
          hover:border-terracotta/30 hover:shadow-sm transition-all cursor-pointer
        `}
      >
        {/* Icon/Image */}
        <div className="w-12 h-12 bg-butter rounded-soft flex items-center justify-center text-xl shrink-0">
          {recipe.image_url ? (
            <img src={recipe.image_url} alt="" className="w-full h-full object-cover rounded-soft" />
          ) : (
            '🍽️'
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-charcoal truncate">{recipe.name}</h3>
          {totalTime > 0 && (
            <span className="text-xs text-clock-gold">{formatTime(totalTime)}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`
        card flex items-start gap-4 group
        ${onClick ? 'cursor-pointer hover:border-terracotta/30' : ''}
      `}
    >
      {/* Image/Placeholder */}
      <div className="w-16 h-16 bg-butter rounded-soft flex items-center justify-center text-2xl shrink-0 overflow-hidden">
        {recipe.image_url ? (
          <img src={recipe.image_url} alt="" className="w-full h-full object-cover" />
        ) : (
          '🍽️'
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-charcoal">{recipe.name}</h3>

          {/* Action buttons (show on hover) */}
          {(onEdit || onDelete) && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-1.5 rounded-full hover:bg-mushroom/10 text-mushroom hover:text-charcoal"
                  aria-label="Edit recipe"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-1.5 rounded-full hover:bg-terracotta/10 text-mushroom hover:text-terracotta"
                  aria-label="Delete recipe"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {totalTime > 0 && (
            <span className="text-sm text-clock-gold flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {formatTime(totalTime)}
            </span>
          )}

          {/* Tags */}
          {recipe.tagsList.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className={`tag text-[10px] ${getTagStyle(tag)}`}
            >
              {formatTag(tag)}
            </span>
          ))}
        </div>

        {/* Notes preview */}
        {recipe.notes && (
          <p className="text-xs text-mushroom mt-2 line-clamp-1">{recipe.notes}</p>
        )}

        {/* Last served */}
        {recipe.last_served && (
          <p className="text-xs text-mushroom/70 mt-1">
            Last served: {new Date(recipe.last_served).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </p>
        )}
      </div>
    </div>
  );
}

// Empty state for when no recipes exist
export function RecipeEmptyState({ onAddRecipe }: { onAddRecipe: () => void }) {
  return (
    <div className="text-center py-12">
      <div className="text-5xl mb-4">📚</div>
      <h3 className="text-lg font-display text-charcoal mb-2">No recipes yet</h3>
      <p className="text-mushroom mb-6">
        Start building your family recipe collection
      </p>
      <button onClick={onAddRecipe} className="btn-primary">
        Add your first recipe
      </button>
    </div>
  );
}

// Loading skeleton
export function RecipeCardSkeleton() {
  return (
    <div className="card flex items-start gap-4 animate-pulse">
      <div className="w-16 h-16 bg-mushroom/20 rounded-soft" />
      <div className="flex-1 space-y-2">
        <div className="h-5 bg-mushroom/20 rounded w-3/4" />
        <div className="h-4 bg-mushroom/10 rounded w-1/2" />
      </div>
    </div>
  );
}
