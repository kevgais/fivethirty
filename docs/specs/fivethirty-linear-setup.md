# Five Thirty - Linear Project Setup

## Project Configuration

### Create New Project
- **Name:** Five Thirty
- **Description:** "Kill the 5:30 panic" - Family meal planning web app for weekly dinner planning, pantry tracking, and shopping list generation
- **Icon:** 🕠 or 🍽️
- **Lead:** Kev Gaisford
- **Status:** Backlog → In Progress → Review → Done

### Labels to Create

| Label | Color | Description |
|-------|-------|-------------|
| `frontend` | Blue | React/UI components |
| `backend` | Green | Workers API/Database |
| `design` | Pink | Styling/UX |
| `integration` | Orange | External APIs |
| `devops` | Purple | Deployment/Config |
| `bug` | Red | Defects |
| `enhancement` | Teal | Improvements |
| `blocked` | Grey | Waiting on dependency |

### Cycles/Sprints

| Cycle | Duration | Focus |
|-------|----------|-------|
| Sprint 1 | Week 1-2 | Foundation & Setup |
| Sprint 2 | Week 3-4 | Core Planning Features |
| Sprint 3 | Week 5-6 | Smart Features |
| Sprint 4 | Week 7-8 | AI & Polish |

---

## Issues to Create

### Epic: Project Setup (Sprint 1)

```
FT-1: Initialise project with Vite + React + TypeScript
Labels: devops, frontend
Priority: Urgent
Description:
- Create new Vite project with React + TypeScript template
- Install core dependencies (TailwindCSS, React Router)
- Configure TypeScript strict mode
- Set up folder structure per PRD
Acceptance Criteria:
- [ ] `npm run dev` starts local server
- [ ] TypeScript compiles without errors
- [ ] TailwindCSS working with test class
---

FT-2: Create TailwindCSS design system configuration
Labels: design
Priority: High
Description:
- Configure custom color palette (cream, terracotta, sage, etc.)
- Add Fraunces and Source Sans 3 fonts
- Define custom spacing and border-radius values
- Create animation keyframes
Acceptance Criteria:
- [ ] Design tokens match PRD specification
- [ ] Fonts load correctly
- [ ] Custom colors available in classes
---

FT-3: Set up Cloudflare wrangler.toml configuration
Labels: devops
Priority: High
Description:
- Create wrangler.toml for Workers
- Configure D1 database binding
- Set up Workers AI binding
- Define environment variables
Acceptance Criteria:
- [ ] `wrangler dev` starts local workers
- [ ] D1 binding configured
- [ ] Workers AI binding configured
---

FT-4: Create D1 database schema
Labels: backend
Priority: High
Description:
Create SQLite schema for:
- users table
- recipes table
- meal_plans table
- pantry_items table
- shopping_lists table
- shopping_items table
Include appropriate indexes for performance.
Acceptance Criteria:
- [ ] Migration SQL file created
- [ ] All tables created in D1
- [ ] Indexes exist for common queries
---

FT-5: Create basic app layout and navigation
Labels: frontend, design
Priority: High
Description:
- Create main App layout with header/nav
- Add React Router with routes for Home, Recipes, Planner, Pantry, Shopping
- Create mobile-responsive navigation
- Add placeholder pages for each route
Acceptance Criteria:
- [ ] Navigation works on mobile
- [ ] All routes accessible
- [ ] Active route highlighted
```

### Epic: Recipe Management (Sprint 2)

