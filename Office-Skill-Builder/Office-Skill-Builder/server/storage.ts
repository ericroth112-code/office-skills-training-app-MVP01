import { db } from "./db";
import { eq, and } from "drizzle-orm";
import {
  lessons, exercises, userProgress,
  type Lesson, type Exercise, type UserProgress,
  type InsertLesson, type InsertExercise, type InsertUserProgress,
} from "@shared/schema";

export interface IStorage {
  getLessons(): Promise<Lesson[]>;
  getLesson(id: number): Promise<Lesson | undefined>;
  createLesson(lesson: InsertLesson): Promise<Lesson>;

  getExercises(lessonId: number): Promise<Exercise[]>;
  getExercise(id: number): Promise<Exercise | undefined>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;

  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressForLesson(userId: string, lessonId: number): Promise<UserProgress[]>;
  getUserProgressForExercise(userId: string, exerciseId: number): Promise<UserProgress | undefined>;
  upsertUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

export class DatabaseStorage implements IStorage {
  async getLessons(): Promise<Lesson[]> {
    return db.select().from(lessons).orderBy(lessons.orderIndex);
  }

  async getLesson(id: number): Promise<Lesson | undefined> {
    const [lesson] = await db.select().from(lessons).where(eq(lessons.id, id));
    return lesson;
  }

  async createLesson(lesson: InsertLesson): Promise<Lesson> {
    const [created] = await db.insert(lessons).values(lesson).returning();
    return created;
  }

  async getExercises(lessonId: number): Promise<Exercise[]> {
    return db.select().from(exercises).where(eq(exercises.lessonId, lessonId)).orderBy(exercises.orderIndex);
  }

  async getExercise(id: number): Promise<Exercise | undefined> {
    const [exercise] = await db.select().from(exercises).where(eq(exercises.id, id));
    return exercise;
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [created] = await db.insert(exercises).values(exercise).returning();
    return created;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getUserProgressForLesson(userId: string, lessonId: number): Promise<UserProgress[]> {
    return db.select().from(userProgress).where(
      and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId))
    );
  }

  async getUserProgressForExercise(userId: string, exerciseId: number): Promise<UserProgress | undefined> {
    const [progress] = await db.select().from(userProgress).where(
      and(eq(userProgress.userId, userId), eq(userProgress.exerciseId, exerciseId))
    );
    return progress;
  }

  async upsertUserProgress(progress: InsertUserProgress): Promise<UserProgress> {
    const existing = await this.getUserProgressForExercise(progress.userId, progress.exerciseId);
    if (existing) {
      const [updated] = await db
        .update(userProgress)
        .set({ score: progress.score, completed: progress.completed, completedAt: progress.completedAt })
        .where(eq(userProgress.id, existing.id))
        .returning();
      return updated;
    }
    const [created] = await db.insert(userProgress).values(progress).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
