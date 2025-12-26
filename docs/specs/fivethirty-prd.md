# Five Thirty PRD
## Family Meal Planning Web Application

<div align="center">

### 🕠 Five Thirty
**"Kill the 5:30 panic."**

*What's for dinner? Answered.*

</div>

**Version:** 1.0  
**Author:** Kev Gaisford  
**Date:** December 2024  
**Status:** Ready for Development

---

## Executive Summary

### Brand Identity

**Name:** Five Thirty  
**Tagline:** "Kill the 5:30 panic."  
**The Problem It Names:** That 5:30pm moment when everyone's hungry and nobody knows what's for dinner.

**Brand Voice:**
- Warm but practical
- British, family-friendly
- Honest about the chaos it solves
- Never preachy about "meal prep" or "healthy eating"

**Logo Concept:** Clock face showing 5:30, with a fork as the minute hand

Five Thirty is a personal family meal planning web application for Kev, Lucy, Bobby, and Oscar. It solves the daily "what's for dinner?" panic by enabling Friday planning sessions for the week ahead (Mon-Fri), generating smart shopping lists, and providing intelligent meal suggestions based on available ingredients.

**The Problem:**  
Reactive, last-minute meal decisions leading to panic buying, wasted time, and food stress. No visibility of what's in the fridge/freezer. Family favourites scattered across Notes apps.

**The Solution:**  
A beautiful, fast webapp that centralises meal planning, tracks pantry inventory (with barcode scanning), generates shopping lists, and uses AI to suggest meals from available ingredients.

---

## Product Vision

### Target Users
- **Primary:** Kev & Lucy (meal planners, shoppers)
- **Secondary:** Bobby & Oscar (meal voters, occasional viewers)
- **Household size:** 4 people

### User Journey (Friday Planning Session)
1. Open Five Thirty on tablet/phone
2. Review what's in the fridge/freezer (inventory view)
3. See AI suggestions: "You could make Spag Bol, Curry, or Stir Fry"
4. Drag meals to Mon-Fri calendar slots
5. Hit "What's Missing?" → shopping list generates
6. Share list to Lucy / Sainsbury's app
7. Shop once, stress-free week
8. **5:30pm hits → open Five Thirty → dinner sorted** ✅

### Success Metrics
- Weekly planning time < 15 minutes
- **Zero "what's for dinner?" conversations** during the week
- Reduced impulse food purchases
- Building a rated recipe library over time
- **The 5:30 panic becomes the 5:30 answer**

---

## Core Features (MVP - V1)

### 1. Weekly Meal Planner
**Description:** Calendar view showing Mon-Fri dinner slots  
**Functionality:**
- Drag-and-drop meals from recipe library to day slots
- Visual indicators for kid-friendly / spicy / quick meals
- One-click "clear week" and "copy last week"
- Weekend excluded from planning (separate, relaxed approach)

**User Story:**  
*As Kev, I want to plan Monday-Friday dinners in one session on Friday so I know exactly what we're eating all week.*

### 2. Recipe Library
**Description:** Centralised collection of family meals with metadata  
**Functionality:**
- Add recipes manually (name, ingredients, notes, prep time)
- **Import from URL** (see Feature 2a below)
- Rate meals (1-5 stars, family vote)
- Track "last served" date
- Tags: Quick (<30min), Kid-Friendly, Spicy, Vegetarian, Freezer-Friendly
- Family notes: "Oscar doesn't like spicy", "Bobby loves this one"
- Searchable and filterable

