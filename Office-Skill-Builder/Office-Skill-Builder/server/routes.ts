import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { seedDatabase } from "./seed";
import { insertUserProgressSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  await setupAuth(app);
  registerAuthRoutes(app);

  await seedDatabase();

  // Lessons
  app.get("/api/lessons", isAuthenticated, async (req, res) => {
    try {
      const allLessons = await storage.getLessons();
      res.json(allLessons);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lessons" });
    }
  });

  app.get("/api/lessons/:id", isAuthenticated, async (req, res) => {
    try {
      const lesson = await storage.getLesson(parseInt(req.params.id));
      if (!lesson) return res.status(404).json({ message: "Lesson not found" });
      res.json(lesson);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch lesson" });
    }
  });

  // Exercises
  app.get("/api/lessons/:lessonId/exercises", isAuthenticated, async (req, res) => {
    try {
      const exs = await storage.getExercises(parseInt(req.params.lessonId));
      res.json(exs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.get("/api/exercises/:id", isAuthenticated, async (req, res) => {
    try {
      const exercise = await storage.getExercise(parseInt(req.params.id));
      if (!exercise) return res.status(404).json({ message: "Exercise not found" });
      res.json(exercise);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  // User Progress
  app.get("/api/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.get("/api/progress/lesson/:lessonId", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserProgressForLesson(userId, parseInt(req.params.lessonId));
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post("/api/progress", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const parsed = insertUserProgressSchema.safeParse({ ...req.body, userId });
      if (!parsed.success) {
        return res.status(400).json({ message: "Invalid data", errors: parsed.error.errors });
      }
      const progress = await storage.upsertUserProgress(parsed.data);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to save progress" });
    }
  });

  return httpServer;
}
