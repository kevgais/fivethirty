-- Five Thirty Database Schema
-- Migration 3: Seed family starter recipes

INSERT OR IGNORE INTO recipes (name, ingredients, prep_time_mins, cook_time_mins, servings, tags, notes) VALUES
('Curry',
 '["chicken breast", "onion", "curry paste", "coconut milk", "rice", "garlic", "ginger"]',
 15, 30, 4,
 '["kid-friendly-version-available"]',
 'Make mild for Oscar - use korma paste'),

('Spicy Mince',
 '["beef mince", "onion", "taco seasoning", "peppers", "taco shells", "cheese", "soured cream"]',
 10, 20, 4,
 '["spicy"]',
 'Oscar prefers plain mince without seasoning'),

('Spag Bol',
 '["spaghetti", "beef mince", "tinned tomatoes", "onion", "garlic", "carrots", "celery", "parmesan"]',
 15, 30, 4,
 '["kid-friendly", "freezer-friendly"]',
 'Family favourite - Oscar asks for seconds'),

('Stir Fry',
 '["egg noodles", "mixed vegetables", "soy sauce", "chicken breast", "sesame oil", "ginger"]',
 10, 15, 4,
 '["quick", "kid-friendly"]',
 NULL),

('Fish Fingers & Chips',
 '["fish fingers", "oven chips", "peas", "ketchup"]',
 5, 25, 4,
 '["quick", "kid-friendly"]',
 'Easy Friday night - kids love it'),

('Chilli Con Carne',
 '["beef mince", "kidney beans", "tinned tomatoes", "chilli powder", "cumin", "rice", "soured cream"]',
 15, 45, 4,
 '["spicy", "freezer-friendly"]',
 'Too spicy for Oscar - make separate portion'),

('Shepherds Pie',
 '["lamb mince", "potatoes", "carrots", "onion", "gravy granules", "peas", "butter"]',
 20, 40, 4,
 '["kid-friendly", "freezer-friendly"]',
 'Comfort food classic - Bobby loves the crispy top'),

('Pasta Bake',
 '["penne pasta", "cheddar cheese", "tinned tomatoes", "bacon", "cream", "garlic"]',
 15, 30, 4,
 '["kid-friendly"]',
 'Easy midweek winner'),

('Fajitas',
 '["chicken breast", "peppers", "onion", "tortilla wraps", "salsa", "guacamole", "cheese"]',
 15, 15, 4,
 '["quick", "kid-friendly"]',
 'Build your own - everyone happy'),

('Roast Chicken',
 '["whole chicken", "potatoes", "carrots", "onion", "gravy granules", "stuffing"]',
 20, 90, 4,
 '["weekend"]',
 'Sunday special - leftovers for Monday sandwiches');
