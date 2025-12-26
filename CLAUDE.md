# Five Thirty - CLAUDE.md

## Project Overview
**"Kill the 5:30 panic."** — Family meal planning web app for Kev, Lucy, Bobby, and Oscar.

## Tech Stack
- **Frontend:** React + TypeScript + TailwindCSS + Vite
- **Backend:** Cloudflare Workers
- **Database:** Cloudflare D1 (SQLite)
- **AI:** Cloudflare Workers AI (Llama 3.1)
- **Auth:** Cloudflare Access
- **Hosting:** Cloudflare Pages
- **Domain:** home.helpmecomputing.com

## Local Development
```bash
# Start dev server
npm run dev              # Frontend: http://localhost:5173

# Start workers locally
npx wrangler dev         # API: http://localhost:8787

# Run D1 migrations (local)
npx wrangler d1 execute fivethirty-db --local --file=migrations/0001_initial_schema.sql
```

## Database
- **D1 Database ID:** `4a237d8a-8ea8-4170-9af6-a53ea231b0f2`
- **Region:** WEUR (Western Europe)
- **Tables:** users, recipes, meal_plans, pantry_items, shopping_lists, shopping_items, measurement_conversions

## Project Tracking
- **Linear Project:** Five Thirty
- **PRD:** See `../five30/fivethirty-prd.md`

## Design System
| Token | Value | Usage |
|-------|-------|-------|
| cream | #FAF7F2 | Background |
| warm-white | #FFFDF9 | Cards |
| terracotta | #C65D3B | Primary accent |
| sage | #7B9E87 | Secondary accent |
| charcoal | #2D2D2D | Text |
| mushroom | #8B7E74 | Subtle text |
| butter | #F5E6C8 | Highlights |
| clock-gold | #D4A853 | Time accents |

**Fonts:** Fraunces (display), Source Sans 3 (body)

## Key Files
```
src/
├── components/      # React components
├── pages/           # Route pages
├── hooks/           # Custom hooks
├── lib/             # Utilities
functions/api/       # Cloudflare Workers API
migrations/          # D1 SQL migrations
```

## API Endpoints (Planned)
```
GET    /api/recipes              # List recipes
POST   /api/recipes              # Create recipe
POST   /api/recipes/import-url   # Import from URL
GET    /api/meal-plan            # Week's meals
POST   /api/pantry/scan          # Barcode lookup
POST   /api/shopping-list/trash-scan  # Trash scanner
POST   /api/ai/suggest           # AI meal suggestions
```

## Session Log
_Append progress updates below_

### 2024-12-26
- Project initialized with Vite + React + TypeScript
- TailwindCSS configured with design tokens
- D1 database created and migrations run
- 10 seed recipes added
- Linear backlog to be created
