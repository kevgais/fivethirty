import { useState, type FormEvent } from 'react';
import { Modal } from '../ui/Modal';
import { Input, Textarea } from '../ui/Input';
import { useCreateRecipe } from '../../hooks/useRecipes';

interface AddRecipeFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AVAILABLE_TAGS = [
  { id: 'quick', label: 'Quick (<30min)', emoji: '⚡' },
  { id: 'kid-friendly', label: 'Kid-friendly', emoji: '👶' },
  { id: 'spicy', label: 'Spicy', emoji: '🌶️' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥬' },
  { id: 'freezer-friendly', label: 'Freezer-friendly', emoji: '🧊' },
];

export function AddRecipeForm({ isOpen, onClose }: AddRecipeFormProps) {
  const createRecipe = useCreateRecipe();

  // Form state
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [servings, setServings] = useState('4');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const resetForm = () => {
    setName('');
    setIngredients('');
    setInstructions('');
    setPrepTime('');
    setCookTime('');
    setServings('4');
    setTags([]);
    setNotes('');
    setError('');
  };

  const toggleTag = (tagId: string) => {
    setTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name.trim()) {
      setError('Recipe name is required');
      return;
    }
    if (!ingredients.trim()) {
      setError('At least one ingredient is required');
      return;
    }

    // Parse ingredients (one per line)
    const ingredientsList = ingredients
      .split('\n')
      .map((i) => i.trim())
      .filter(Boolean);

    try {
      await createRecipe.mutateAsync({
        name: name.trim(),
        ingredients: ingredientsList,
        instructions: instructions.trim() || undefined,
        prep_time_mins: prepTime ? parseInt(prepTime, 10) : undefined,
        cook_time_mins: cookTime ? parseInt(cookTime, 10) : undefined,
        servings: parseInt(servings, 10) || 4,
        tags: tags.length > 0 ? tags : undefined,
        notes: notes.trim() || undefined,
      });

      resetForm();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create recipe');
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Recipe" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error message */}
        {error && (
          <div className="p-3 bg-terracotta/10 text-terracotta rounded-soft text-sm">
            {error}
          </div>
        )}

        {/* Recipe name */}
        <Input
          label="Recipe name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Spaghetti Bolognese"
          required
        />

        {/* Ingredients */}
        <Textarea
          label="Ingredients (one per line)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          placeholder="500g beef mince&#10;1 onion, diced&#10;2 cloves garlic&#10;400g tinned tomatoes"
          rows={5}
          required
        />

        {/* Instructions */}
        <Textarea
          label="Instructions (optional)"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="1. Brown the mince in a large pan&#10;2. Add onion and garlic..."
          rows={4}
        />

        {/* Time and servings */}
        <div className="grid grid-cols-3 gap-3">
          <Input
            label="Prep time"
            type="number"
            min="0"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            placeholder="mins"
          />
          <Input
            label="Cook time"
            type="number"
            min="0"
            value={cookTime}
            onChange={(e) => setCookTime(e.target.value)}
            placeholder="mins"
          />
          <Input
            label="Servings"
            type="number"
            min="1"
            value={servings}
            onChange={(e) => setServings(e.target.value)}
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`
                  px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                  ${
                    tags.includes(tag.id)
                      ? 'bg-terracotta text-white'
                      : 'bg-mushroom/10 text-mushroom hover:bg-mushroom/20'
                  }
                `}
              >
                {tag.emoji} {tag.label}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <Input
          label="Family notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="e.g., Oscar prefers less spicy"
        />

        {/* Submit buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 rounded-soft font-medium text-mushroom hover:bg-mushroom/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createRecipe.isPending}
            className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createRecipe.isPending ? 'Adding...' : 'Add Recipe'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
