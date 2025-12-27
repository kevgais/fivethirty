import { useState } from 'react';
import { toast } from 'sonner';
import {
  useActiveShoppingList,
  useShoppingItems,
  useAddShoppingItem,
  useToggleShoppingItem,
  useDeleteShoppingItem,
  useClearCheckedItems,
  useGenerateShoppingList,
  groupShoppingByCategory,
  categoryDisplayNames,
  getCurrentWeekStart,
} from '../hooks';
import { BarcodeScanner } from '../components/pantry/BarcodeScanner';
import type { BarcodeResult, ShoppingItem } from '../lib/api';

export function Shopping() {
  const [newItemName, setNewItemName] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Get active shopping list
  const { data: list, isLoading: listLoading } = useActiveShoppingList();

  // Get items for active list
  const { data: items, isLoading: itemsLoading } = useShoppingItems(list?.id || 0);

  // Mutations
  const addItem = useAddShoppingItem();
  const toggleItem = useToggleShoppingItem();
  const deleteItem = useDeleteShoppingItem();
  const clearChecked = useClearCheckedItems();
  const generateList = useGenerateShoppingList();

  // Group items by category
  const groupedItems = items ? groupShoppingByCategory(items) : {};

  // Count remaining (unchecked) items
  const remainingCount = items?.filter((item) => !item.checked).length || 0;
  const checkedCount = items?.filter((item) => item.checked).length || 0;

  // Handle adding a new item
  const handleAddItem = async () => {
    if (!newItemName.trim() || !list) return;

    try {
      await addItem.mutateAsync({
        list_id: list.id,
        name: newItemName.trim(),
        category: 'other',
        source: 'manual',
      });
      setNewItemName('');
      toast.success('Item added');
    } catch {
      toast.error('Failed to add item');
    }
  };

  // Handle toggle item
  const handleToggleItem = async (id: number) => {
    try {
      await toggleItem.mutateAsync(id);
    } catch {
      toast.error('Failed to update item');
    }
  };

  // Handle clear checked items
  const handleClearChecked = async () => {
    if (!list || checkedCount === 0) return;

    try {
      const result = await clearChecked.mutateAsync(list.id);
      toast.success(`Removed ${result.removed} items`);
    } catch {
      toast.error('Failed to clear items');
    }
  };

  // Handle generate from meal plan
  const handleGenerateFromPlan = async () => {
    if (!list) return;

    setIsGenerating(true);
    try {
      const weekStart = getCurrentWeekStart();
      const result = await generateList.mutateAsync(weekStart);

      if (result.items_added === 0) {
        toast.info('No meals planned for this week');
      } else {
        toast.success(`Added ${result.items_added} items from meal plan`);
      }
    } catch {
      toast.error('Failed to generate list');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle barcode scan result
  const handleProductFound = (result: BarcodeResult & { found: true }) => {
    if (!list) return;

    addItem.mutate({
      list_id: list.id,
      name: result.name || 'Unknown Product',
      source: 'trash_scan',
      barcode: result.barcode,
    });
    toast.success(`Added: ${result.name}`);
  };

  // Handle manual barcode entry
  const handleManualBarcodeEntry = (barcode: string) => {
    if (!barcode) {
      // User clicked "enter manually" without a barcode
      toast.info('Enter item name in the add field above');
      return;
    }
    // Barcode not found in database
    toast.info('Product not found. Add it manually.');
  };

  // Handle share
  const handleShare = async () => {
    if (!items || items.length === 0) {
      toast.info('Nothing to share');
      return;
    }

    const uncheckedItems = items.filter((item) => !item.checked);
    const text = uncheckedItems.map((item) => `- ${item.name}${item.quantity ? ` (${item.quantity})` : ''}`).join('\n');

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shopping List',
          text: text,
        });
      } catch {
        // User cancelled or share failed - copy to clipboard instead
        await navigator.clipboard.writeText(text);
        toast.success('Copied to clipboard');
      }
    } else {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    }
  };

  // Loading state
  if (listLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-terracotta border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-charcoal">Shopping List</h1>
          <p className="text-mushroom text-sm">
            {remainingCount} {remainingCount === 1 ? 'item' : 'items'} remaining
          </p>
        </div>
        {checkedCount > 0 && (
          <button
            onClick={handleClearChecked}
            className="text-sm text-terracotta font-medium hover:text-terracotta/80"
            disabled={clearChecked.isPending}
          >
            Clear done ({checkedCount})
          </button>
        )}
      </header>

      {/* Generate from Meal Plan */}
      <button
        onClick={handleGenerateFromPlan}
        disabled={isGenerating}
        className="card w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-sage hover:bg-sage/5 transition-colors"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-sage border-t-transparent rounded-full animate-spin" />
            <span className="text-sage font-medium">Generating...</span>
          </>
        ) : (
          <>
            <span className="text-2xl">📋</span>
            <span className="text-sage font-medium">Generate from meal plan</span>
          </>
        )}
      </button>

      {/* Trash Scanner */}
      <button
        onClick={() => setShowScanner(true)}
        className="card w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-mushroom/30 hover:border-terracotta hover:bg-terracotta/5 transition-colors"
      >
        <span className="text-2xl">📸</span>
        <span className="text-mushroom font-medium">Scan empty packaging</span>
      </button>

      {/* Add Item */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add item..."
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
          className="flex-1 px-4 py-3 bg-warm-white rounded-soft border border-mushroom/20
                     focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta
                     text-charcoal placeholder:text-mushroom"
        />
        <button
          onClick={handleAddItem}
          disabled={!newItemName.trim() || addItem.isPending}
          className="btn-primary px-4 disabled:opacity-50"
        >
          +
        </button>
      </div>

      {/* Shopping Categories */}
      {itemsLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-3 border-terracotta border-t-transparent rounded-full animate-spin" />
        </div>
      ) : Object.keys(groupedItems).length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-mushroom mb-2">Your shopping list is empty</p>
          <p className="text-sm text-mushroom/70">Add items manually or generate from your meal plan</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <CategorySection
              key={category}
              category={category}
              items={categoryItems}
              onToggle={handleToggleItem}
              onDelete={(id) => deleteItem.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* Share Button */}
      {items && items.length > 0 && (
        <button onClick={handleShare} className="btn-secondary w-full py-3">
          Share with family
        </button>
      )}

      {/* Barcode Scanner Modal */}
      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onProductFound={handleProductFound}
        onManualEntry={handleManualBarcodeEntry}
      />
    </div>
  );
}

