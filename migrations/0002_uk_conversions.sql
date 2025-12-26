-- Five Thirty Database Schema
-- Migration 2: UK Measurement conversions seed data

-- Pre-populate UK measurement conversions
INSERT OR IGNORE INTO measurement_conversions (us_term, uk_term, category, notes) VALUES
-- Volume conversions
('1 cup flour', '125g', 'volume', 'All-purpose/plain flour'),
('1 cup sugar', '200g', 'volume', 'Granulated'),
('1 cup brown sugar', '220g', 'volume', 'Packed'),
('1 cup butter', '225g', 'volume', '2 sticks'),
('1 cup milk', '240ml', 'volume', NULL),
('1 cup water', '240ml', 'volume', NULL),
('1 cup cream', '240ml', 'volume', NULL),
('1 cup rice', '185g', 'volume', 'Uncooked'),
('1 cup oats', '90g', 'volume', 'Rolled oats'),

-- Weight conversions
('1 stick butter', '113g', 'weight', NULL),
('1 lb', '450g', 'weight', NULL),
('1 oz', '28g', 'weight', NULL),

-- Temperature conversions
('300°F', '150°C', 'temperature', 'Fan 130°C'),
('325°F', '160°C', 'temperature', 'Fan 140°C'),
('350°F', '180°C', 'temperature', 'Fan 160°C'),
('375°F', '190°C', 'temperature', 'Fan 170°C'),
('400°F', '200°C', 'temperature', 'Fan 180°C'),
('425°F', '220°C', 'temperature', 'Fan 200°C'),
('450°F', '230°C', 'temperature', 'Fan 210°C'),
('475°F', '240°C', 'temperature', 'Fan 220°C'),

-- Ingredient name swaps
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
('ground lamb', 'lamb mince', 'ingredient', NULL),
('ground turkey', 'turkey mince', 'ingredient', NULL),
('shrimp', 'prawns', 'ingredient', NULL),
('arugula', 'rocket', 'ingredient', NULL),
('romaine', 'cos lettuce', 'ingredient', NULL),
('semisweet chocolate', 'dark chocolate', 'ingredient', NULL),
('bittersweet chocolate', 'dark chocolate', 'ingredient', '70% cocoa'),
('baking soda', 'bicarbonate of soda', 'ingredient', NULL),
('cookie', 'biscuit', 'ingredient', NULL),
('jello', 'jelly', 'ingredient', NULL),
('jelly', 'jam', 'ingredient', NULL),
('plastic wrap', 'cling film', 'ingredient', NULL),
('skillet', 'frying pan', 'ingredient', 'equipment'),
('broiler', 'grill', 'ingredient', 'equipment'),
('stove', 'hob', 'ingredient', 'equipment'),
('counter', 'worktop', 'ingredient', 'equipment');
