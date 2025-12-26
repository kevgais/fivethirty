# Five Thirty - Claude Code Execution Prompt

## Project Context

You are building **Five Thirty** ("Kill the 5:30 panic"), a family meal planning web application for a household of 4 (Kev, Lucy, Bobby, Oscar). Read the full PRD at `./fivethirty-prd.md` before starting.

**Brand:** Five Thirty - solving that 5:30pm "what's for dinner?" panic moment.

**Tech Stack:**
- Frontend: React + TypeScript + TailwindCSS + Vite
- Backend: Cloudflare Workers
- Database: Cloudflare D1 (SQLite)
- AI: Cloudflare Workers AI (Llama 3.1)
- Auth: Cloudflare Access
- Hosting: Cloudflare Pages
- Domain: home.helpmecomputing.com

**Key Constraint:** Free tier only - no paid services.

---

## Subagent Architecture

Use the following subagent delegation pattern. Each subagent has a specific responsibility and should be invoked with `Task:` prefix.

### Orchestrator (You)
Coordinates the build, delegates to subagents, integrates their outputs, handles conflicts.

### Subagent: @database
**Responsibility:** D1 schema, migrations, database operations
**Capabilities:**
- Design and create SQLite schemas
- Write migration scripts
- Create database utility functions
- Optimise queries with indexes

**Invocation:**
```
Task: @database
Create the initial D1 schema for Five Thirty including:
- users, recipes, meal_plans, pantry_items, shopping_lists, shopping_items
- Appropriate indexes for performance
- Generate migration SQL file
```

### Subagent: @api
**Responsibility:** Cloudflare Workers API routes
**Capabilities:**
- RESTful endpoint design
- Request validation
- Database queries via D1 binding
- Error handling
- Workers AI integration

**Invocation:**
```
Task: @api
Create the recipes API with:
- GET /api/recipes (list, with search)
- POST /api/recipes (create)
- GET /api/recipes/:id (single)
- PUT /api/recipes/:id (update)
- DELETE /api/recipes/:id (delete)
Include proper error handling and D1 queries.
```

### Subagent: @ui
**Responsibility:** React components and pages
**Capabilities:**
- Component architecture
- State management (React Query or SWR)
- Responsive design with TailwindCSS
- Accessibility considerations
- Animation and micro-interactions

**Invocation:**
```
Task: @ui
Create the RecipeCard component with:
- Recipe image/placeholder
- Name, prep time, tags
- Rating display
- "Last served" badge
- Hover state with quick actions
Follow the "Warm Kitchen Digital" design system from PRD.
```

### Subagent: @design
**Responsibility:** Visual design, styling, design tokens
**Capabilities:**
- TailwindCSS configuration
- Design token definition
- Typography and color systems
- Component styling patterns
- Animation definitions

**Invocation:**
```
Task: @design
Create the TailwindCSS configuration with:
- Custom color palette (cream, terracotta, sage, etc.)
- Typography scale with Fraunces + Source Sans 3
- Custom spacing and border-radius
- Animation keyframes for interactions
```

### Subagent: @integration
**Responsibility:** External service integrations
**Capabilities:**
- Open Food Facts API integration
- Cloudflare Access setup
- Workers AI prompting
- Share functionality
- **Recipe URL parsing and extraction**
- **UK measurement conversion logic**

**Invocation:**
```
Task: @integration
Create the barcode scanning integration:
- Camera access via browser API
- Open Food Facts API lookup
- Product name extraction
- Fallback for unknown products
```

```
Task: @integration
Create the URL recipe import system:
- Fetch URL content via Workers
- Extract JSON-LD structured recipe data
- Fallback to AI extraction for unstructured pages
- Apply UK measurement conversion rules
- Return normalised recipe object
```

### Subagent: @devops
**Responsibility:** Build, deploy, configuration
**Capabilities:**
- Wrangler configuration
- Environment setup
- Build scripts
- Deployment pipeline
- D1 database provisioning

**Invocation:**
```
Task: @devops
Create the wrangler.toml configuration with:
- D1 database binding
- Workers AI binding
- Environment variables
- Build settings for Pages
```

---

## Execution Plan

Execute the following phases in order. After each phase, verify the build succeeds before proceeding.