// Category Section Component
function CategorySection({
  category,
  items,
  onToggle,
  onDelete,
}: {
  category: string;
  items: ShoppingItem[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const displayName = categoryDisplayNames[category] || category;

  // Sort: unchecked first, then checked
  const sortedItems = [...items].sort((a, b) => a.checked - b.checked);

  return (
    <div className="card">
      <h2 className="font-display text-charcoal mb-3">{displayName}</h2>
      <ul className="space-y-2">
        {sortedItems.map((item) => (
          <li key={item.id} className="flex items-center gap-3 group">
            <button
              onClick={() => onToggle(item.id)}
              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${
                item.checked
                  ? 'bg-sage border-sage text-white'
                  : 'border-mushroom/30 hover:border-sage'
              }`}
            >
              {item.checked ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : null}
            </button>
            <span
              className={`flex-1 ${
                item.checked ? 'line-through text-mushroom' : 'text-charcoal'
              }`}
            >
              {item.name}
              {item.quantity && <span className="text-mushroom text-sm ml-1">({item.quantity})</span>}
            </span>
            {/* Source indicator */}
            {item.source === 'auto' && (
              <span className="text-xs text-sage bg-sage/10 px-2 py-0.5 rounded-full">auto</span>
            )}
            {item.source === 'trash_scan' && (
              <span className="text-xs text-terracotta bg-terracotta/10 px-2 py-0.5 rounded-full">scanned</span>
            )}
            {/* Delete button - show on hover */}
            <button
              onClick={() => onDelete(item.id)}
              className="opacity-0 group-hover:opacity-100 text-mushroom hover:text-terracotta transition-opacity p-1"
              title="Remove item"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
