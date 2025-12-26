-- Add columns to pantry_items for Phase 3
-- Run with: npx wrangler d1 execute fivethirty-db --local --file=migrations/0004_pantry_columns.sql

-- Add quantity tracking
ALTER TABLE pantry_items ADD COLUMN quantity INTEGER DEFAULT 1;
ALTER TABLE pantry_items ADD COLUMN quantity_unit TEXT;

-- Add manual low-stock flag
ALTER TABLE pantry_items ADD COLUMN is_low INTEGER DEFAULT 0;

-- Add product image from Open Food Facts
ALTER TABLE pantry_items ADD COLUMN image_url TEXT;

-- Add updated_at timestamp
ALTER TABLE pantry_items ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP;