### Phase 1: Project Setup
```
1. Task: @devops - Initialise Vite + React + TypeScript project
2. Task: @design - Create TailwindCSS config with design tokens
3. Task: @devops - Create wrangler.toml for Cloudflare
4. Task: @database - Create D1 schema and migrations
5. Verify: `npm run build` succeeds
```

### Phase 2: Recipe Foundation
```
1. Task: @api - Create recipes CRUD endpoints
2. Task: @ui - Create RecipeCard component
3. Task: @ui - Create RecipeList page
4. Task: @ui - Create AddRecipe form/modal
5. Task: @ui - Create RecipeDetail page
6. Task: @integration - Create URL recipe import with JSON-LD extraction
7. Task: @integration - Create UK measurement conversion utility
8. Task: @ui - Create ImportRecipeURL component with preview
9. Verify: Can add recipes manually AND via URL import
```

### Phase 3: Meal Planning Calendar
```
1. Task: @api - Create meal-plan endpoints
2. Task: @ui - Create WeekCalendar component (Mon-Fri)
3. Task: @ui - Create drag-and-drop functionality
4. Task: @ui - Create MealSlot component
5. Verify: Can drag recipes to calendar days
```

### Phase 4: Pantry & Inventory
```
1. Task: @api - Create pantry endpoints
2. Task: @integration - Integrate Open Food Facts barcode API
3. Task: @ui - Create PantryList component
4. Task: @ui - Create AddPantryItem with barcode scanner
5. Task: @ui - Create category filters (fridge/freezer/cupboard)
6. Verify: Can scan barcode and add items
```

### Phase 5: Shopping List & Trash Scanner
```
1. Task: @api - Create shopping-list endpoints with generation logic
2. Task: @api - Create trash-scan endpoint (barcode → shopping list)
3. Task: @ui - Create ShoppingList component
4. Task: @ui - Create checkbox interactions with animations
5. Task: @ui - Create TrashScanner component (quick-access FAB)
6. Task: @ui - Create "Scanned Items" section with badge count
7. Task: @integration - Create shareable link functionality
8. Task: @integration - Create export for supermarket apps
9. Verify: Shopping list generates from meal plan minus pantry
10. Verify: Trash scanner adds items to shopping list
```

### Phase 6: AI Features
```
1. Task: @integration - Create Workers AI prompt for meal suggestions
2. Task: @api - Create /api/ai/suggest endpoint
3. Task: @ui - Create "What Can I Make?" input component
4. Task: @ui - Create RandomMealSelector with spin animation
5. Verify: Can type ingredients and get suggestions
```

### Phase 7: Polish & Deploy
```
1. Task: @ui - Create empty states for all sections
2. Task: @ui - Add loading states and skeletons
3. Task: @design - Mobile responsiveness pass
4. Task: @devops - PWA manifest and service worker
5. Task: @devops - Deploy to Cloudflare Pages
6. Task: @devops - Configure Cloudflare Access for auth
7. Verify: App works on mobile at Sainsbury's
```

---

## File Structure

Create this project structure:

