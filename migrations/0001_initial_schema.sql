-- Five Thirty Database Schema
-- Initial migration: Core tables for meal planning app

-- Users (minimal - just household members)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'member', -- 'admin' or 'member'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recipes (the heart of the app)
CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    ingredients TEXT NOT NULL, -- JSON array
    instructions TEXT,
    prep_time_mins INTEGER,
    cook_time_mins INTEGER,
    servings INTEGER DEFAULT 4,
    tags TEXT, -- JSON array: ["quick", "kid-friendly", "spicy"]
    notes TEXT, -- "Oscar doesn't like this spicy"
    rating REAL DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    last_served DATE,
    image_url TEXT,
    source_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Meal Plan (weekly calendar)
CREATE TABLE IF NOT EXISTS meal_plans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER REFERENCES recipes(id),
    planned_date DATE NOT NULL,
    meal_type TEXT DEFAULT 'dinner', -- breakfast/lunch/dinner
    status TEXT DEFAULT 'planned', -- planned/cooked/skipped
    created_by INTEGER REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(planned_date, meal_type)
);

-- Pantry Inventory
CREATE TABLE IF NOT EXISTS pantry_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    barcode TEXT,
    category TEXT NOT NULL, -- fridge/freezer/cupboard
    quantity TEXT, -- "1 pack", "500g", or null for just "have"
    expiry_date DATE,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    used_at DATETIME
);

-- Shopping List
CREATE TABLE IF NOT EXISTS shopping_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT DEFAULT 'Weekly Shop',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    completed_at DATETIME,
    status TEXT DEFAULT 'active' -- active/completed
);

CREATE TABLE IF NOT EXISTS shopping_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    list_id INTEGER REFERENCES shopping_lists(id),
    name TEXT NOT NULL,
    quantity TEXT,
    category TEXT, -- dairy/meat/veg/etc
    checked INTEGER DEFAULT 0,
    source TEXT, -- 'auto' (from meal plan), 'manual', 'trash_scan'
    barcode TEXT, -- for trash-scanned items
    scanned_at DATETIME -- when trash-scanned
);

-- UK Measurement Conversions (reference table)
CREATE TABLE IF NOT EXISTS measurement_conversions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    us_term TEXT NOT NULL,
    uk_term TEXT NOT NULL,
    category TEXT, -- 'volume', 'weight', 'temperature', 'ingredient'
    notes TEXT
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipes_name ON recipes(name);
CREATE INDEX IF NOT EXISTS idx_meal_plans_date ON meal_plans(planned_date);
CREATE INDEX IF NOT EXISTS idx_pantry_category ON pantry_items(category);
CREATE INDEX IF NOT EXISTS idx_pantry_barcode ON pantry_items(barcode);
CREATE INDEX IF NOT EXISTS idx_shopping_items_source ON shopping_items(source);
CREATE INDEX IF NOT EXISTS idx_shopping_items_barcode ON shopping_items(barcode);
CREATE INDEX IF NOT EXISTS idx_shopping_items_list ON shopping_items(list_id);
