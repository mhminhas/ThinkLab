import {
  users,
  projects,
  tasks,
  aiToolUsage,
  marketplaceItems,
  purchases,
  notifications,
  apiKeys,
  projectMembers,
  type User,
  type UpsertUser,
  type Project,
  type InsertProject,
  type Task,
  type InsertTask,
  type AiToolUsage,
  type InsertAiToolUsage,
  type MarketplaceItem,
  type InsertMarketplaceItem,
  type Notification,
  type InsertNotification,
  type ApiKey,
  type InsertApiKey,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserCredits(userId: string, credits: number): Promise<void>;
  updateUserSubscription(userId: string, plan: string): Promise<void>;
  
  // Project operations
  getProjects(userId: string): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, updates: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;
  
  // Task operations
  getProjectTasks(projectId: string): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  
  // AI Tool usage
  createAiToolUsage(usage: InsertAiToolUsage): Promise<AiToolUsage>;
  getUserAiToolUsage(userId: string, limit?: number): Promise<AiToolUsage[]>;
  
  // Marketplace operations
  getMarketplaceItems(limit?: number, category?: string): Promise<MarketplaceItem[]>;
  getMarketplaceItem(id: string): Promise<MarketplaceItem | undefined>;
  createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem>;
  purchaseMarketplaceItem(userId: string, itemId: string, price: number): Promise<void>;
  
  // Notifications
  getUserNotifications(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: string): Promise<void>;
  
  // API Keys
  getUserApiKeys(userId: string): Promise<ApiKey[]>;
  createApiKey(apiKey: InsertApiKey): Promise<ApiKey>;
  deactivateApiKey(id: string): Promise<void>;
  
  // Analytics
  getAnalytics(): Promise<{
    totalUsers: number;
    activeProjects: number;
    totalRevenue: number;
    apiCalls: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserCredits(userId: string, credits: number): Promise<void> {
    await db
      .update(users)
      .set({ credits, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  async updateUserSubscription(userId: string, plan: string): Promise<void> {
    await db
      .update(users)
      .set({ subscriptionPlan: plan, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }

  // Project operations
  async getProjects(userId: string): Promise<Project[]> {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.ownerId, userId))
      .orderBy(desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(projectData).returning();
    return project;
  }

  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const [project] = await db
      .update(projects)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // Task operations
  async getProjectTasks(projectId: string): Promise<Task[]> {
    return await db
      .select()
      .from(tasks)
      .where(eq(tasks.projectId, projectId))
      .orderBy(desc(tasks.createdAt));
  }

  async createTask(taskData: InsertTask): Promise<Task> {
    const [task] = await db.insert(tasks).values(taskData).returning();
    return task;
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const [task] = await db
      .update(tasks)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(tasks.id, id))
      .returning();
    return task;
  }

  async deleteTask(id: string): Promise<void> {
    await db.delete(tasks).where(eq(tasks.id, id));
  }

  // AI Tool usage
  async createAiToolUsage(usageData: InsertAiToolUsage): Promise<AiToolUsage> {
    const [usage] = await db.insert(aiToolUsage).values(usageData).returning();
    return usage;
  }

  async getUserAiToolUsage(userId: string, limit: number = 50): Promise<AiToolUsage[]> {
    return await db
      .select()
      .from(aiToolUsage)
      .where(eq(aiToolUsage.userId, userId))
      .orderBy(desc(aiToolUsage.createdAt))
      .limit(limit);
  }

  // Marketplace operations
  async getMarketplaceItems(limit: number = 20, category?: string): Promise<MarketplaceItem[]> {
    if (category) {
      return await db
        .select()
        .from(marketplaceItems)
        .where(and(eq(marketplaceItems.isActive, true), eq(marketplaceItems.category, category)))
        .orderBy(desc(marketplaceItems.createdAt))
        .limit(limit);
    }

    return await db
      .select()
      .from(marketplaceItems)
      .where(eq(marketplaceItems.isActive, true))
      .orderBy(desc(marketplaceItems.createdAt))
      .limit(limit);
  }

  async getMarketplaceItem(id: string): Promise<MarketplaceItem | undefined> {
    const [item] = await db
      .select()
      .from(marketplaceItems)
      .where(eq(marketplaceItems.id, id));
    return item;
  }

  async createMarketplaceItem(itemData: InsertMarketplaceItem): Promise<MarketplaceItem> {
    const [item] = await db.insert(marketplaceItems).values(itemData).returning();
    return item;
  }

  async purchaseMarketplaceItem(userId: string, itemId: string, price: number): Promise<void> {
    await db.transaction(async (tx) => {
      // Create purchase record
      await tx.insert(purchases).values({
        userId,
        itemId,
        price: price.toString(),
      });

      // Update download count
      await tx
        .update(marketplaceItems)
        .set({
          downloads: sql`${marketplaceItems.downloads} + 1`,
        })
        .where(eq(marketplaceItems.id, itemId));
    });
  }

  // Notifications
  async getUserNotifications(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const [notification] = await db
      .insert(notifications)
      .values(notificationData)
      .returning();
    return notification;
  }

  async markNotificationRead(id: string): Promise<void> {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, id));
  }

  // API Keys
  async getUserApiKeys(userId: string): Promise<ApiKey[]> {
    return await db
      .select()
      .from(apiKeys)
      .where(and(eq(apiKeys.userId, userId), eq(apiKeys.isActive, true)))
      .orderBy(desc(apiKeys.createdAt));
  }

  async createApiKey(apiKeyData: InsertApiKey): Promise<ApiKey> {
    const [apiKey] = await db.insert(apiKeys).values(apiKeyData).returning();
    return apiKey;
  }

  async deactivateApiKey(id: string): Promise<void> {
    await db
      .update(apiKeys)
      .set({ isActive: false })
      .where(eq(apiKeys.id, id));
  }

  // Analytics
  async getAnalytics(): Promise<{
    totalUsers: number;
    activeProjects: number;
    totalRevenue: number;
    apiCalls: number;
  }> {
    const [totalUsersResult] = await db.select({ count: count() }).from(users);
    const [activeProjectsResult] = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.status, "active"));
    
    const [totalRevenueResult] = await db
      .select({ total: sql<number>`COALESCE(SUM(${purchases.price}::numeric), 0)` })
      .from(purchases);
    
    const [apiCallsResult] = await db.select({ count: count() }).from(aiToolUsage);

    return {
      totalUsers: totalUsersResult.count,
      activeProjects: activeProjectsResult.count,
      totalRevenue: Number(totalRevenueResult.total) || 0,
      apiCalls: apiCallsResult.count,
    };
  }
}

export const storage = new DatabaseStorage();