```
fivethirty/
├── src/
│   ├── components/
│   │   ├── recipes/
│   │   │   ├── RecipeCard.tsx
│   │   │   ├── RecipeList.tsx
│   │   │   ├── RecipeForm.tsx
│   │   │   ├── RecipeDetail.tsx
│   │   │   ├── ImportRecipeURL.tsx      # NEW: URL import modal
│   │   │   └── RecipePreview.tsx        # NEW: Preview before save
│   │   ├── calendar/
│   │   │   ├── WeekCalendar.tsx
│   │   │   ├── MealSlot.tsx
│   │   │   └── DayColumn.tsx
│   │   ├── pantry/
│   │   │   ├── PantryList.tsx
│   │   │   ├── PantryItem.tsx
│   │   │   └── BarcodeScanner.tsx
│   │   ├── shopping/
│   │   │   ├── ShoppingList.tsx
│   │   │   ├── ShoppingItem.tsx
│   │   │   ├── TrashScanner.tsx         # NEW: Quick trash scan
│   │   │   ├── ScannedItemsBadge.tsx    # NEW: Count badge
│   │   │   └── ExportOptions.tsx        # NEW: Export to apps
│   │   ├── ai/
│   │   │   ├── WhatCanIMake.tsx
│   │   │   └── RandomSelector.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── FloatingActionButton.tsx # NEW: Quick scan access
│   │       └── EmptyState.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Recipes.tsx
│   │   ├── Planner.tsx
│   │   ├── Pantry.tsx
│   │   ├── Shopping.tsx
│   │   └── QuickScan.tsx                # NEW: Dedicated scan page
│   ├── hooks/
│   │   ├── useRecipes.ts
│   │   ├── useFive Thirty.ts
│   │   ├── usePantry.ts
│   │   ├── useShoppingList.ts
│   │   └── useBarcodeScanner.ts         # NEW: Shared scanner hook
│   ├── lib/
│   │   ├── api.ts
│   │   ├── utils.ts
│   │   ├── constants.ts
│   │   ├── ukConversions.ts             # NEW: Measurement conversion
│   │   └── recipeParser.ts              # NEW: URL parsing logic
│   ├── styles/
│   │   └── globals.css
│   ├── App.tsx
│   └── main.tsx
├── functions/
│   └── api/
│       ├── recipes.ts
│       ├── recipes-import.ts            # NEW: URL import endpoint
│       ├── meal-plan.ts
│       ├── pantry.ts
│       ├── shopping-list.ts
│       ├── trash-scan.ts                # NEW: Trash scan endpoint
│       └── ai.ts
├── migrations/
│   ├── 0001_initial_schema.sql
│   └── 0002_uk_conversions.sql          # NEW: Conversion data
├── public/
│   ├── manifest.json
│   └── icons/
├── package.json
├── tailwind.config.js
├── wrangler.toml
├── tsconfig.json
└── vite.config.ts
```

---

## Design System Reference

When creating UI components, use these design tokens:

```typescript
// tailwind.config.js colors
colors: {
  cream: '#FAF7F2',
  'warm-white': '#FFFDF9',
  terracotta: '#C65D3B',
  sage: '#7B9E87',
  charcoal: '#2D2D2D',
  mushroom: '#8B7E74',
  butter: '#F5E6C8',
}

// Font families (add to <head>)
// Fraunces: https://fonts.google.com/specimen/Fraunces
// Source Sans 3: https://fonts.google.com/specimen/Source+Sans+3

fontFamily: {
  display: ['Fraunces', 'serif'],
  body: ['Source Sans 3', 'sans-serif'],
}
```

**Component Styling Principles:**
- Rounded corners: `rounded-xl` (12px) or `rounded-2xl` (16px)
- Soft shadows: `shadow-sm` or `shadow-md`
- Generous padding: `p-4` minimum on cards
- Warm backgrounds: `bg-cream` or `bg-warm-white`
- Primary actions: `bg-terracotta text-white`
- Secondary elements: `text-sage` or `bg-sage/10`

---

## API Examples

### Create Recipe
```typescript
// POST /api/recipes
{
  "name": "Spag Bol",
  "ingredients": ["spaghetti", "mince", "tomatoes", "onion", "garlic"],
  "instructions": "Brown the mince...",
  "prep_time_mins": 15,
  "cook_time_mins": 30,
  "servings": 4,
  "tags": ["kid-friendly", "freezer-friendly"],
  "notes": "Family favourite - Oscar asks for seconds"
}
```

### Import Recipe from URL
```typescript
// POST /api/recipes/import-url
{
  "url": "https://www.bbcgoodfood.com/recipes/spaghetti-bolognese"
}

// Response (with UK conversions applied)
{
  "success": true,
  "recipe": {
    "name": "Spaghetti Bolognese",
    "source_url": "https://www.bbcgoodfood.com/recipes/spaghetti-bolognese",
    "ingredients": [
      "500g beef mince",           // was "1lb ground beef"
      "400g tinned tomatoes",
      "2 tbsp olive oil",
      "1 onion, diced"
    ],
    "instructions": "Heat oven to 180°C...",  // was "350°F"
    "prep_time_mins": 15,
    "cook_time_mins": 45,
    "servings": 4,
    "image_url": "https://...",
    "conversions_applied": [
      { "original": "1lb ground beef", "converted": "500g beef mince" },
      { "original": "350°F", "converted": "180°C" }
    ]
  },
  "needs_review": false  // true if AI extraction used
}
```

