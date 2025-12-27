/**
 * Five Thirty API - Cloudflare Pages Functions
 * Catch-all route handler for /api/* endpoints
 */

interface Env {
  DB: D1Database;
  AI: Ai;
}

// CORS headers for local development
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// JSON response helper
function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Error response helper
function error(message: string, status = 400) {
  return json({ error: message }, status);
}

// Route handlers
type Handler = (request: Request, env: Env, params: Record<string, string>) => Promise<Response>;

const routes: Record<string, Record<string, Handler>> = {
  // GET /api/recipes - List all recipes
  'GET /api/recipes': {
    handler: async (_request, env) => {
      const { results } = await env.DB.prepare(
        'SELECT * FROM recipes ORDER BY name ASC'
      ).all();
      return json(results);
    },
  },

  // GET /api/recipes/:id - Get single recipe
  'GET /api/recipes/:id': {
    handler: async (_request, env, params) => {
      const result = await env.DB.prepare(
        'SELECT * FROM recipes WHERE id = ?'
      ).bind(params.id).first();

      if (!result) {
        return error('Recipe not found', 404);
      }
      return json(result);
    },
  },

  // POST /api/recipes - Create recipe
  'POST /api/recipes': {
    handler: async (request, env) => {
      const body = await request.json() as Record<string, unknown>;
      const { name, description, ingredients, instructions, prep_time_mins, cook_time_mins, servings, tags, notes, image_url, source_url } = body;

      if (!name || !ingredients) {
        return error('Name and ingredients are required');
      }

      const result = await env.DB.prepare(`
        INSERT INTO recipes (name, description, ingredients, instructions, prep_time_mins, cook_time_mins, servings, tags, notes, image_url, source_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        name,
        description || null,
        typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients),
        instructions || null,
        prep_time_mins || null,
        cook_time_mins || null,
        servings || 4,
        typeof tags === 'string' ? tags : JSON.stringify(tags || []),
        notes || null,
        image_url || null,
        source_url || null
      ).run();

      return json({ id: result.meta.last_row_id, message: 'Recipe created' }, 201);
    },
  },

  // PUT /api/recipes/:id - Update recipe
  'PUT /api/recipes/:id': {
    handler: async (request, env, params) => {
      const body = await request.json() as Record<string, unknown>;
      const { name, description, ingredients, instructions, prep_time_mins, cook_time_mins, servings, tags, notes, rating, image_url, source_url } = body;

      const result = await env.DB.prepare(`
        UPDATE recipes SET
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          ingredients = COALESCE(?, ingredients),
          instructions = COALESCE(?, instructions),
          prep_time_mins = COALESCE(?, prep_time_mins),
          cook_time_mins = COALESCE(?, cook_time_mins),
          servings = COALESCE(?, servings),
          tags = COALESCE(?, tags),
          notes = COALESCE(?, notes),
          rating = COALESCE(?, rating),
          image_url = COALESCE(?, image_url),
          source_url = COALESCE(?, source_url),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        name || null,
        description || null,
        ingredients ? (typeof ingredients === 'string' ? ingredients : JSON.stringify(ingredients)) : null,
        instructions || null,
        prep_time_mins || null,
        cook_time_mins || null,
        servings || null,
        tags ? (typeof tags === 'string' ? tags : JSON.stringify(tags)) : null,
        notes || null,
        rating || null,
        image_url || null,
        source_url || null,
        params.id
      ).run();

      if (result.meta.changes === 0) {
        return error('Recipe not found', 404);
      }
      return json({ message: 'Recipe updated' });
    },
  },

  // DELETE /api/recipes/:id - Delete recipe
  'DELETE /api/recipes/:id': {
    handler: async (_request, env, params) => {
      const result = await env.DB.prepare(
        'DELETE FROM recipes WHERE id = ?'
      ).bind(params.id).run();

      if (result.meta.changes === 0) {
        return error('Recipe not found', 404);
      }
      return json({ message: 'Recipe deleted' });
    },
  },

  // GET /api/recipes/search - Search recipes
  'GET /api/recipes/search': {
    handler: async (request, env) => {
      const url = new URL(request.url);
      const query = url.searchParams.get('q') || '';
      const tag = url.searchParams.get('tag');

      let sql = 'SELECT * FROM recipes WHERE name LIKE ?';
      const bindings: string[] = [`%${query}%`];

      if (tag) {
        sql += ' AND tags LIKE ?';
        bindings.push(`%${tag}%`);
      }

      sql += ' ORDER BY name ASC';

      const { results } = await env.DB.prepare(sql).bind(...bindings).all();
      return json(results);
    },
  },

  // GET /api/meal-plan - Get week's meal plan
  'GET /api/meal-plan': {
    handler: async (request, env) => {
      const url = new URL(request.url);
      const week = url.searchParams.get('week'); // YYYY-MM-DD of week start

      let sql = `
        SELECT mp.*, r.name as recipe_name, r.prep_time_mins, r.cook_time_mins, r.tags, r.image_url
        FROM meal_plans mp
        LEFT JOIN recipes r ON mp.recipe_id = r.id
      `;

      if (week) {
        sql += ` WHERE mp.planned_date >= ? AND mp.planned_date < date(?, '+7 days')`;
        const { results } = await env.DB.prepare(sql).bind(week, week).all();
        return json(results);
      }

      sql += ' ORDER BY mp.planned_date ASC';
      const { results } = await env.DB.prepare(sql).all();
      return json(results);
    },
  },

  // POST /api/meal-plan - Add meal to plan
  'POST /api/meal-plan': {
    handler: async (request, env) => {
      const body = await request.json() as Record<string, unknown>;
      const { recipe_id, planned_date, meal_type } = body;

      if (!recipe_id || !planned_date) {
        return error('recipe_id and planned_date are required');
      }

      const result = await env.DB.prepare(`
        INSERT OR REPLACE INTO meal_plans (recipe_id, planned_date, meal_type)
        VALUES (?, ?, ?)
      `).bind(recipe_id, planned_date, meal_type || 'dinner').run();

      return json({ id: result.meta.last_row_id, message: 'Meal planned' }, 201);
    },
  },

  // DELETE /api/meal-plan/:id - Remove from plan
  'DELETE /api/meal-plan/:id': {
    handler: async (_request, env, params) => {
      const result = await env.DB.prepare(
        'DELETE FROM meal_plans WHERE id = ?'
      ).bind(params.id).run();

      if (result.meta.changes === 0) {
        return error('Meal plan not found', 404);
      }
      return json({ message: 'Meal removed from plan' });
    },
  },

  // GET /api/health - Health check
  'GET /api/health': {
    handler: async (_request, env) => {
      // Test DB connection
      const { results } = await env.DB.prepare('SELECT COUNT(*) as count FROM recipes').all();
      return json({
        status: 'healthy',
        database: 'connected',
        recipeCount: results[0]?.count || 0
      });
    },
  },

  // ============================================
  // PANTRY ENDPOINTS
  // ============================================

  // GET /api/pantry - List pantry items with filters
  'GET /api/pantry': {
    handler: async (request, env) => {
      const url = new URL(request.url);
      const category = url.searchParams.get('category');
      const low = url.searchParams.get('low');
      const expiring = url.searchParams.get('expiring'); // days
      const search = url.searchParams.get('search');

      let sql = 'SELECT * FROM pantry_items WHERE used_at IS NULL';
      const bindings: (string | number)[] = [];

      if (category) {
        sql += ' AND category = ?';
        bindings.push(category);
      }

      if (low === 'true') {
        sql += ' AND is_low = 1';
      }

      if (expiring) {
        sql += ' AND expiry_date IS NOT NULL AND expiry_date <= date("now", "+" || ? || " days")';
        bindings.push(parseInt(expiring));
      }

      if (search) {
        sql += ' AND name LIKE ?';
        bindings.push(`%${search}%`);
      }

      sql += ' ORDER BY category ASC, name ASC';

      const { results } = await env.DB.prepare(sql).bind(...bindings).all();
      return json(results);
    },
  },

  // POST /api/pantry - Add item to pantry
  'POST /api/pantry': {
    handler: async (request, env) => {
      const body = await request.json() as Record<string, unknown>;
      const { name, barcode, category, quantity, quantity_unit, expiry_date, image_url } = body;

      if (!name || !category) {
        return error('Name and category are required');
      }

      const validCategories = ['fridge', 'freezer', 'cupboard'];
      if (!validCategories.includes(category as string)) {
        return error('Category must be fridge, freezer, or cupboard');
      }

      const result = await env.DB.prepare(`
        INSERT INTO pantry_items (name, barcode, category, quantity, quantity_unit, expiry_date, image_url)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        name,
        barcode || null,
        category,
        quantity || '1',
        quantity_unit || null,
        expiry_date || null,
        image_url || null
      ).run();

      return json({ id: result.meta.last_row_id, message: 'Item added to pantry' }, 201);
    },
  },

  // GET /api/pantry/stats - Get pantry statistics (MUST be before :id route)
  'GET /api/pantry/stats': {
    handler: async (_request, env) => {
      const [categoryStats, lowCount, expiringCount] = await Promise.all([
        env.DB.prepare(`
          SELECT category, COUNT(*) as count
          FROM pantry_items
          WHERE used_at IS NULL
          GROUP BY category
        `).all(),
        env.DB.prepare(`
          SELECT COUNT(*) as count
          FROM pantry_items
          WHERE used_at IS NULL AND is_low = 1
        `).first(),
        env.DB.prepare(`
          SELECT COUNT(*) as count
          FROM pantry_items
          WHERE used_at IS NULL
            AND expiry_date IS NOT NULL
            AND expiry_date <= date('now', '+3 days')
        `).first(),
      ]);

      const categories: Record<string, number> = {};
      for (const row of categoryStats.results as { category: string; count: number }[]) {
        categories[row.category] = row.count;
      }

      return json({
        categories,
        total: Object.values(categories).reduce((a, b) => a + b, 0),
        low: (lowCount as { count: number })?.count || 0,
        expiring: (expiringCount as { count: number })?.count || 0,
      });
    },
  },

  // GET /api/pantry/:id - Get single pantry item
  'GET /api/pantry/:id': {
    handler: async (_request, env, params) => {
      const result = await env.DB.prepare(
        'SELECT * FROM pantry_items WHERE id = ?'
      ).bind(params.id).first();

      if (!result) {
        return error('Item not found', 404);
      }
      return json(result);
    },
  },

  // PUT /api/pantry/:id - Update pantry item
  'PUT /api/pantry/:id': {
    handler: async (request, env, params) => {
      const body = await request.json() as Record<string, unknown>;
      const { name, barcode, category, quantity, quantity_unit, expiry_date, is_low, image_url } = body;

      const result = await env.DB.prepare(`
        UPDATE pantry_items SET
          name = COALESCE(?, name),
          barcode = COALESCE(?, barcode),
          category = COALESCE(?, category),
          quantity = COALESCE(?, quantity),
          quantity_unit = COALESCE(?, quantity_unit),
          expiry_date = COALESCE(?, expiry_date),
          is_low = COALESCE(?, is_low),
          image_url = COALESCE(?, image_url),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).bind(
        name || null,
        barcode || null,
        category || null,
        quantity || null,
        quantity_unit || null,
        expiry_date || null,
        typeof is_low === 'number' ? is_low : null,
        image_url || null,
        params.id
      ).run();

      if (result.meta.changes === 0) {
        return error('Item not found', 404);
      }
      return json({ message: 'Item updated' });
    },
  },

  // DELETE /api/pantry/:id - Remove item from pantry
  'DELETE /api/pantry/:id': {
    handler: async (_request, env, params) => {
      const result = await env.DB.prepare(
        'DELETE FROM pantry_items WHERE id = ?'
      ).bind(params.id).run();

      if (result.meta.changes === 0) {
        return error('Item not found', 404);
      }
      return json({ message: 'Item removed from pantry' });
    },
  },

  // PATCH /api/pantry/:id/decrement - Decrease quantity by 1
  'PATCH /api/pantry/:id/decrement': {
    handler: async (_request, env, params) => {
      // Get current quantity
      const item = await env.DB.prepare(
        'SELECT quantity FROM pantry_items WHERE id = ?'
      ).bind(params.id).first() as { quantity: string } | null;

      if (!item) {
        return error('Item not found', 404);
      }

      const currentQty = parseInt(item.quantity) || 1;
      const newQty = Math.max(0, currentQty - 1);

      if (newQty === 0) {
        // Mark as used instead of deleting
        await env.DB.prepare(
          'UPDATE pantry_items SET quantity = "0", used_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
        ).bind(params.id).run();
        return json({ quantity: 0, message: 'Item marked as used' });
      }

      await env.DB.prepare(
        'UPDATE pantry_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(String(newQty), params.id).run();

      return json({ quantity: newQty, message: 'Quantity decreased' });
    },
  },

  // PATCH /api/pantry/:id/increment - Increase quantity by 1
  'PATCH /api/pantry/:id/increment': {
    handler: async (_request, env, params) => {
      const item = await env.DB.prepare(
        'SELECT quantity FROM pantry_items WHERE id = ?'
      ).bind(params.id).first() as { quantity: string } | null;

      if (!item) {
        return error('Item not found', 404);
      }

      const currentQty = parseInt(item.quantity) || 1;
      const newQty = currentQty + 1;

      await env.DB.prepare(
        'UPDATE pantry_items SET quantity = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(String(newQty), params.id).run();

      return json({ quantity: newQty, message: 'Quantity increased' });
    },
  },

  // PATCH /api/pantry/:id/toggle-low - Toggle is_low flag
  'PATCH /api/pantry/:id/toggle-low': {
    handler: async (_request, env, params) => {
      const item = await env.DB.prepare(
        'SELECT is_low FROM pantry_items WHERE id = ?'
      ).bind(params.id).first() as { is_low: number } | null;

      if (!item) {
        return error('Item not found', 404);
      }

      const newValue = item.is_low ? 0 : 1;

      await env.DB.prepare(
        'UPDATE pantry_items SET is_low = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
      ).bind(newValue, params.id).run();

      return json({ is_low: newValue === 1, message: newValue ? 'Marked as low' : 'Unmarked as low' });
    },
  },

  // POST /api/pantry/barcode/:code - Lookup barcode via Open Food Facts
  'POST /api/pantry/barcode/:code': {
    handler: async (_request, _env, params) => {
      const barcode = params.code;

      try {
        const response = await fetch(
          `https://world.openfoodfacts.org/api/v2/product/${barcode}`,
          {
            headers: {
              'User-Agent': 'FiveThirty/1.0 (meal-planning-app)',
            },
          }
        );

        if (!response.ok) {
          return json({ found: false, barcode });
        }

        const data = await response.json() as {
          status: number;
          product?: {
            product_name?: string;
            brands?: string;
            image_url?: string;
            image_front_url?: string;
            quantity?: string;
          };
        };

        if (data.status !== 1 || !data.product) {
          return json({ found: false, barcode });
        }

        const product = data.product;
        return json({
          found: true,
          barcode,
          name: product.product_name || 'Unknown Product',
          brand: product.brands || null,
          image_url: product.image_front_url || product.image_url || null,
          quantity_info: product.quantity || null,
        });
      } catch (err) {
        console.error('Open Food Facts error:', err);
        return json({ found: false, barcode, error: 'Failed to lookup barcode' });
      }
    },
  },

  // ============================================
  // SHOPPING LIST ENDPOINTS
  // ============================================

  // GET /api/shopping-lists - Get active shopping list (create if none exists)
  'GET /api/shopping-lists': {
    handler: async (_request, env) => {
      // Get active list
      let list = await env.DB.prepare(
        `SELECT * FROM shopping_lists WHERE status = 'active' ORDER BY created_at DESC LIMIT 1`
      ).first();

      // Create one if none exists
      if (!list) {
        const result = await env.DB.prepare(
          `INSERT INTO shopping_lists (name, status) VALUES ('Weekly Shop', 'active')`
        ).run();
        list = await env.DB.prepare(
          `SELECT * FROM shopping_lists WHERE id = ?`
        ).bind(result.meta.last_row_id).first();
      }

      return json(list);
    },
  },

  // POST /api/shopping-lists - Create new shopping list
  'POST /api/shopping-lists': {
    handler: async (request, env) => {
      const body = await request.json() as Record<string, unknown>;
      const name = (body.name as string) || 'Weekly Shop';

      // Mark any existing active lists as completed
      await env.DB.prepare(
        `UPDATE shopping_lists SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE status = 'active'`
      ).run();

      const result = await env.DB.prepare(
        `INSERT INTO shopping_lists (name, status) VALUES (?, 'active')`
      ).bind(name).run();

      return json({ id: result.meta.last_row_id, message: 'Shopping list created' }, 201);
    },
  },

  // GET /api/shopping-lists/:id - Get list with items
  'GET /api/shopping-lists/:id': {
    handler: async (_request, env, params) => {
      const list = await env.DB.prepare(
        `SELECT * FROM shopping_lists WHERE id = ?`
      ).bind(params.id).first();

      if (!list) {
        return error('Shopping list not found', 404);
      }

      const { results: items } = await env.DB.prepare(
        `SELECT * FROM shopping_items WHERE list_id = ? ORDER BY category ASC, name ASC`
      ).bind(params.id).all();

      return json({ ...list, items });
    },
  },

  // PUT /api/shopping-lists/:id - Update list (name, status)
  'PUT /api/shopping-lists/:id': {
    handler: async (request, env, params) => {
      const body = await request.json() as Record<string, unknown>;
      const { name, status } = body;

      let sql = 'UPDATE shopping_lists SET ';
      const updates: string[] = [];
      const bindings: (string | number)[] = [];

      if (name) {
        updates.push('name = ?');
        bindings.push(name as string);
      }
      if (status) {
        updates.push('status = ?');
        bindings.push(status as string);
        if (status === 'completed') {
          updates.push('completed_at = CURRENT_TIMESTAMP');
        }
      }

      if (updates.length === 0) {
        return error('No fields to update');
      }

      sql += updates.join(', ') + ' WHERE id = ?';
      bindings.push(parseInt(params.id));

      const result = await env.DB.prepare(sql).bind(...bindings).run();

      if (result.meta.changes === 0) {
        return error('Shopping list not found', 404);
      }
      return json({ message: 'Shopping list updated' });
    },
  },

  // GET /api/shopping-items - Get items for a list
  'GET /api/shopping-items': {
    handler: async (request, env) => {
      const url = new URL(request.url);
      const listId = url.searchParams.get('list_id');

      if (!listId) {
        return error('list_id is required');
      }

      const { results } = await env.DB.prepare(
        `SELECT * FROM shopping_items WHERE list_id = ? ORDER BY category ASC, checked ASC, name ASC`
      ).bind(listId).all();

      return json(results);
    },
  },

  // POST /api/shopping-items - Add item to list
  'POST /api/shopping-items': {
    handler: async (request, env) => {
      const body = await request.json() as Record<string, unknown>;
      const { list_id, name, quantity, category, source, barcode } = body;

      if (!list_id || !name) {
        return error('list_id and name are required');
      }

      const result = await env.DB.prepare(`
        INSERT INTO shopping_items (list_id, name, quantity, category, source, barcode, scanned_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).bind(
        list_id,
        name,
        quantity || null,
        category || 'other',
        source || 'manual',
        barcode || null,
        barcode ? new Date().toISOString() : null
      ).run();

      return json({ id: result.meta.last_row_id, message: 'Item added' }, 201);
    },
  },

  // PUT /api/shopping-items/:id - Update item
  'PUT /api/shopping-items/:id': {
    handler: async (request, env, params) => {
      const body = await request.json() as Record<string, unknown>;
      const { name, quantity, category } = body;

      const result = await env.DB.prepare(`
        UPDATE shopping_items SET
          name = COALESCE(?, name),
          quantity = COALESCE(?, quantity),
          category = COALESCE(?, category)
        WHERE id = ?
      `).bind(
        name || null,
        quantity || null,
        category || null,
        params.id
      ).run();

      if (result.meta.changes === 0) {
        return error('Item not found', 404);
      }
      return json({ message: 'Item updated' });
    },
  },

  // DELETE /api/shopping-items/:id - Remove item
  'DELETE /api/shopping-items/:id': {
    handler: async (_request, env, params) => {
      const result = await env.DB.prepare(
        'DELETE FROM shopping_items WHERE id = ?'
      ).bind(params.id).run();

      if (result.meta.changes === 0) {
        return error('Item not found', 404);
      }
      return json({ message: 'Item removed' });
    },
  },

  // PATCH /api/shopping-items/:id/check - Toggle checked status
  'PATCH /api/shopping-items/:id/check': {
    handler: async (_request, env, params) => {
      const item = await env.DB.prepare(
        'SELECT checked FROM shopping_items WHERE id = ?'
      ).bind(params.id).first() as { checked: number } | null;

      if (!item) {
        return error('Item not found', 404);
      }

      const newValue = item.checked ? 0 : 1;

      await env.DB.prepare(
        'UPDATE shopping_items SET checked = ? WHERE id = ?'
      ).bind(newValue, params.id).run();

      return json({ checked: newValue === 1, message: newValue ? 'Item checked' : 'Item unchecked' });
    },
  },

  // DELETE /api/shopping-items/checked - Remove all checked items from a list
  'DELETE /api/shopping-items/checked': {
    handler: async (request, env) => {
      const url = new URL(request.url);
      const listId = url.searchParams.get('list_id');

      if (!listId) {
        return error('list_id is required');
      }

      const result = await env.DB.prepare(
        'DELETE FROM shopping_items WHERE list_id = ? AND checked = 1'
      ).bind(listId).run();

      return json({ removed: result.meta.changes, message: 'Checked items removed' });
    },
  },

  // POST /api/shopping-lists/generate - Generate from meal plan
  'POST /api/shopping-lists/generate': {
    handler: async (request, env) => {
      const body = await request.json() as Record<string, unknown>;
      const weekStart = body.week_start as string; // YYYY-MM-DD

      if (!weekStart) {
        return error('week_start is required (YYYY-MM-DD format)');
      }

      // Get or create active shopping list
      let list = await env.DB.prepare(
        `SELECT * FROM shopping_lists WHERE status = 'active' ORDER BY created_at DESC LIMIT 1`
      ).first() as { id: number } | null;

      if (!list) {
        const result = await env.DB.prepare(
          `INSERT INTO shopping_lists (name, status) VALUES ('Weekly Shop', 'active')`
        ).run();
        list = { id: result.meta.last_row_id as number };
      }

      // Get all recipes planned for the week
      const { results: mealPlans } = await env.DB.prepare(`
        SELECT r.ingredients
        FROM meal_plans mp
        JOIN recipes r ON mp.recipe_id = r.id
        WHERE mp.planned_date >= ? AND mp.planned_date < date(?, '+7 days')
      `).bind(weekStart, weekStart).all() as { results: { ingredients: string }[] };

      if (mealPlans.length === 0) {
        return json({
          list_id: list.id,
          items_added: 0,
          message: 'No meals planned for this week'
        });
      }

      // Aggregate all ingredients
      const ingredientMap = new Map<string, { quantity: string; category: string }>();

      // Category mapping for common ingredients
      const categorizeIngredient = (name: string): string => {
        const lower = name.toLowerCase();
        if (/milk|cheese|butter|cream|yogurt|yoghurt/.test(lower)) return 'dairy';
        if (/chicken|beef|pork|lamb|salmon|fish|bacon|sausage|mince/.test(lower)) return 'meat';
        if (/tomato|onion|pepper|lettuce|spinach|carrot|potato|garlic|mushroom|courgette|broccoli|cucumber/.test(lower)) return 'veg';
        if (/apple|banana|orange|lemon|lime|berry|fruit/.test(lower)) return 'fruit';
        if (/bread|roll|bun|croissant|bagel/.test(lower)) return 'bakery';
        if (/ice cream|frozen|pizza/.test(lower)) return 'frozen';
        if (/pasta|rice|tinned|canned|flour|sugar|spice|oil|vinegar|sauce|stock/.test(lower)) return 'cupboard';
        return 'other';
      };

      for (const meal of mealPlans) {
        try {
          const ingredients: string[] = JSON.parse(meal.ingredients);
          for (const ing of ingredients) {
            // Use the ingredient name as key (normalized)
            const key = ing.toLowerCase().trim();
            if (!ingredientMap.has(key)) {
              ingredientMap.set(key, {
                quantity: '', // Could parse quantity from ingredient string
                category: categorizeIngredient(ing),
              });
            }
          }
        } catch {
          // Skip invalid JSON
        }
      }

      // Get pantry items to subtract
      const { results: pantryItems } = await env.DB.prepare(`
        SELECT LOWER(name) as name FROM pantry_items
        WHERE used_at IS NULL AND (is_low = 0 OR is_low IS NULL)
      `).all() as { results: { name: string }[] };

      const pantrySet = new Set(pantryItems.map(p => p.name.toLowerCase().trim()));

      // Remove items we already have in pantry
      for (const pantryName of pantrySet) {
        // Check for partial matches (e.g., "milk" matches "2L milk")
        for (const [key] of ingredientMap) {
          if (key.includes(pantryName) || pantryName.includes(key)) {
            ingredientMap.delete(key);
          }
        }
      }

      // Insert items into shopping list
      let itemsAdded = 0;
      for (const [name, details] of ingredientMap) {
        // Capitalize first letter
        const displayName = name.charAt(0).toUpperCase() + name.slice(1);

        await env.DB.prepare(`
          INSERT INTO shopping_items (list_id, name, quantity, category, source)
          VALUES (?, ?, ?, ?, 'auto')
        `).bind(
          list.id,
          displayName,
          details.quantity || null,
          details.category
        ).run();
        itemsAdded++;
      }

      return json({
        list_id: list.id,
        items_added: itemsAdded,
        pantry_items_subtracted: pantryItems.length,
        message: `Generated shopping list with ${itemsAdded} items`
      });
    },
  },
};

// Route matcher
function matchRoute(method: string, path: string): { handler: Handler; params: Record<string, string> } | null {
  for (const [routeKey, route] of Object.entries(routes)) {
    const [routeMethod, routePath] = routeKey.split(' ');
    if (method !== routeMethod) continue;

    // Convert route pattern to regex
    const paramNames: string[] = [];
    const regexPattern = routePath.replace(/:(\w+)/g, (_, paramName) => {
      paramNames.push(paramName);
      return '([^/]+)';
    });

    const regex = new RegExp(`^${regexPattern}$`);
    const match = path.match(regex);

    if (match) {
      const params: Record<string, string> = {};
      paramNames.forEach((name, index) => {
        params[name] = match[index + 1];
      });
      return { handler: route.handler, params };
    }
  }
  return null;
}

// Main handler
export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const method = request.method;
  const path = url.pathname;

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Match route
  const matched = matchRoute(method, path);

  if (!matched) {
    return error('Not found', 404);
  }

  try {
    return await matched.handler(request, env, matched.params);
  } catch (err) {
    console.error('API Error:', err);
    return error('Internal server error', 500);
  }
};
