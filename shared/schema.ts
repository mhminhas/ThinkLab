import { sql } from 'drizzle-orm';
import { relations } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  uuid,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("user").notNull(), // user, admin, manager
  credits: integer("credits").default(10).notNull(),
  subscriptionPlan: varchar("subscription_plan").default("free").notNull(), // free, starter, pro, team, enterprise
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  emailVerified: boolean("email_verified").default(false).notNull(),
  phoneNumber: varchar("phone_number"),
  phoneVerified: boolean("phone_verified").default(false).notNull(),
  twoFactorEnabled: boolean("two_factor_enabled").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectStatusEnum = pgEnum('project_status', ['active', 'completed', 'archived', 'draft']);

export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  ownerId: varchar("owner_id").references(() => users.id).notNull(),
  status: projectStatusEnum("status").default("active").notNull(),
  tags: text("tags").array(),
  settings: jsonb("settings").default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const projectMembers = pgTable("project_members", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: varchar("role").default("member").notNull(), // owner, admin, member, viewer
  addedAt: timestamp("added_at").defaultNow(),
});

export const taskStatusEnum = pgEnum('task_status', ['todo', 'in_progress', 'review', 'done']);

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("todo").notNull(),
  assigneeId: varchar("assignee_id").references(() => users.id),
  priority: integer("priority").default(1).notNull(),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiToolTypeEnum = pgEnum('ai_tool_type', ['text_generation', 'image_generation', 'code_generation', 'data_analysis', 'seo_optimization', 'text_summarization']);

export const aiToolUsage = pgTable("ai_tool_usage", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  projectId: uuid("project_id").references(() => projects.id),
  toolType: aiToolTypeEnum("tool_type").notNull(),
  creditsUsed: integer("credits_used").notNull(),
  input: text("input"),
  output: text("output"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketplaceItems = pgTable("marketplace_items", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: varchar("category").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  authorId: varchar("author_id").references(() => users.id).notNull(),
  imageUrl: varchar("image_url"),
  tags: text("tags").array(),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  downloads: integer("downloads").default(0),
  isActive: boolean("is_active").default(true).notNull(),
  templateData: jsonb("template_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const purchases = pgTable("purchases", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  itemId: uuid("item_id").references(() => marketplaceItems.id).notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stripePaymentId: varchar("stripe_payment_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(), // info, success, warning, error
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  keyHash: varchar("key_hash").notNull(),
  lastUsed: timestamp("last_used"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects),
  projectMembers: many(projectMembers),
  aiToolUsage: many(aiToolUsage),
  marketplaceItems: many(marketplaceItems),
  purchases: many(purchases),
  notifications: many(notifications),
  apiKeys: many(apiKeys),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
  members: many(projectMembers),
  tasks: many(tasks),
  aiToolUsage: many(aiToolUsage),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
  project: one(projects, {
    fields: [projectMembers.projectId],
    references: [projects.id],
  }),
  user: one(users, {
    fields: [projectMembers.userId],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [tasks.assigneeId],
    references: [users.id],
  }),
}));

export const aiToolUsageRelations = relations(aiToolUsage, ({ one }) => ({
  user: one(users, {
    fields: [aiToolUsage.userId],
    references: [users.id],
  }),
  project: one(projects, {
    fields: [aiToolUsage.projectId],
    references: [projects.id],
  }),
}));

export const marketplaceItemsRelations = relations(marketplaceItems, ({ one, many }) => ({
  author: one(users, {
    fields: [marketplaceItems.authorId],
    references: [users.id],
  }),
  purchases: many(purchases),
}));

export const purchasesRelations = relations(purchases, ({ one }) => ({
  user: one(users, {
    fields: [purchases.userId],
    references: [users.id],
  }),
  item: one(marketplaceItems, {
    fields: [purchases.itemId],
    references: [marketplaceItems.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const apiKeysRelations = relations(apiKeys, ({ one }) => ({
  user: one(users, {
    fields: [apiKeys.userId],
    references: [users.id],
  }),
}));

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export type InsertProject = typeof projects.$inferInsert;
export type Project = typeof projects.$inferSelect;

export type InsertTask = typeof tasks.$inferInsert;
export type Task = typeof tasks.$inferSelect;

export type InsertAiToolUsage = typeof aiToolUsage.$inferInsert;
export type AiToolUsage = typeof aiToolUsage.$inferSelect;

export type InsertMarketplaceItem = typeof marketplaceItems.$inferInsert;
export type MarketplaceItem = typeof marketplaceItems.$inferSelect;

export type InsertNotification = typeof notifications.$inferInsert;
export type Notification = typeof notifications.$inferSelect;

export type InsertApiKey = typeof apiKeys.$inferInsert;
export type ApiKey = typeof apiKeys.$inferSelect;

// Zod schemas
export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMarketplaceItemSchema = createInsertSchema(marketplaceItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});