### URL Parsing Logic
```typescript
// lib/recipeParser.ts

interface ParsedRecipe {
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
  imageUrl?: string;
  sourceUrl: string;
}

async function parseRecipeUrl(url: string): Promise<ParsedRecipe> {
  // Fetch the page
  const html = await fetch(url).then(r => r.text());
  
  // Try JSON-LD first (most reliable)
  const jsonLd = extractJsonLd(html);
  if (jsonLd?.['@type'] === 'Recipe') {
    return normalizeJsonLdRecipe(jsonLd);
  }
  
  // Fallback to AI extraction
  return await aiExtractRecipe(html, url);
}

function extractJsonLd(html: string): any {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (match) {
    const data = JSON.parse(match[1]);
    // Handle array of schemas
    if (Array.isArray(data)) {
      return data.find(d => d['@type'] === 'Recipe');
    }
    return data['@type'] === 'Recipe' ? data : null;
  }
  return null;
}
```

### UK Measurement Conversion
```typescript
// lib/ukConversions.ts

const VOLUME_CONVERSIONS: Record<string, { grams: number; ml?: number }> = {
  'cup flour': { grams: 125 },
  'cup sugar': { grams: 200 },
  'cup butter': { grams: 225 },
  'cup milk': { ml: 240 },
  'cup water': { ml: 240 },
  'stick butter': { grams: 113 },
  'tablespoon': { ml: 15 },
  'teaspoon': { ml: 5 },
};

const TEMP_CONVERSIONS: Record<number, number> = {
  300: 150, 325: 160, 350: 180, 375: 190,
  400: 200, 425: 220, 450: 230, 475: 240,
};

const INGREDIENT_SWAPS: Record<string, string> = {
  'cilantro': 'coriander',
  'eggplant': 'aubergine',
  'zucchini': 'courgette',
  'scallions': 'spring onions',
  'green onions': 'spring onions',
  'ground beef': 'beef mince',
  'ground pork': 'pork mince',
  'heavy cream': 'double cream',
  'half-and-half': 'single cream',
  'all-purpose flour': 'plain flour',
  'confectioners sugar': 'icing sugar',
  'powdered sugar': 'icing sugar',
  'broil': 'grill',
  'shrimp': 'prawns',
  'arugula': 'rocket',
  'baking soda': 'bicarbonate of soda',
};

function convertToUK(text: string): { converted: string; changes: string[] } {
  const changes: string[] = [];
  let result = text;
  
  // Convert temperatures (e.g., "350°F" → "180°C")
  result = result.replace(/(\d+)°?F/gi, (match, temp) => {
    const celsius = TEMP_CONVERSIONS[parseInt(temp)];
    if (celsius) {
      changes.push(`${match} → ${celsius}°C`);
      return `${celsius}°C`;
    }
    return match;
  });
  
  // Convert US ingredients to UK names
  for (const [us, uk] of Object.entries(INGREDIENT_SWAPS)) {
    const regex = new RegExp(`\\b${us}\\b`, 'gi');
    if (regex.test(result)) {
      changes.push(`${us} → ${uk}`);
      result = result.replace(regex, uk);
    }
  }
  
  // Convert cup measurements (context-aware)
  result = result.replace(/(\d+(?:\/\d+)?)\s*cups?\s+(\w+)/gi, (match, qty, ingredient) => {
    const key = `cup ${ingredient.toLowerCase()}`;
    const conversion = VOLUME_CONVERSIONS[key];
    if (conversion) {
      const amount = evalFraction(qty);
      const grams = Math.round(amount * (conversion.grams || conversion.ml!));
      const unit = conversion.grams ? 'g' : 'ml';
      changes.push(`${match} → ${grams}${unit}`);
      return `${grams}${unit} ${ingredient}`;
    }
    return match;
  });
  
  return { converted: result, changes };
}
```

### Trash Scanner Endpoint
```typescript
// POST /api/shopping-list/trash-scan
{
  "barcode": "5000128000000"
}

// Response
{
  "success": true,
  "item": {
    "name": "Sainsbury's Semi-Skimmed Milk 2L",
    "brand": "Sainsbury's",
    "category": "dairy",
    "barcode": "5000128000000",
    "added_to_list": true
  },
  "shopping_list_count": 7  // Total items on list now
}
```

