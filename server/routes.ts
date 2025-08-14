import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertProjectSchema, insertTaskSchema, insertMarketplaceItemSchema, insertNotificationSchema } from "@shared/schema";
import { aiService } from "./services/aiService";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Project routes
  app.get('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const projects = await storage.getProjects(userId);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post('/api/projects', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        ownerId: userId,
      });
      
      const project = await storage.createProject(validatedData);
      res.json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });

  app.get('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.put('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      const updates = req.body;
      const project = await storage.updateProject(req.params.id, updates);
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  app.delete('/api/projects/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteProject(req.params.id);
      res.json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });

  // Task routes
  app.get('/api/projects/:projectId/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const tasks = await storage.getProjectTasks(req.params.projectId);
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ message: "Failed to fetch tasks" });
    }
  });

  app.post('/api/projects/:projectId/tasks', isAuthenticated, async (req: any, res) => {
    try {
      const validatedData = insertTaskSchema.parse({
        ...req.body,
        projectId: req.params.projectId,
      });
      
      const task = await storage.createTask(validatedData);
      res.json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ message: "Failed to create task" });
    }
  });

  app.put('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      const updates = req.body;
      const task = await storage.updateTask(req.params.id, updates);
      res.json(task);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ message: "Failed to update task" });
    }
  });

  app.delete('/api/tasks/:id', isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteTask(req.params.id);
      res.json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ message: "Failed to delete task" });
    }
  });

  // AI Tools routes
  app.post('/api/ai/generate-text', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { prompt, maxTokens = 1000, projectId } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user || user.credits < 5) {
        return res.status(402).json({ message: "Insufficient credits" });
      }

      const result = await aiService.generateText(prompt, maxTokens);
      
      // Record usage and deduct credits
      await storage.createAiToolUsage({
        userId,
        projectId,
        toolType: 'text_generation',
        creditsUsed: 5,
        input: prompt,
        output: result,
        metadata: { maxTokens },
      });
      
      await storage.updateUserCredits(userId, user.credits - 5);
      
      res.json({ content: result, creditsUsed: 5 });
    } catch (error) {
      console.error("Error generating text:", error);
      res.status(500).json({ message: "Failed to generate text" });
    }
  });

  app.post('/api/ai/generate-image', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { prompt, projectId } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user || user.credits < 10) {
        return res.status(402).json({ message: "Insufficient credits" });
      }

      const result = await aiService.generateImage(prompt);
      
      // Record usage and deduct credits
      await storage.createAiToolUsage({
        userId,
        projectId,
        toolType: 'image_generation',
        creditsUsed: 10,
        input: prompt,
        output: result.url,
      });
      
      await storage.updateUserCredits(userId, user.credits - 10);
      
      res.json({ imageUrl: result.url, creditsUsed: 10 });
    } catch (error) {
      console.error("Error generating image:", error);
      res.status(500).json({ message: "Failed to generate image" });
    }
  });

  app.post('/api/ai/generate-code', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { prompt, language, projectId } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user || user.credits < 8) {
        return res.status(402).json({ message: "Insufficient credits" });
      }

      const result = await aiService.generateCode(prompt, language);
      
      // Record usage and deduct credits
      await storage.createAiToolUsage({
        userId,
        projectId,
        toolType: 'code_generation',
        creditsUsed: 8,
        input: prompt,
        output: result,
        metadata: { language },
      });
      
      await storage.updateUserCredits(userId, user.credits - 8);
      
      res.json({ code: result, creditsUsed: 8 });
    } catch (error) {
      console.error("Error generating code:", error);
      res.status(500).json({ message: "Failed to generate code" });
    }
  });

  app.post('/api/ai/analyze-data', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { data, analysisType, projectId } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user || user.credits < 15) {
        return res.status(402).json({ message: "Insufficient credits" });
      }

      const result = await aiService.analyzeData(data, analysisType);
      
      // Record usage and deduct credits
      await storage.createAiToolUsage({
        userId,
        projectId,
        toolType: 'data_analysis',
        creditsUsed: 15,
        input: JSON.stringify(data),
        output: JSON.stringify(result),
        metadata: { analysisType },
      });
      
      await storage.updateUserCredits(userId, user.credits - 15);
      
      res.json({ analysis: result, creditsUsed: 15 });
    } catch (error) {
      console.error("Error analyzing data:", error);
      res.status(500).json({ message: "Failed to analyze data" });
    }
  });

  app.post('/api/ai/summarize-text', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { text, projectId } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user || user.credits < 3) {
        return res.status(402).json({ message: "Insufficient credits" });
      }

      const result = await aiService.summarizeText(text);
      
      // Record usage and deduct credits
      await storage.createAiToolUsage({
        userId,
        projectId,
        toolType: 'text_summarization',
        creditsUsed: 3,
        input: text,
        output: result,
      });
      
      await storage.updateUserCredits(userId, user.credits - 3);
      
      res.json({ summary: result, creditsUsed: 3 });
    } catch (error) {
      console.error("Error summarizing text:", error);
      res.status(500).json({ message: "Failed to summarize text" });
    }
  });

  app.post('/api/ai/optimize-seo', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { content, keywords, projectId } = req.body;
      
      const user = await storage.getUser(userId);
      if (!user || user.credits < 12) {
        return res.status(402).json({ message: "Insufficient credits" });
      }

      const result = await aiService.optimizeSEO(content, keywords);
      
      // Record usage and deduct credits
      await storage.createAiToolUsage({
        userId,
        projectId,
        toolType: 'seo_optimization',
        creditsUsed: 12,
        input: content,
        output: JSON.stringify(result),
        metadata: { keywords },
      });
      
      await storage.updateUserCredits(userId, user.credits - 12);
      
      res.json({ optimization: result, creditsUsed: 12 });
    } catch (error) {
      console.error("Error optimizing SEO:", error);
      res.status(500).json({ message: "Failed to optimize SEO" });
    }
  });

  // Marketplace routes
  app.get('/api/marketplace', async (req, res) => {
    try {
      const { category, limit = 50 } = req.query;
      const items = await storage.getMarketplaceItems(
        parseInt(limit as string), 
        category as string
      );
      res.json(items);
    } catch (error) {
      console.error("Error fetching marketplace items:", error);
      res.status(500).json({ message: "Failed to fetch marketplace items" });
    }
  });

  app.get('/api/marketplace/:id', async (req, res) => {
    try {
      const item = await storage.getMarketplaceItem(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Item not found" });
      }
      res.json(item);
    } catch (error) {
      console.error("Error fetching marketplace item:", error);
      res.status(500).json({ message: "Failed to fetch marketplace item" });
    }
  });

  app.post('/api/marketplace', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertMarketplaceItemSchema.parse({
        ...req.body,
        authorId: userId,
      });
      
      const item = await storage.createMarketplaceItem(validatedData);
      res.json(item);
    } catch (error) {
      console.error("Error creating marketplace item:", error);
      res.status(500).json({ message: "Failed to create marketplace item" });
    }
  });

  app.post('/api/marketplace/:id/purchase', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { price } = req.body;
      
      await storage.purchaseMarketplaceItem(userId, req.params.id, price);
      res.json({ message: "Purchase successful" });
    } catch (error) {
      console.error("Error purchasing item:", error);
      res.status(500).json({ message: "Failed to purchase item" });
    }
  });

  // Notifications routes
  app.get('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post('/api/notifications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertNotificationSchema.parse({
        ...req.body,
        userId,
      });
      
      const notification = await storage.createNotification(validatedData);
      res.json(notification);
    } catch (error) {
      console.error("Error creating notification:", error);
      res.status(500).json({ message: "Failed to create notification" });
    }
  });

  app.put('/api/notifications/:id/read', isAuthenticated, async (req, res) => {
    try {
      await storage.markNotificationRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Error marking notification read:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // API Keys routes
  app.get('/api/api-keys', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const apiKeys = await storage.getUserApiKeys(userId);
      res.json(apiKeys);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      res.status(500).json({ message: "Failed to fetch API keys" });
    }
  });

  app.post('/api/api-keys', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { name } = req.body;
      
      // Generate a random API key
      const keyValue = `tk_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      const keyHash = require('crypto').createHash('sha256').update(keyValue).digest('hex');
      
      const apiKey = await storage.createApiKey({
        userId,
        name,
        keyHash,
      });
      
      res.json({ ...apiKey, key: keyValue }); // Only return the actual key once
    } catch (error) {
      console.error("Error creating API key:", error);
      res.status(500).json({ message: "Failed to create API key" });
    }
  });

  app.delete('/api/api-keys/:id', isAuthenticated, async (req, res) => {
    try {
      await storage.deactivateApiKey(req.params.id);
      res.json({ message: "API key deactivated" });
    } catch (error) {
      console.error("Error deactivating API key:", error);
      res.status(500).json({ message: "Failed to deactivate API key" });
    }
  });

  // Admin routes
  app.get('/api/admin/analytics', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