**Starter Recipes (to seed library):**
- Curry
- Spicy Mince  
- Spag Bol
- [+ 7 more from Kev's Notes]

**User Story:**  
*As Lucy, I want to see when we last had Spag Bol and what the kids thought of it so we don't repeat meals too often.*

### 2a. URL Recipe Import with UK Conversion
**Description:** Paste a recipe URL, auto-extract ingredients and method, convert to UK measurements  
**Functionality:**
- Paste URL from popular recipe sites (BBC Good Food, Delicious, Jamie Oliver, Allrecipes, etc.)
- AI-powered extraction of:
  - Recipe name
  - Ingredients list (with quantities)
  - Method/instructions (step-by-step)
  - Prep time, cook time, servings
  - Original image URL
- **Automatic UK measurement conversion:**
  - US cups → grams/ml (context-aware: 1 cup flour ≠ 1 cup sugar)
  - Fahrenheit → Celsius
  - US ingredient names → UK equivalents (cilantro → coriander, eggplant → aubergine, etc.)
  - Stick of butter → grams
- Preview before saving (edit if needed)
- Store original URL for reference

**Supported Sites (MVP):**
- BBC Good Food
- Delicious Magazine
- Jamie Oliver
- Allrecipes
- Good Housekeeping
- Any site with structured recipe data (JSON-LD schema)

**Conversion Reference Table:**
| US Measurement | UK Equivalent | Notes |
|----------------|---------------|-------|
| 1 cup flour | 125g | All-purpose/plain |
| 1 cup sugar | 200g | Granulated |
| 1 cup butter | 225g | 2 sticks |
| 1 cup milk | 240ml | |
| 1 stick butter | 113g | |
| 350°F | 180°C | Fan 160°C |
| 400°F | 200°C | Fan 180°C |
| Cilantro | Coriander | |
| Eggplant | Aubergine | |
| Zucchini | Courgette | |
| Scallions | Spring onions | |
| Broil | Grill | |
| All-purpose flour | Plain flour | |
| Heavy cream | Double cream | |
| Half-and-half | Single cream | |

**User Story:**  
*As Kev, I want to paste a URL from BBC Good Food and have the recipe automatically added to our library with UK measurements, so I don't have to manually type everything out.*

**Technical Approach:**
1. Fetch URL content via Workers
2. Try JSON-LD schema extraction first (most recipe sites have this)
3. Fallback to AI extraction using Workers AI
4. Apply measurement conversion rules
5. Present preview for user confirmation

### 3. Pantry Inventory
**Description:** Track what's in fridge, freezer, and cupboards  
**Functionality:**
- Manual entry with categories (Fridge / Freezer / Cupboard)
- **Barcode scanning** via phone camera using Open Food Facts API
- Quantity tracking (optional - just "have/don't have" is fine)
- Quick "use up" action when cooking
- Expiry warnings (nice-to-have)

**User Story:**  
*As Kev, I want to scan items when unloading shopping so the app knows what we have, and I can see what we could cook.*

### 3a. Trash Scanner (Used Item → Shopping List)
**Description:** Scan empty packaging to auto-add items to shopping list  
**Functionality:**
- Quick-access "Scan Trash" button (prominent in UI)
- Scan barcode of empty/used packaging
- Look up product via Open Food Facts API
- **Automatically add to shopping list** (not pantry)
- Optional: Remove from pantry inventory simultaneously
- Running "replenish list" builds up between shops
- Badge shows count of items scanned since last shop
- Export list to Sainsbury's/Tesco or view in-store

**User Flow:**
1. Finish the milk → grab empty carton
2. Open Five Thirty → tap "🗑️ Scan Trash"
3. Scan barcode → "Sainsbury's Semi-Skimmed Milk 2L added to shopping list"
4. Throw away carton
5. Repeat throughout the week
6. Friday: Open shopping list → all used items ready

**Smart Features:**
- Learns frequency (milk scanned every 3 days = regular item)
- Suggests quantity ("You usually buy 2 of these")
- Groups by store section for efficient shopping
- "Essentials" badge for frequently replenished items

**User Story:**  
*As Lucy, when I use the last of something, I want to scan the empty packet so it automatically goes on the shopping list without me having to remember or write it down.*

**Technical Approach:**
- Same barcode scanner component as pantry
- Different action: adds to `shopping_items` table with `source = 'trash_scan'`
- Optional toggle: "Also remove from pantry?"
- Dedicated quick-access route: `/scan` or floating action button

### 4. Smart Shopping List
**Description:** Auto-generated list based on meal plan minus pantry  
**Functionality:**
- Generate from selected week's meals
- Automatically subtract items already in pantry
- Manual add/remove items
- Categorised by aisle (Dairy, Meat, Veg, etc.)
- Shareable link for Lucy
- Copy-to-clipboard for Sainsbury's/Tesco app

**User Story:**  
*As Lucy, I want to open a shared link at Sainsbury's and see exactly what we need without duplicating what's at home.*

### 5. "What Can I Make?" AI Assistant
**Description:** Natural language query to find meals from ingredients  
**Functionality:**
- Text input: "we have chicken, rice, and peppers"
- Returns matching recipes from library
- Suggests similar recipes if no exact match
- Powered by Cloudflare Workers AI (free tier)

**User Story:**  
*As Kev, I want to type what's in the fridge and have the app tell me which of our family meals I can make tonight.*

### 6. Random Meal Selector
**Description:** Decision helper when nobody can choose  
**Functionality:**
- "Spin the wheel" randomiser from recipe library
- Filter constraints: "not spicy" (for Oscar nights), "quick", "kid-friendly"
- Animation for fun factor

**User Story:**  
*As Lucy, when we're both staring at each other saying "I don't know, what do YOU want?", I want to press a button and get a random suggestion that respects our constraints.*

---

## Nice-to-Have Features (V2+)

| Feature | Description | Complexity |
|---------|-------------|------------|
| Sainsbury's Direct Export | Deep link to Sainsbury's app with items | Medium |
| Tesco Direct Export | Deep link to Tesco app with items | Medium |
| Meal Prep Mode | Batch cooking scheduler | Medium |
| Nutritional Info | Calories, macros from Open Food Facts | Medium |
| Family Voting | Bobby/Oscar can vote on weekly options | Low |
| Home Assistant Integration | Display today's meal on dashboard | Medium |
| Voice Input | "Add chicken to shopping list" | Low |
| Expiry Date Tracking | Warn when pantry items expiring | Low |
| Receipt Scanning | OCR receipt to add multiple pantry items | High |
| Smart Reorder Predictions | ML-based "you usually need milk by now" | High |

---

## Technical Architecture

### Hosting Stack (Free Tier)
| Component | Service | Free Tier Limits |
|-----------|---------|------------------|
| Frontend Hosting | Cloudflare Pages | Unlimited sites |
| Backend/API | Cloudflare Workers | 100K req/day |
| Database | Cloudflare D1 (SQLite) | 5M reads/day, 100K writes/day, 5GB storage |
| AI Features | Cloudflare Workers AI | Llama models free |
| Auth | Cloudflare Access (Zero Trust) | 50 users free |
| Domain | home.helpmecomputing.com | Already owned |
| CDN/SSL | Cloudflare | Free |

### Tech Stack
```
Frontend:      React + TypeScript + TailwindCSS
Bundler:       Vite
Backend:       Cloudflare Workers (edge functions)
Database:      Cloudflare D1 (SQLite)
AI:            Workers AI (Llama 3.1)
Auth:          Cloudflare Access (email OTP)
Barcode API:   Open Food Facts (free, no key needed)
Hosting:       Cloudflare Pages
```

### Database Schema (D1/SQLite)

```sql
-- Users (minimal - just household members)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'member', -- 'admin' or 'member'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Recipes (the heart of the app)
CREATE TABLE recipes (
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
CREATE TABLE meal_plans (
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
CREATE TABLE pantry_items (
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
CREATE TABLE shopping_lists (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT DEFAULT 'Weekly Shop',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'active' -- active/completed
);

CREATE TABLE shopping_items (
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
CREATE TABLE measurement_conversions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    us_term TEXT NOT NULL,
    uk_term TEXT NOT NULL,
    category TEXT, -- 'volume', 'weight', 'temperature', 'ingredient'
    notes TEXT
);

-- Pre-populate conversions
INSERT INTO measurement_conversions (us_term, uk_term, category, notes) VALUES
('1 cup flour', '125g', 'volume', 'All-purpose/plain flour'),
('1 cup sugar', '200g', 'volume', 'Granulated'),
('1 cup butter', '225g', 'volume', '2 sticks'),
('1 cup milk', '240ml', 'volume', NULL),
('1 stick butter', '113g', 'weight', NULL),
('350°F', '180°C', 'temperature', 'Fan 160°C'),
('375°F', '190°C', 'temperature', 'Fan 170°C'),
('400°F', '200°C', 'temperature', 'Fan 180°C'),
('425°F', '220°C', 'temperature', 'Fan 200°C'),
('450°F', '230°C', 'temperature', 'Fan 210°C'),
('cilantro', 'coriander', 'ingredient', NULL),
('eggplant', 'aubergine', 'ingredient', NULL),
('zucchini', 'courgette', 'ingredient', NULL),
('scallions', 'spring onions', 'ingredient', NULL),
('green onions', 'spring onions', 'ingredient', NULL),
('bell pepper', 'pepper', 'ingredient', NULL),
('broil', 'grill', 'ingredient', 'cooking method'),
('all-purpose flour', 'plain flour', 'ingredient', NULL),
('heavy cream', 'double cream', 'ingredient', NULL),
('half-and-half', 'single cream', 'ingredient', NULL),
('confectioners sugar', 'icing sugar', 'ingredient', NULL),
('powdered sugar', 'icing sugar', 'ingredient', NULL),
('ground beef', 'beef mince', 'ingredient', NULL),
('ground pork', 'pork mince', 'ingredient', NULL),
('shrimp', 'prawns', 'ingredient', NULL),
('arugula', 'rocket', 'ingredient', NULL),
('romaine', 'cos lettuce', 'ingredient', NULL),
('semisweet chocolate', 'dark chocolate', 'ingredient', NULL),
('baking soda', 'bicarbonate of soda', 'ingredient', NULL),
('cookie', 'biscuit', 'ingredient', NULL),
('jello', 'jelly', 'ingredient', NULL),
('jelly', 'jam', 'ingredient', NULL),
('plastic wrap', 'cling film', 'ingredient', NULL),
('skillet', 'frying pan', 'ingredient', 'equipment');

-- Indexes for performance
CREATE INDEX idx_recipes_name ON recipes(name);
CREATE INDEX idx_meal_plans_date ON meal_plans(planned_date);
CREATE INDEX idx_pantry_category ON pantry_items(category);
CREATE INDEX idx_pantry_barcode ON pantry_items(barcode);
CREATE INDEX idx_shopping_items_source ON shopping_items(source);
CREATE INDEX idx_shopping_items_barcode ON shopping_items(barcode);
```

### API Endpoints (Workers)

```
GET    /api/recipes              # List all recipes
POST   /api/recipes              # Create recipe
GET    /api/recipes/:id          # Get single recipe
PUT    /api/recipes/:id          # Update recipe
DELETE /api/recipes/:id          # Delete recipe
GET    /api/recipes/search?q=    # Search recipes
POST   /api/recipes/import-url   # Import recipe from URL (NEW)

GET    /api/meal-plan?week=      # Get week's meal plan
POST   /api/meal-plan            # Add meal to plan
PUT    /api/meal-plan/:id        # Update planned meal
DELETE /api/meal-plan/:id        # Remove from plan

GET    /api/pantry               # Get all pantry items
POST   /api/pantry               # Add item
POST   /api/pantry/scan          # Lookup by barcode (Open Food Facts)
PUT    /api/pantry/:id           # Update item
DELETE /api/pantry/:id           # Remove item

GET    /api/shopping-list        # Get current list
POST   /api/shopping-list/generate # Generate from meal plan
PUT    /api/shopping-list/:id    # Update item
POST   /api/shopping-list/share  # Generate share link
POST   /api/shopping-list/trash-scan # Add item via trash scan (NEW)
GET    /api/shopping-list/export # Export for supermarket apps (NEW)

POST   /api/ai/suggest           # "What can I make?" query
POST   /api/ai/random            # Random meal with filters
POST   /api/ai/parse-recipe      # AI fallback for recipe extraction (NEW)
```

---

## UI/UX Design Direction

### Aesthetic Vision: "Warm Kitchen, Calm Clock"
A design that feels like a beloved family cookbook meets modern app, with subtle clock/time motifs. Not cold and clinical, not childish. Warm, inviting, and efficient. The 5:30 moment should feel solved, not stressful.

**Design Tokens:**
```css
/* Colour Palette - Warm & Appetizing */
--color-cream: #FAF7F2;          /* Background */
--color-warm-white: #FFFDF9;      /* Cards */
--color-terracotta: #C65D3B;      /* Primary accent - urgency, warmth */
--color-sage: #7B9E87;            /* Secondary accent - calm, solved */
--color-charcoal: #2D2D2D;        /* Text */
--color-mushroom: #8B7E74;        /* Subtle text */
--color-butter: #F5E6C8;          /* Highlights */
--color-clock-gold: #D4A853;      /* Time/clock accents */

/* Typography */
--font-display: 'Fraunces', serif;     /* Headers - warm, characterful */
--font-body: 'Source Sans 3', sans-serif; /* Body - clean, readable */

/* Spacing */
--space-unit: 8px;
--radius-soft: 12px;
--radius-round: 24px;
```

**Brand Elements:**
- Subtle clock motifs (5:30 indicator on home screen)
- "Dinner sorted" confirmation animations
- Warm, golden hour colour tones
- Fork-as-clock-hand icon treatment

**Key UI Elements:**
- **Recipe Cards:** Rounded corners, soft shadows, food photography (or placeholder illustration)
- **Calendar:** Week view with drag-drop, subtle hover states
- **Shopping List:** Checkbox satisfaction (strikethrough animation)
- **Random Selector:** Playful spin animation with confetti on reveal
- **Empty States:** Illustrated, encouraging ("No meals planned yet - let's fix that!")

**Mobile-First:**  
Primary use at supermarket on phone. Must work perfectly on iPhone/Android.

---

## Authentication Strategy

### Cloudflare Access (Zero Trust)
Simple email-based authentication for household members only.

**Setup:**
1. Add `home.helpmecomputing.com` to Cloudflare Access
2. Create Access Policy: "Allow email in [kev@..., lucy@...]"
3. Users receive OTP to email, no passwords to remember
4. Session lasts 30 days

**Why this approach:**
- No user/password management
- Free for up to 50 users
- Secure by default
- Works seamlessly with Cloudflare Pages

---

## External Integrations

### Open Food Facts API (Barcode Scanning)
**Purpose:** Look up product info from barcode scan  
**Endpoint:** `https://world.openfoodfacts.org/api/v2/product/{barcode}.json`  
**Cost:** Free, no API key required  
**Rate Limit:** Generous, suitable for home use  
**Data Returned:** Product name, category, image, nutrition  

**Example Response:**
```json
{
  "product": {
    "product_name": "Sainsbury's Chicken Breast Fillets",
    "brands": "Sainsbury's",
    "categories": "Meats, Poultry",
    "image_url": "https://..."
  }
}
```

### Cloudflare Workers AI (Meal Suggestions)
**Purpose:** Natural language ingredient matching  
**Model:** `@cf/meta/llama-3.1-8b-instruct`  
**Cost:** Free tier  

**Prompt Template:**
```
You are a helpful meal planning assistant for a family of 4 (2 adults, 2 children).

The user has these ingredients: {ingredients}

Here are their saved family recipes:
{recipe_list}

Suggest which recipes they could make with what they have. 
Be practical - if they're missing minor ingredients, mention it but still suggest the meal.
Keep suggestions family-friendly.
```

---

## Development Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Cloudflare project setup (Pages, Workers, D1)
- [ ] Database schema creation
- [ ] Basic React app structure with routing
- [ ] Authentication with Cloudflare Access
- [ ] Recipe CRUD API + UI

### Phase 2: Core Planning (Week 3-4)
- [ ] Meal plan calendar view
- [ ] Drag-and-drop meal assignment
- [ ] Recipe library with search/filter
- [ ] Mobile-responsive design pass

### Phase 3: Smart Features (Week 5-6)
- [ ] Pantry inventory management
- [ ] Barcode scanner integration (Open Food Facts)
- [ ] Shopping list generation
- [ ] Share functionality

### Phase 4: AI & Polish (Week 7-8)
- [ ] "What can I make?" AI feature
- [ ] Random meal selector
- [ ] Empty states and onboarding
- [ ] Performance optimisation
- [ ] PWA configuration (home screen app)

---

## Local Development Setup

### Prerequisites
```bash
# Install Node.js 18+ and npm
node --version  # Should be 18+

# Install Wrangler (Cloudflare CLI)
npm install -g wrangler

# Login to Cloudflare
wrangler login
```

### Project Initialisation
```bash
# Create project directory
mkdir fivethirty && cd fivethirty

# Initialise with Vite + React + TypeScript
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install
npm install @cloudflare/workers-types

# Create D1 database
wrangler d1 create fivethirty-db

# Create wrangler.toml configuration
```

### Environment Variables
```toml
# wrangler.toml
name = "fivethirty"
main = "functions/api/[[path]].ts"
compatibility_date = "2024-01-01"

[[d1_databases]]
binding = "DB"
database_name = "fivethirty-db"
database_id = "<your-database-id>"

[vars]
ENVIRONMENT = "development"
```

---

## Credentials & API Keys Required

| Service | Key Type | How to Get | Required |
|---------|----------|------------|----------|
| Cloudflare | Account | cloudflare.com signup | Yes |
| Cloudflare D1 | Auto via Wrangler | `wrangler d1 create` | Yes |
| Cloudflare Access | Dashboard config | Zero Trust dashboard | Yes |
| Open Food Facts | None needed | Free public API | N/A |
| Workers AI | Auto via Cloudflare | Enabled by default | Yes |

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| D1 free tier limits | Medium | 5M reads/day is plenty for family use |
| Open Food Facts missing UK products | Low | Manual entry fallback |
| Barcode scanning UX on mobile | Medium | Test early, have manual entry backup |
| Family adoption | High | Make Friday planning a household ritual |
| Recipe URL import complexity | Low | V2 feature, manual entry works for MVP |

---

## Success Criteria

### MVP Success (V1)
- [ ] Can plan Mon-Fri meals in < 10 minutes
- [ ] Shopping list generates accurately
- [ ] 10 family recipes seeded and usable
- [ ] Works on Kev's iPhone at Sainsbury's
- [ ] Lucy can access and view the plan

### 3-Month Success
- [ ] Weekly planning is a household habit
- [ ] 30+ rated recipes in library
- [ ] Noticeably less "what's for dinner?" stress
- [ ] Kids know where to look for tonight's meal

---

## Appendix A: Competitor Analysis

| App | Strengths | Weaknesses | Our Advantage |
|-----|-----------|------------|---------------|
| Mealime | Great UI, quick recipes | US-focused, no pantry | UK family focus, AI |
| Paprika | Recipe storage, shopping | No meal suggestions | AI integration |
| Plan to Eat | Family sharing | $49/year, no AI | Free, smarter |
| Cozi | Family calendar | Meal planning is basic | Dedicated meal focus |

---

## Appendix B: Kev's Starter Recipes

To seed the recipe library on first launch:

1. **Curry** - Chicken curry with rice (Kid-friendly version available)
2. **Spicy Mince** - Mexican-style mince with tacos
3. **Spag Bol** - Classic spaghetti bolognese (family favourite)
4. **Stir Fry** - Quick vegetable stir fry with noodles
5. **Roast Chicken** - Sunday roast style
6. **Fish Fingers & Chips** - Quick kid-friendly meal
7. **Chilli Con Carne** - With rice and toppings
8. **Shepherd's Pie** - Comfort food classic
9. **Pasta Bake** - Easy midweek meal
10. **Fajitas** - Build-your-own family dinner

*Notes to migrate: "Oscar doesn't like spicy" applies to Curry, Spicy Mince, Chilli*

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Dec 2024 | Kev | Initial PRD |
