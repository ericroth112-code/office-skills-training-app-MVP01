import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import type { Exercise } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import DefinitionMatching from "@/components/exercises/DefinitionMatching";
import ComponentArrangement from "@/components/exercises/ComponentArrangement";
import DocumentBlockPlacement from "@/components/exercises/DocumentBlockPlacement";
import DocumentClassification from "@/components/exercises/DocumentClassification";
import LaborContractCase from "@/components/exercises/LaborContractCase";
import GuessingGame from "@/components/exercises/GuessingGame";
import ResultScreen from "@/components/exercises/ResultScreen";

export default function ExercisePage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const exerciseId = parseInt(params.id);

  const [result, setResult] = useState<{ score: number; feedback: string[] } | null>(null);

  const { data: exercise, isLoading } = useQuery<Exercise>({
    queryKey: ["/api/exercises", exerciseId],
    queryFn: () => fetch(`/api/exercises/${exerciseId}`).then(r => r.json()),
  });

  const progressMutation = useMutation({
    mutationFn: (data: { exerciseId: number; lessonId: number; score: number; completed: boolean; completedAt: string }) =>
      apiRequest("POST", "/api/progress", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/progress"] });
      if (exercise) {
        queryClient.invalidateQueries({ queryKey: ["/api/progress/lesson", exercise.lessonId] });
      }
    },
  });

  const handleComplete = (score: number, feedback: string[]) => {
    setResult({ score, feedback });
    if (exercise) {
      progressMutation.mutate({
        exerciseId: exercise.id,
        lessonId: exercise.lessonId,
        score,
        completed: true,
        completedAt: new Date().toISOString(),
      });
    }
  };

  const handleRetry = () => {
    setResult(null);
  };

  const handleBackToLesson = () => {
    if (exercise) navigate(`/lessons/${exercise.lessonId}`);
    else navigate("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-5 w-full mb-6" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-md" />)}
        </div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Exercise not found.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>Go Home</Button>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <ResultScreen
        score={result.score}
        feedback={result.feedback}
        exerciseTitle={exercise.title}
        onRetry={handleRetry}
        onBackToLesson={handleBackToLesson}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 px-4 md:px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToLesson}
            data-testid="button-back-lesson"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-semibold text-sm text-foreground truncate">{exercise.title}</h1>
        </div>
      </header>

      <main className="px-4 md:px-6 py-6 max-w-2xl mx-auto">
        <Card className="border-card-border mb-4">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground leading-relaxed">{exercise.instructions}</p>
          </CardContent>
        </Card>

        {exercise.type === "definition_matching" && (
          <DefinitionMatching exercise={exercise} onComplete={handleComplete} />
        )}
        {exercise.type === "component_arrangement" && (
          <ComponentArrangement exercise={exercise} onComplete={handleComplete} />
        )}
        {exercise.type === "document_block_placement" && (
          <DocumentBlockPlacement exercise={exercise} onComplete={handleComplete} />
        )}
        {exercise.type === "document_classification" && (
          <DocumentClassification exercise={exercise} onComplete={handleComplete} />
        )}
        {exercise.type === "labor_contract_case" && (
          <LaborContractCase exercise={exercise} onComplete={handleComplete} />
        )}
        {exercise.type === "guessing_game" && (
          <GuessingGame exercise={exercise} onComplete={handleComplete} />
        )}
      </main>
    </div>
  );
}
