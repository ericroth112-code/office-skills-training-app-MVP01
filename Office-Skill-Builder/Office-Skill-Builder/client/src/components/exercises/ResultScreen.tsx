import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, RotateCcw, ChevronLeft, Trophy } from "lucide-react";

interface Props {
  score: number;
  feedback: string[];
  exerciseTitle: string;
  onRetry: () => void;
  onBackToLesson: () => void;
}

export default function ResultScreen({ score, feedback, exerciseTitle, onRetry, onBackToLesson }: Props) {
  const isPassing = score >= 60;
  const isExcellent = score >= 90;

  const getMessage = () => {
    if (isExcellent) return "Excellent work!";
    if (isPassing) return "Good job!";
    return "Keep practicing!";
  };

  const getSubMessage = () => {
    if (isExcellent) return "You got almost everything right!";
    if (isPassing) return "You passed this exercise.";
    return "Review the answers and try again.";
  };

  const correctCount = feedback.filter(f => f.startsWith("Correct")).length;
  const totalCount = feedback.length;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50 px-4 md:px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBackToLesson}
            data-testid="button-back-to-lesson"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h1 className="font-semibold text-sm text-foreground truncate">Results</h1>
        </div>
      </header>

      <main className="px-4 md:px-6 py-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center
            ${isExcellent ? "bg-green-100 dark:bg-green-950/40" : isPassing ? "bg-blue-100 dark:bg-blue-950/40" : "bg-orange-100 dark:bg-orange-950/40"}
          `}>
            <Trophy className={`w-10 h-10
              ${isExcellent ? "text-green-600 dark:text-green-400" : isPassing ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}
            `} />
          </div>

          <div className={`text-5xl font-bold mb-2
            ${isExcellent ? "text-green-600 dark:text-green-400" : isPassing ? "text-blue-600 dark:text-blue-400" : "text-orange-600 dark:text-orange-400"}
          `}>
            {score}%
          </div>

          <h2 className="text-xl font-bold text-foreground mb-1">{getMessage()}</h2>
          <p className="text-muted-foreground text-sm">{getSubMessage()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {correctCount} out of {totalCount} correct
          </p>
        </div>

        <Card className="border-card-border mb-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3">Answer Breakdown</h3>
            <div className="space-y-2">
              {feedback.map((item, index) => {
                const isCorrect = item.startsWith("Correct");
                return (
                  <div key={index} className="flex items-start gap-2.5">
                    {isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-xs leading-relaxed
                      ${isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}
                    `}>
                      {item}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onRetry}
            data-testid="button-retry"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </Button>
          <Button
            onClick={onBackToLesson}
            data-testid="button-back-lesson-result"
          >
            Back to Lesson
          </Button>
        </div>
      </main>
    </div>
  );
}
