export * from "./models/auth";

import { pgTable, text, varchar, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { sql } from "drizzle-orm";

export const lessons = pgTable("lessons", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

export const exercises = pgTable("exercises", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  type: text("type").notNull(),
  title: text("title").notNull(),
  instructions: text("instructions").notNull(),
  data: jsonb("data").notNull(),
  orderIndex: integer("order_index").notNull().default(0),
});

export const userProgress = pgTable("user_progress", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  userId: varchar("user_id").notNull(),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  lessonId: integer("lesson_id").notNull().references(() => lessons.id),
  score: integer("score").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
});

export const insertLessonSchema = createInsertSchema(lessons).omit({ id: true });
export const insertExerciseSchema = createInsertSchema(exercises).omit({ id: true });
export const insertUserProgressSchema = createInsertSchema(userProgress).omit({ id: true });

export type Lesson = typeof lessons.$inferSelect;
export type Exercise = typeof exercises.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