```
FT-6: Create recipes API endpoints
Labels: backend
Priority: High
Description:
Create Workers API endpoints:
- GET /api/recipes - list with search
- POST /api/recipes - create
- GET /api/recipes/:id - single
- PUT /api/recipes/:id - update
- DELETE /api/recipes/:id - delete
Acceptance Criteria:
- [ ] All CRUD operations work
- [ ] Search filters by name
- [ ] Proper error responses (404, 400)
---

FT-7: Create RecipeCard component
Labels: frontend, design
Priority: High
Description:
Create reusable recipe card showing:
- Recipe image or placeholder
- Name and prep/cook time
- Tag badges (quick, kid-friendly, etc.)
- Star rating display
- "Last served" date
- Hover state with quick actions
Acceptance Criteria:
- [ ] Matches design system
- [ ] Responsive on mobile
- [ ] Accessible (keyboard nav, aria)
---

FT-8: Create RecipeList page
Labels: frontend
Priority: High
Description:
- Display grid of RecipeCards
- Add search input
- Add tag filter chips
- Implement "Add Recipe" button
- Show empty state when no recipes
Acceptance Criteria:
- [ ] Recipes load from API
- [ ] Search filters in real-time
- [ ] Tag filtering works
---

FT-9: Create AddRecipe form/modal
Labels: frontend
Priority: High
Description:
Form fields:
- Name (required)
- Ingredients (dynamic list)
- Instructions (textarea)
- Prep time, Cook time, Servings
- Tags (multi-select)
- Notes
Acceptance Criteria:
- [ ] Form validation works
- [ ] Recipe saves to database
- [ ] Modal closes on save
- [ ] New recipe appears in list
---

FT-10: Create RecipeDetail page
Labels: frontend
Priority: Medium
Description:
- Full recipe view with all details
- Edit button opens form
- Delete with confirmation
- Rate recipe (1-5 stars)
- "Add to meal plan" action
Acceptance Criteria:
- [ ] All recipe data displayed
- [ ] Edit updates correctly
- [ ] Rating saves to database
---

FT-10a: Create URL recipe import API endpoint
Labels: backend, integration
Priority: High
Description:
Create POST /api/recipes/import-url endpoint:
- Accept URL parameter
- Fetch page content
- Extract JSON-LD recipe schema (primary method)
- Fallback to AI extraction for unstructured pages
- Return parsed recipe with UK conversions
Acceptance Criteria:
- [ ] BBC Good Food URLs parse correctly
- [ ] JSON-LD extraction works
- [ ] AI fallback triggers when needed
- [ ] Returns structured recipe object
---

FT-10b: Create UK measurement conversion utility
Labels: backend
Priority: High
Description:
Create lib/ukConversions.ts with:
- Cup to grams (context-aware: flour vs sugar)
- Fahrenheit to Celsius
- US to UK ingredient names (cilantro → coriander)
- Stick of butter to grams
Include comprehensive conversion tables.
Acceptance Criteria:
- [ ] All common conversions covered
- [ ] Context-aware volume conversions
- [ ] Returns list of changes made
---

FT-10c: Create ImportRecipeURL component
Labels: frontend
Priority: High
Description:
Modal/form for URL import:
- URL input field with paste support
- "Import" button with loading state
- Preview parsed recipe before saving
- Show conversions applied (expandable)
- Edit fields before final save
- Error handling for invalid URLs
Acceptance Criteria:
- [ ] Paste URL and preview works
- [ ] Can edit before saving
- [ ] Conversions visible
- [ ] Handles errors gracefully
---

FT-10d: Test URL import with major recipe sites
Labels: integration
Priority: Medium
Description:
Test and verify import works with:
- BBC Good Food
- Delicious Magazine
- Jamie Oliver
- Allrecipes UK
- Good Housekeeping
Document any site-specific quirks.
Acceptance Criteria:
- [ ] All 5 sites tested
- [ ] Edge cases documented
- [ ] Fallback works for problematic sites
```

### Epic: Meal Planning Calendar (Sprint 2)

```
FT-11: Create meal-plan API endpoints
Labels: backend
Priority: High
Description:
- GET /api/meal-plan?week=YYYY-Www
- POST /api/meal-plan (add meal to slot)
- PUT /api/meal-plan/:id (update)
- DELETE /api/meal-plan/:id (remove)
Acceptance Criteria:
- [ ] Returns week's meals correctly
- [ ] Prevents duplicate day/meal-type
- [ ] Updates recipe last_served date
---

FT-12: Create WeekCalendar component
Labels: frontend
Priority: High
Description:
- Display Mon-Fri as columns
- Show date for each day
- Week navigation (prev/next)
- Current week highlighted
- Empty slots visible
Acceptance Criteria:
- [ ] Correct dates displayed
- [ ] Week navigation works
- [ ] Responsive layout on mobile
---

FT-13: Create MealSlot component
Labels: frontend
Priority: High
Description:
- Display assigned recipe mini-card
- "Empty" state with add prompt
- Click to view recipe details
- Remove button (X)
Acceptance Criteria:
- [ ] Shows recipe name and icon
- [ ] Empty state is clear
- [ ] Remove works with confirmation
---

FT-14: Implement drag-and-drop for meal planning
Labels: frontend
Priority: High
Description:
- Drag recipe cards to calendar slots
- Visual feedback during drag
- Drop saves to database
- Reorder between days
Acceptance Criteria:
- [ ] Drag works on desktop
- [ ] Touch drag works on mobile
- [ ] Database updates on drop
---

FT-15: Create "Copy Last Week" feature
Labels: frontend, backend
Priority: Medium
Description:
- Button to duplicate previous week's plan
- Confirmation dialog
- Updates all dates appropriately
Acceptance Criteria:
- [ ] All meals copied correctly
- [ ] New dates assigned
```

