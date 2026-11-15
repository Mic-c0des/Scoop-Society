
import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// BETTER AUTH USERS
// Better Auth manages authentication using these fields.
// pointsBalance and isAdmin are Scoop Society additions.
export const users = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),

  pointsBalance: integer("points_balance").notNull().default(0),
  isAdmin: boolean("is_admin").notNull().default(false),
});

// BETTER AUTH SESSIONS
export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => users.id, {
    onDelete: "cascade",
  }),
}, (table) => [
  index("session_user_id_idx").on(table.userId),
]);

// BETTER AUTH ACCOUNTS
export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => users.id, {
    onDelete: "cascade",
  }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("account_user_id_idx").on(table.userId),
]);

// BETTER AUTH VERIFICATION
export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ICE CREAM FLAVORS
export const flavors = pgTable("flavors", {
  id: text("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  priceCents: integer("price_cents").notNull(),
  imageUrl: text("image_url"),
  isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ORDERS
// userId is nullable so guests can checkout.
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("user_id").references(() => users.id, {
    onDelete: "set null",
  }),

  email: varchar("email", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 100 }).notNull(),

  subtotalCents: integer("subtotal_cents").notNull(),
  discountCents: integer("discount_cents").notNull().default(0),
  totalCents: integer("total_cents").notNull(),

  pointsEarned: integer("points_earned").notNull().default(0),
  pointsRedeemed: integer("points_redeemed").notNull().default(0),

  paymentMethod: varchar("payment_method", { length: 20 }).notNull(),
  paymentStatus: varchar("payment_status", { length: 20 })
    .notNull().default("pending"),

  status: varchar("status", { length: 20 })
    .notNull().default("pending"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("orders_user_id_idx").on(table.userId),
  index("orders_created_at_idx").on(table.createdAt),
]);

// ITEMS WITHIN EACH ORDER
export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("order_id").notNull().references(() => orders.id, {
    onDelete: "cascade",
  }),
  flavorId: text("flavor_id").references(() => flavors.id, {
    onDelete: "set null",
  }),

  // Snapshots preserve historical names and prices.
  flavorName: varchar("flavor_name", { length: 100 }).notNull(),
  unitPriceCents: integer("unit_price_cents").notNull(),
  quantity: integer("quantity").notNull(),
}, (table) => [
  index("order_items_order_id_idx").on(table.orderId),
]);

// LOYALTY POINT HISTORY
export const pointTransactions = pgTable("point_transactions", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, {
    onDelete: "cascade",
  }),
  orderId: text("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),

  // Positive = earned, negative = redeemed.
  points: integer("points").notNull(),
  reason: varchar("reason", { length: 30 }).notNull(),

  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("point_transactions_user_id_idx").on(table.userId),
]);
