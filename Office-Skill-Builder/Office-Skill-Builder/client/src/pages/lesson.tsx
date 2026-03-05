import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  ChevronLeft, ChevronRight, CheckCircle2, BookOpen,
  FileText, Layout, FolderOpen, Briefcase, HelpCircle, Lock
} from "lucide-react";
import type { Lesson, Exercise, UserProgress } from "@shared/schema";

const ICON_MAP: Record<string, any> = {
  BookOpen, FileText, Layout, FolderOpen, Briefcase, HelpCircle
};

const EXERCISE_TYPE_LABELS: Record<string, string> = {
  definition_matching: "Definition Matching",
  component_arrangement: "Component Arrangement",
  document_block_placement: "Block Placement",
  document_classification: "Document Classification",
  labor_contract_case: "Case Study",
  guessing_game: "Guessing Game",
};

const EXERCISE_TYPE_COLORS: Record<string, string> = {
  definition_matching: "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300",
  component_arrangement: "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300",
  document_block_placement: "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300",
  document_classification: "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-300",
  labor_contract_case: "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300",
  guessing_game: "bg-teal-50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300",
};

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const lessonId = parseInt(params.id);

  const { data: lesson, isLoading: lessonLoading } = useQuery<Lesson>({
    queryKey: ["/api/lessons", lessonId],
    queryFn: () => fetch(`/api/lessons/${lessonId}`).then(r => r.json()),
  });

  const { data: exercises = [], isLoading: exercisesLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/lessons", lessonId, "exercises"],
    queryFn: () => fetch(`/api/lessons/${lessonId}/exercises`).then(r => r.json()),
  });

  const { data: progressList = [] } = useQuery<UserProgress[]>({
    queryKey: ["/api/progress/lesson", lessonId],
    queryFn: () => fetch(`/api/progress/lesson/${lessonId}`).then(r => r.json()),
  });

  const completedCount = progressList.filter(p => p.completed).length;
  const progressPct = exercises.length > 0 ? Math.round((completedCount / exercises.length) * 100) : 0;

  const IconComp = lesson ? (ICON_MAP[lesson.icon] || BookOpen) : BookOpen;

  if (lessonLoading) {
    return (
      <div className="min-h-screen bg-background px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-24 w-full rounded-md mb-6" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 w-full rounded-md" />)}
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Lesson not found.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 px-4 md:px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            data-testid="button-back-home"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-2 min-w-0">
            <IconComp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <h1 className="font-semibold text-sm text-foreground truncate">{lesson.title}</h1>
          </div>
        </div>
      </header>

      <main className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <div className="mb-6">
          <p className="text-muted-foreground text-sm mb-4">{lesson.description}</p>
          {exercises.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{completedCount} of {exercises.length} exercises completed</span>
                <span>{progressPct}%</span>
              </div>
              <Progress value={progressPct} className="h-2" />
            </div>
          )}
        </div>

        {exercisesLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20 w-full rounded-md" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {exercises.map((exercise, index) => {
              const exerciseProgress = progressList.find(p => p.exerciseId === exercise.id);
              const isCompleted = exerciseProgress?.completed || false;
              const typeLabel = EXERCISE_TYPE_LABELS[exercise.type] || exercise.type;
              const typeColor = EXERCISE_TYPE_COLORS[exercise.type] || "";

              return (
                <Card
                  key={exercise.id}
                  className="cursor-pointer hover-elevate border-card-border"
                  onClick={() => navigate(`/exercises/${exercise.id}`)}
                  data-testid={`card-exercise-${exercise.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${isCompleted ? "bg-green-100 dark:bg-green-950/40" : "bg-muted"}`}>
                        {isCompleted ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <span className="text-sm font-bold text-muted-foreground">{index + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground leading-snug">{exercise.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${typeColor}`}>
                            {typeLabel}
                          </span>
                          {isCompleted && exerciseProgress?.score !== undefined && (
                            <span className="text-xs text-muted-foreground">
                              Score: {exerciseProgress.score}%
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