### Epic: Pantry & Inventory (Sprint 3)

```
FT-16: Create pantry API endpoints
Labels: backend
Priority: High
Description:
- GET /api/pantry
- POST /api/pantry
- PUT /api/pantry/:id
- DELETE /api/pantry/:id
- POST /api/pantry/scan (barcode lookup)
Acceptance Criteria:
- [ ] CRUD operations work
- [ ] Barcode lookup returns product info
---

FT-17: Integrate Open Food Facts barcode API
Labels: integration
Priority: High
Description:
- Create barcode lookup function
- Handle UK products
- Extract name, brand, category
- Fallback for unknown barcodes
Acceptance Criteria:
- [ ] UK supermarket products resolve
- [ ] Unknown products handled gracefully
- [ ] Response time < 2 seconds
---

FT-18: Create PantryList component
Labels: frontend
Priority: High
Description:
- Display items grouped by location (fridge/freezer/cupboard)
- Category tabs or filters
- Quick delete/use actions
- Search within pantry
Acceptance Criteria:
- [ ] Items grouped correctly
- [ ] Filter tabs work
- [ ] Search is fast
---

FT-19: Create BarcodeScanner component
Labels: frontend, integration
Priority: High
Description:
- Access device camera
- Detect barcode in frame
- Lookup product via Open Food Facts
- Pre-fill add item form
- Fallback to manual entry
Acceptance Criteria:
- [ ] Camera access works on iPhone
- [ ] Barcode detected automatically
- [ ] Product name populated
- [ ] Manual entry available
---

FT-20: Create AddPantryItem form
Labels: frontend
Priority: Medium
Description:
- Name input (auto-filled from scan)
- Category dropdown (fridge/freezer/cupboard)
- Optional quantity
- Optional expiry date
- Quick-add common items list
Acceptance Criteria:
- [ ] Form saves item correctly
- [ ] Category required
- [ ] Quick-add works
```

### Epic: Shopping List & Trash Scanner (Sprint 3)

