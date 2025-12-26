import { useState, useEffect } from 'react';
import { Modal, Input } from '../ui';
import type { CreatePantryItemInput, BarcodeResult } from '../../lib/api';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: CreatePantryItemInput) => void;
  prefill?: Partial<BarcodeResult>;
}

const categoryOptions = [
  { value: 'fridge', label: 'Fridge', emoji: '🧊' },
  { value: 'freezer', label: 'Freezer', emoji: '❄️' },
  { value: 'cupboard', label: 'Cupboard', emoji: '🗄️' },
] as const;

const unitOptions = [
  { value: '', label: 'None' },
  { value: 'pack', label: 'Pack' },
  { value: 'bottle', label: 'Bottle' },
  { value: 'tin', label: 'Tin' },
  { value: 'box', label: 'Box' },
  { value: 'bag', label: 'Bag' },
  { value: 'kg', label: 'Kg' },
  { value: 'g', label: 'Grams' },
  { value: 'litre', label: 'Litre' },
  { value: 'ml', label: 'ml' },
];

export function AddItemModal({ isOpen, onClose, onAdd, prefill }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<'fridge' | 'freezer' | 'cupboard'>('fridge');
  const [quantity, setQuantity] = useState('1');
  const [unit, setUnit] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Reset and prefill when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(prefill?.name || '');
      setBarcode(prefill?.barcode || '');
      setImageUrl(prefill?.image_url || '');
      setCategory('fridge');
      setQuantity('1');
      setUnit('');
      setExpiryDate('');
    }
  }, [isOpen, prefill]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      name: name.trim(),
      category,
      quantity: quantity || '1',
      quantity_unit: unit || undefined,
      expiry_date: expiryDate || undefined,
      barcode: barcode || undefined,
      image_url: imageUrl || undefined,
    });

    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add to Pantry">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product image preview */}
        {imageUrl && (
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt={name}
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Name */}
        <Input
          label="Item name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Milk, Chicken breast"
          required
          autoFocus
        />

        {/* Category picker */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Where does it go?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {categoryOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setCategory(opt.value)}
                className={`p-3 rounded-lg border-2 flex flex-col items-center gap-1 transition-colors ${
                  category === opt.value
                    ? 'border-terracotta bg-terracotta/5'
                    : 'border-cream hover:border-sage'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="text-xs text-charcoal">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Quantity row */}
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">
              Unit
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-3 py-2 border border-cream rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:border-terracotta"
            >
              {unitOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Expiry date */}
        <Input
          label="Expiry date (optional)"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />

        {/* Barcode (hidden if not present) */}
        {barcode && (
          <div className="text-xs text-mushroom">
            Barcode: {barcode}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full btn-primary disabled:opacity-50"
        >
          Add to Pantry
        </button>
      </form>
    </Modal>
  );
}
