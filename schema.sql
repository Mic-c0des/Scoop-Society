-- Re-running this file wipes both tables. Fine while developing;
-- switch to numbered migrations once you have real orders.
DROP TABLE IF EXISTS flavors;
DROP TABLE IF EXISTS orders;

CREATE TABLE flavors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  available INTEGER NOT NULL DEFAULT 1   -- 1 = on the menu, 0 = hidden
);

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  email TEXT NOT NULL,
  items TEXT NOT NULL,                   -- JSON: [{id, name, qty, price_cents}]
  total_cents INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',    -- new, preparing, ready, picked_up, cancelled
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_orders_email ON orders (email);
CREATE INDEX idx_orders_status ON orders (status);

INSERT INTO flavors (name, description, price_cents) VALUES
  ('Vanilla', 'Classic vanilla ice cream.', 500),
  ('Coffee', 'Coffee ice cream.', 500),
  ('S''mores', 'Marshmallow ice cream with graham cracker and chocolate pieces.', 550),
  ('Peanut Butter Cookie', 'Peanut butter ice cream with cookie pieces.', 550),
  ('Chocolate Brownie', 'Chocolate ice cream with brownie chunks.', 550),
  ('Key Lime Pie', 'Key lime ice cream with graham cracker crust pieces.', 550),
  ('Lemon', 'Tart and creamy lemon ice cream.', 500);