```
FT-21: Create shopping list API endpoints
Labels: backend
Priority: High
Description:
- GET /api/shopping-list
- POST /api/shopping-list/generate
- PUT /api/shopping-list/:id (check/uncheck)
- POST /api/shopping-list/share
Acceptance Criteria:
- [ ] Generation calculates correctly
- [ ] Subtracts pantry items
- [ ] Share creates public URL
---

FT-21a: Create trash scan API endpoint
Labels: backend
Priority: High
Description:
Create POST /api/shopping-list/trash-scan:
- Accept barcode parameter
- Lookup product via Open Food Facts
- Add to shopping list with source='trash_scan'
- Return item details and list count
- Optionally remove from pantry
Acceptance Criteria:
- [ ] Barcode lookup works
- [ ] Item added to shopping list
- [ ] Source tracked as 'trash_scan'
- [ ] Returns updated list count
---

FT-21b: Create TrashScanner component
Labels: frontend
Priority: High
Description:
Quick-access trash scanning interface:
- Floating Action Button (FAB) on main screens
- Opens camera for barcode scan
- Shows "Added: [item name]" toast
- Badge showing scanned items count
- Different visual style from pantry scanner
Acceptance Criteria:
- [ ] FAB visible on main pages
- [ ] Camera opens quickly
- [ ] Toast confirms addition
- [ ] Badge updates in real-time
---

FT-21c: Create ScannedItemsBadge component
Labels: frontend
Priority: Medium
Description:
Badge showing count of trash-scanned items:
- Appears on shopping list nav item
- Shows count since last shop completed
- Pulses/animates when new item added
- Resets when list marked complete
Acceptance Criteria:
- [ ] Count accurate
- [ ] Animation on new item
- [ ] Resets correctly
---

FT-21d: Create dedicated /scan quick-access page
Labels: frontend
Priority: Medium
Description:
Dedicated scan page for quick access:
- Large scan button/camera view
- Recent scanned items list
- "View Shopping List" link
- Can be bookmarked/home screen
Acceptance Criteria:
- [ ] Fast to load
- [ ] Camera ready immediately
- [ ] Recent items visible
---

FT-22: Create shopping list generation logic
Labels: backend
Priority: High
Description:
- Collect ingredients from week's meal plan
- Subtract items in pantry
- Combine duplicate ingredients
- Categorise by aisle
Acceptance Criteria:
- [ ] All meal ingredients included
- [ ] Pantry items excluded
- [ ] Quantities combined (2x onion)
---

FT-23: Create ShoppingList component
Labels: frontend
Priority: High
Description:
- Display items grouped by category/aisle
- Checkbox for each item
- Strikethrough animation on check
- "Generate from meal plan" button
- Clear completed items
Acceptance Criteria:
- [ ] Categories collapsible
- [ ] Check animation satisfying
- [ ] Works offline (cached)
---

FT-24: Create shareable shopping list feature
Labels: frontend, backend
Priority: Medium
Description:
- Generate public share URL
- Share via native share API
- Copy to clipboard fallback
- Shared view is read-only
Acceptance Criteria:
- [ ] Share URL works without login
- [ ] Native share on mobile
- [ ] Link expires after 7 days
---

FT-25: Create manual item add to shopping list
Labels: frontend
Priority: Medium
Description:
- Quick add input at top of list
- Category auto-detection
- Add multiple items (comma-separated)
Acceptance Criteria:
- [ ] Items add instantly
- [ ] Category guessed correctly
---

FT-25a: Create shopping list export feature
Labels: frontend, integration
Priority: Medium
Description:
Export shopping list for supermarket apps:
- Copy as plain text (for pasting)
- Copy as formatted list
- Share via native share API
- "Open Sainsbury's/Tesco" deep links (if available)
- Email list option
Acceptance Criteria:
- [ ] Copy to clipboard works
- [ ] Share sheet opens on mobile
- [ ] List format is clean
```

### Epic: AI Features (Sprint 4)

```
FT-26: Create Workers AI meal suggestion endpoint
Labels: backend, integration
Priority: High
Description:
- POST /api/ai/suggest
- Accept ingredients list
- Query Llama 3.1 with family recipes
- Return matching recipes with confidence
Acceptance Criteria:
- [ ] AI responds within 3 seconds
- [ ] Suggestions are relevant
- [ ] Missing ingredients noted
---

FT-27: Create "What Can I Make?" UI component
Labels: frontend
Priority: High
Description:
- Natural language text input
- Example prompts ("we have chicken and rice")
- Loading state during AI call
- Display suggestions with match %
- Click suggestion to view recipe
Acceptance Criteria:
- [ ] Input accepts natural language
- [ ] Results display clearly
- [ ] Links to actual recipes
---

FT-28: Create RandomMealSelector component
Labels: frontend, design
Priority: Medium
Description:
- "Spin the wheel" style animation
- Filter options (not spicy, quick, etc.)
- Reveal animation with confetti
- "Try again" option
Acceptance Criteria:
- [ ] Animation is delightful
- [ ] Filters work correctly
- [ ] Result links to recipe
---

FT-29: Create AI prompt engineering
Labels: integration
Priority: Medium
Description:
- Optimise Llama 3.1 prompt for meal matching
- Handle UK ingredient names
- Include family preferences (Oscar spice)
- Test with various inputs
Acceptance Criteria:
- [ ] Prompt returns JSON consistently
- [ ] UK spellings work
- [ ] Family notes respected
```

### Epic: Polish & Deploy (Sprint 4)

