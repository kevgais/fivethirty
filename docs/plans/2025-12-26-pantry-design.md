# Pantry & Inventory Feature Design

**Date:** 2025-12-26
**Status:** Approved

## Overview

Phase 3 of Five Thirty: Pantry inventory management with barcode scanning.

## Design Decisions

| Aspect | Decision | Rationale |
|--------|----------|-----------|
| Adding items | Hybrid — quick-add + barcode scan | Most items (produce, meat) lack barcodes |
| Expiry tracking | Optional | Reduce friction, track only when entered |
| Quantity | Simple counts with units | "2 packs", "3 bottles" — helpful for planning |
| Categories | 3 — Fridge, Freezer, Cupboard | Maps to physical locations |
| Low stock | Manual flag | User knows consumption patterns best |

## Data Model

### Database Changes

Add columns to existing `pantry_items` table:

```sql
ALTER TABLE pantry_items ADD COLUMN quantity INTEGER DEFAULT 1;
ALTER TABLE pantry_items ADD COLUMN quantity_unit TEXT;
ALTER TABLE pantry_items ADD COLUMN is_low INTEGER DEFAULT 0;
ALTER TABLE pantry_items ADD COLUMN image_url TEXT;
ALTER TABLE pantry_items ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
```

### Schema (final state)

```
pantry_items:
  id              INTEGER PRIMARY KEY
  name            TEXT NOT NULL
  barcode         TEXT (nullable, indexed)
  category        TEXT NOT NULL (fridge/freezer/cupboard)
  quantity        INTEGER DEFAULT 1
  quantity_unit   TEXT (pack/bottle/kg/box/tin/null)
  expiry_date     DATE (nullable)
  is_low          INTEGER DEFAULT 0 (boolean flag)
  image_url       TEXT (nullable, from Open Food Facts)
  added_at        DATETIME
  updated_at      DATETIME
  used_at         DATETIME (nullable, when fully consumed)
```

## API Endpoints

### Core CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pantry` | List items with filters |
| POST | `/api/pantry` | Add item manually |
| PUT | `/api/pantry/:id` | Update item |
| DELETE | `/api/pantry/:id` | Remove item |

### Convenience Actions

| Method | Endpoint | Description |
|--------|----------|-------------|
| PATCH | `/api/pantry/:id/decrement` | Reduce quantity by 1 |
| PATCH | `/api/pantry/:id/toggle-low` | Toggle is_low flag |
| POST | `/api/pantry/barcode/:code` | Lookup barcode via Open Food Facts |

### Query Parameters (GET /api/pantry)

- `category` — Filter by fridge/freezer/cupboard
- `low` — Only items flagged as low (is_low=1)
- `expiring` — Items expiring within N days
- `search` — Text search on name

## Open Food Facts Integration

### Barcode Lookup Flow

1. User scans barcode with device camera
2. Frontend sends barcode to `/api/pantry/barcode/:code`
3. API fetches from Open Food Facts: `https://world.openfoodfacts.org/api/v2/product/{barcode}`
4. Extract: product_name, brands, image_url
5. Return product info to frontend
6. User confirms/edits, selects category, saves

### Fallback

If barcode not found in Open Food Facts:
- Return `{ found: false, barcode: "..." }`
- Frontend shows manual entry form pre-filled with barcode

## UI Components

### PantryItemCard

Displays single pantry item:
- Name + quantity ("Milk × 2")
- Category badge
- Expiry warning if within 3 days
- "Low" badge if flagged
- Actions: -, +, flag low, delete

### CategorySection

Collapsible section for each category:
- Header: icon + name + count
- Grid of PantryItemCard
- Expand/collapse toggle

### AddItemModal

Manual add form:
- Name (required)
- Category (required, picker)
- Quantity + unit (optional, defaults to 1)
- Expiry date (optional, date picker)
- Barcode (optional, for future scans)

### BarcodeScanner

Camera-based scanner:
- Uses `html5-qrcode` library (lightweight, no native deps)
- On scan: call API, show product confirmation
- Confirm → save to pantry

### QuickAddBar

Common items as tappable chips:
- Milk, Eggs, Bread, Butter, Chicken, etc.
- Tap → add with quantity=1 to default category
- Long-press → customize before adding

## User Flows

### Flow 1: Quick Add Common Item

1. Tap "Milk" chip
2. Modal: "Add Milk to Fridge?" with quantity stepper
3. Confirm → saved

### Flow 2: Scan Packaged Item

1. Tap scan button
2. Camera opens, scan barcode
3. "Found: Heinz Baked Beans" with product image
4. Select category (Cupboard), confirm quantity
5. Save

### Flow 3: Mark as Running Low

1. View pantry list
2. Tap flag icon on item
3. Item shows "Low" badge, appears in Running Low section

### Flow 4: Use Item (Decrement)

1. After cooking, tap "-" on chicken
2. Quantity: 2 → 1
3. When quantity hits 0: prompt to delete or mark as shopping list item

## File Structure

```
src/
├── components/
│   ├── pantry/
│   │   ├── PantryItemCard.tsx
│   │   ├── CategorySection.tsx
│   │   ├── AddItemModal.tsx
│   │   ├── BarcodeScanner.tsx
│   │   ├── QuickAddBar.tsx
│   │   └── index.ts
├── hooks/
│   └── usePantry.ts
├── lib/
│   └── api.ts (add pantry methods)
├── pages/
│   └── Pantry.tsx (update)

functions/api/
└── [[path]].ts (add pantry routes)

migrations/
└── 0004_pantry_columns.sql
```

## Dependencies

- `html5-qrcode` — Barcode scanning via camera

## Implementation Order

1. Database migration (add columns)
2. API endpoints
3. React Query hooks
4. UI components (PantryItemCard, CategorySection, AddItemModal)
5. Barcode scanner integration
6. QuickAddBar
7. Connect Pantry.tsx page
8. Test full flow