### Barcode Lookup (Open Food Facts)
```typescript
// Internal function
async function lookupBarcode(barcode: string) {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
  );
  const data = await response.json();
  return {
    name: data.product?.product_name || 'Unknown Product',
    brand: data.product?.brands || '',
    category: data.product?.categories || '',
    image: data.product?.image_url || null
  };
}
```

### AI Meal Suggestion Prompt
```typescript
const prompt = `You are a helpful meal planning assistant for a UK family of 4.

Available ingredients: ${ingredients.join(', ')}

Family recipes:
${recipes.map(r => `- ${r.name}: needs ${r.ingredients.join(', ')}`).join('\n')}

Which recipes could they make? Consider:
- Missing 1-2 minor ingredients is OK, mention what's needed
- Suggest the best 3 matches
- Keep it practical and family-friendly

Respond in JSON: { "suggestions": [{ "recipe": "name", "missing": ["item"], "confidence": "high/medium/low" }] }`;
```

---

## Critical Success Factors

1. **Mobile-first:** Test on iPhone throughout development
2. **Fast:** Page loads < 1 second, interactions instant
3. **Offline-aware:** Show cached data if offline (PWA)
4. **Forgiving:** Barcode fails? Easy manual entry. AI fails? Show all recipes.
5. **Delightful:** Small animations, satisfying checkboxes, warm UI
6. **On-brand:** The 5:30 moment should feel solved, not stressful

---

## Testing Checklist

Before each phase completion:
- [ ] `npm run build` succeeds without errors
- [ ] TypeScript has no type errors
- [ ] UI renders correctly on mobile viewport (375px)
- [ ] API endpoints return expected responses
- [ ] Database operations don't throw errors

Before final deployment:
- [ ] Works on iPhone Safari at actual Sainsbury's (real test!)
- [ ] Shopping list is shareable and opens correctly
- [ ] Barcode scanner works with UK products
- [ ] "What can I make?" returns sensible suggestions
- [ ] All family members can authenticate

---

## Seed Data

After first deploy, seed these recipes:

```sql
INSERT INTO recipes (name, ingredients, prep_time_mins, cook_time_mins, tags, notes) VALUES
('Curry', '["chicken", "onion", "curry paste", "coconut milk", "rice"]', 15, 30, '["kid-friendly-version-available"]', 'Make mild for Oscar'),
('Spicy Mince', '["mince", "onion", "taco seasoning", "peppers", "tacos"]', 10, 20, '["spicy"]', 'Oscar prefers plain mince'),
('Spag Bol', '["spaghetti", "mince", "tomatoes", "onion", "garlic"]', 15, 30, '["kid-friendly", "freezer-friendly"]', 'Family favourite'),
('Stir Fry', '["noodles", "vegetables", "soy sauce", "chicken"]', 10, 15, '["quick", "kid-friendly"]', NULL),
('Fish Fingers & Chips', '["fish fingers", "chips", "peas"]', 5, 25, '["quick", "kid-friendly"]', 'Easy Friday night'),
('Chilli Con Carne', '["mince", "kidney beans", "tomatoes", "chilli"]', 15, 45, '["spicy", "freezer-friendly"]', 'Too spicy for Oscar'),
('Shepherds Pie', '["mince", "potatoes", "carrots", "onion", "gravy"]', 20, 40, '["kid-friendly", "freezer-friendly"]', 'Comfort food classic'),
('Pasta Bake', '["pasta", "cheese", "tomatoes", "bacon"]', 15, 30, '["kid-friendly"]', NULL),
('Fajitas', '["chicken", "peppers", "onion", "wraps", "salsa"]', 15, 15, '["quick", "kid-friendly"]', 'Build your own'),
('Roast Chicken', '["chicken", "potatoes", "carrots", "gravy"]', 20, 90, '["weekend"]', 'Sunday special');
```

---

## Go Build It!

Start with Phase 1 and work through systematically. After each subagent task, review the output, integrate it, and verify the build before proceeding.

Remember: This is **Five Thirty** - for Kev's actual family. Make it work beautifully on his iPhone at Sainsbury's. 

**The goal: When 5:30pm hits, the answer is one tap away.**