```
FT-30: Create empty states for all sections
Labels: frontend, design
Priority: Medium
Description:
Create illustrated empty states:
- No recipes yet
- No meals planned this week
- Pantry is empty
- Shopping list empty
Each with helpful call-to-action
Acceptance Criteria:
- [ ] All empty states designed
- [ ] CTAs are actionable
- [ ] Illustrations match design
---

FT-31: Add loading states and skeletons
Labels: frontend
Priority: Medium
Description:
- Skeleton loaders for recipe cards
- Skeleton for calendar
- Spinner for API operations
- Progressive loading for lists
Acceptance Criteria:
- [ ] No layout shift during load
- [ ] Skeletons match final UI
---

FT-32: Mobile responsiveness pass
Labels: design, frontend
Priority: High
Description:
- Test all pages on 375px viewport
- Fix any overflow issues
- Ensure touch targets are 44px+
- Test on actual iPhone
Acceptance Criteria:
- [ ] No horizontal scroll
- [ ] All buttons tappable
- [ ] Text readable without zoom
---

FT-33: Configure PWA manifest and service worker
Labels: devops, frontend
Priority: Medium
Description:
- Create manifest.json
- Add app icons (various sizes)
- Configure service worker for offline
- Enable "Add to Home Screen"
Acceptance Criteria:
- [ ] Installable on iPhone
- [ ] Offline fallback works
- [ ] App icon appears correctly
---

FT-34: Deploy to Cloudflare Pages
Labels: devops
Priority: Urgent (when ready)
Description:
- Connect GitHub repo to Pages
- Configure build settings
- Deploy D1 migrations
- Verify API routes work
- Set up custom domain
Acceptance Criteria:
- [ ] Site live at home.helpmecomputing.com
- [ ] API endpoints accessible
- [ ] Database populated
---

FT-35: Configure Cloudflare Access authentication
Labels: devops
Priority: Urgent (when ready)
Description:
- Set up Access application
- Add email allowlist (kev@, lucy@)
- Configure session duration (30 days)
- Test login flow
Acceptance Criteria:
- [ ] Only family can access
- [ ] Email OTP works
- [ ] Session persists on mobile
---

FT-36: Seed database with family recipes
Labels: backend
Priority: High
Description:
Import starter recipes:
- Curry, Spicy Mince, Spag Bol, Stir Fry
- Fish Fingers & Chips, Chilli Con Carne
- Shepherd's Pie, Pasta Bake, Fajitas, Roast Chicken
Include notes about Oscar's spice preferences
Acceptance Criteria:
- [ ] All 10 recipes added
- [ ] Tags assigned correctly
- [ ] Notes populated
```

---

## Import Instructions for Linear

### Option 1: Manual Creation
1. Create project "Five Thirty" in Linear
2. Create labels as listed above
3. Create each issue manually, copying title and description
4. Assign to sprints/cycles

### Option 2: CSV Import
Linear supports CSV import. Create a CSV with columns:
- Title
- Description  
- Priority (Urgent/High/Medium/Low)
- Labels (comma-separated)
- Cycle

### Option 3: Linear API
```bash
# Example API call to create issue
curl -X POST https://api.linear.app/graphql \
  -H "Authorization: <API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { issueCreate(input: { title: \"...\", description: \"...\", teamId: \"...\" }) { success issue { id } } }"
  }'
```

---

## Suggested Workflow

### Daily Standup (Self)
- Review current sprint
- Move items In Progress → Review → Done
- Identify blockers

### Friday Planning
- Review week's progress
- Plan next week's meals (use the app!)
- Adjust sprint scope if needed

### Definition of Done
- [ ] Code complete and compiles
- [ ] Works on mobile
- [ ] No TypeScript errors
- [ ] Tested manually
- [ ] Committed to main branch

---

## Progress Tracking

| Sprint | Issues | Estimate | Status |
|--------|--------|----------|--------|
| 1 - Foundation | FT-1 to FT-5 | 2 weeks | Not Started |
| 2 - Core Features | FT-6 to FT-15 (incl. 10a-d) | 2 weeks | Not Started |
| 3 - Smart Features | FT-16 to FT-25a (incl. 21a-d) | 2 weeks | Not Started |
| 4 - AI & Polish | FT-26 to FT-36 | 2 weeks | Not Started |

**Total Issues:** 45  
**Target Completion:** 8 weeks from start
