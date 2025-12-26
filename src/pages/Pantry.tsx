import { useState } from 'react';
import {
  usePantryItems,
  usePantryStats,
  useAddPantryItem,
  useDeletePantryItem,
  useIncrementPantryItem,
  useDecrementPantryItem,
  useToggleLowStock,
  groupByCategory,
  daysUntilExpiry,
} from '../hooks';
import {
  CategorySection,
  AddItemModal,
  BarcodeScanner,
  QuickAddBar,
} from '../components';
import type { BarcodeResult, CreatePantryItemInput, PantryItem } from '../lib/api';
import type { QuickAddItem } from '../components/pantry/QuickAddBar';

export function Pantry() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [prefillData, setPrefillData] = useState<Partial<BarcodeResult>>();
  const [filter, setFilter] = useState<'all' | 'low' | 'expiring'>('all');

  // Queries
  const { data: allItems = [], isLoading } = usePantryItems();
  const { data: stats } = usePantryStats();
  const { data: lowItems = [] } = usePantryItems({ low: true });
  const { data: expiringItems = [] } = usePantryItems({ expiring: 3 });

  // Mutations
  const addItem = useAddPantryItem();
  const deleteItem = useDeletePantryItem();
  const incrementItem = useIncrementPantryItem();
  const decrementItem = useDecrementPantryItem();
  const toggleLow = useToggleLowStock();

  // Group items by category
  const itemsByCategory = groupByCategory(
    filter === 'all' ? allItems : filter === 'low' ? lowItems : expiringItems
  );

  // Handlers
  const handleAddItem = (data: CreatePantryItemInput) => {
    addItem.mutate(data);
  };

  const handleQuickAdd = (item: QuickAddItem) => {
    addItem.mutate({
      name: item.name,
      category: item.category,
      quantity: '1',
    });
  };

  const handleBarcodeFound = (result: BarcodeResult & { found: true }) => {
    setPrefillData(result);
    setShowAddModal(true);
  };

  const handleManualEntry = (barcode: string) => {
    setPrefillData({ barcode });
    setShowAddModal(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Remove this item from pantry?')) {
      deleteItem.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-display text-charcoal">Pantry</h1>
        <button
          onClick={() => {
            setPrefillData(undefined);
            setShowAddModal(true);
          }}
          className="btn-primary text-sm"
        >
          + Add Item
        </button>
      </header>

      {/* Quick Add Bar */}
      <QuickAddBar onQuickAdd={handleQuickAdd} />

      {/* Scan Button */}
      <button
        onClick={() => setShowScanner(true)}
        className="card w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-sage hover:bg-sage/5"
      >
        <span className="text-2xl">📷</span>
        <span className="text-sage font-medium">Scan barcode to add</span>
      </button>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`card p-3 text-center ${filter === 'all' ? 'ring-2 ring-terracotta' : ''}`}
          >
            <div className="text-2xl font-display text-charcoal">{stats.total}</div>
            <div className="text-xs text-mushroom">Total Items</div>
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`card p-3 text-center ${filter === 'low' ? 'ring-2 ring-clock-gold' : ''}`}
          >
            <div className="text-2xl font-display text-clock-gold">{stats.low}</div>
            <div className="text-xs text-mushroom">Running Low</div>
          </button>
          <button
            onClick={() => setFilter('expiring')}
            className={`card p-3 text-center ${filter === 'expiring' ? 'ring-2 ring-terracotta' : ''}`}
          >
            <div className="text-2xl font-display text-terracotta">{stats.expiring}</div>
            <div className="text-xs text-mushroom">Use Soon</div>
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-8 text-mushroom">Loading pantry...</div>
      )}

      {/* Empty state */}
      {!isLoading && allItems.length === 0 && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-3">🧊</div>
          <h3 className="font-display text-charcoal mb-2">Pantry is empty</h3>
          <p className="text-mushroom text-sm mb-4">
            Add items by scanning barcodes or using quick-add
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary"
          >
            Add First Item
          </button>
        </div>
      )}

      {/* Filtered empty state */}
      {!isLoading && allItems.length > 0 && Object.keys(itemsByCategory).length === 0 && (
        <div className="card text-center py-8">
          <div className="text-4xl mb-3">
            {filter === 'low' ? '✅' : '👍'}
          </div>
          <h3 className="font-display text-charcoal mb-2">
            {filter === 'low' ? 'Nothing running low' : 'Nothing expiring soon'}
          </h3>
          <p className="text-mushroom text-sm">
            {filter === 'low'
              ? 'All your items are well stocked!'
              : 'Your food is all fresh!'}
          </p>
        </div>
      )}

      {/* Low Stock Alert - only show on 'all' filter */}
      {filter === 'all' && lowItems.length > 0 && (
        <div className="card border-l-4 border-clock-gold">
          <h2 className="text-lg font-display text-charcoal mb-2">Running Low</h2>
          <ul className="space-y-2">
            {lowItems.slice(0, 5).map((item) => (
              <li key={item.id} className="flex items-center justify-between py-1">
                <span className="text-charcoal">{item.name}</span>
                <span className="text-xs text-mushroom">
                  {item.quantity} {item.quantity_unit || ''}
                </span>
              </li>
            ))}
            {lowItems.length > 5 && (
              <li className="text-xs text-mushroom text-center pt-2">
                +{lowItems.length - 5} more items
              </li>
            )}
          </ul>
        </div>
      )}

      {/* Expiring Soon Alert - only show on 'all' filter */}
      {filter === 'all' && expiringItems.length > 0 && (
        <div className="card border-l-4 border-terracotta">
          <h2 className="text-lg font-display text-charcoal mb-2">Use Soon</h2>
          <ul className="space-y-2">
            {expiringItems.slice(0, 5).map((item) => {
              const days = daysUntilExpiry(item.expiry_date);
              return (
                <li key={item.id} className="flex items-center justify-between py-1">
                  <span className="text-charcoal">{item.name}</span>
                  <span className="text-xs text-terracotta">
                    {days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : `${days} days`}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Category sections */}
      <div className="space-y-4">
        {(['fridge', 'freezer', 'cupboard'] as const).map((category) => (
          <CategorySection
            key={category}
            category={category}
            items={itemsByCategory[category] || []}
            onIncrement={(id) => incrementItem.mutate(id)}
            onDecrement={(id) => decrementItem.mutate(id)}
            onToggleLow={(id) => toggleLow.mutate(id)}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
        prefill={prefillData}
      />

      <BarcodeScanner
        isOpen={showScanner}
        onClose={() => setShowScanner(false)}
        onProductFound={handleBarcodeFound}
        onManualEntry={handleManualEntry}
      />
    </div>
  );
}
