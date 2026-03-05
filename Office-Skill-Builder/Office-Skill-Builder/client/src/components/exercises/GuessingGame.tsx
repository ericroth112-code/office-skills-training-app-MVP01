import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Exercise } from "@shared/schema";

interface Riddle {
  id: string;
  clue: string;
  answer: string;
  options: string[];
}

interface Props {
  exercise: Exercise;
  onComplete: (score: number, feedback: string[]) => void;
}

export default function GuessingGame({ exercise, onComplete }: Props) {
  const data = exercise.data as { riddles: Riddle[] };
  const riddles = data.riddles;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const currentRiddle = riddles[currentIndex];
  const selected = selections[currentRiddle.id];
  const isRevealed = revealed[currentRiddle.id];
  const isLastRiddle = currentIndex === riddles.length - 1;
  const allAnswered = riddles.every(r => selections[r.id] !== undefined);

  const handleSelect = (option: string) => {
    if (isRevealed) return;
    setSelections(prev => ({ ...prev, [currentRiddle.id]: option }));
  };

  const handleReveal = () => {
    setRevealed(prev => ({ ...prev, [currentRiddle.id]: true }));
  };

  const handleNext = () => {
    if (currentIndex < riddles.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = () => {
    let correct = 0;
    const feedback: string[] = [];
    riddles.forEach(r => {
      if (selections[r.id] === r.answer) {
        correct++;
        feedback.push(`Correct: The answer was "${r.answer}"`);
      } else {
        feedback.push(`Wrong: The answer was "${r.answer}", you guessed "${selections[r.id]}"`);
      }
    });
    const score = Math.round((correct / riddles.length) * 100);
    onComplete(score, feedback);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {riddles.map((r, i) => (
          <button
            key={r.id}
            onClick={() => setCurrentIndex(i)}
            data-testid={`riddle-tab-${i}`}
            className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors
              ${i === currentIndex
                ? "border-primary bg-primary/10 text-primary"
                : selections[r.id] !== undefined
                  ? "border-border bg-muted text-muted-foreground"
                  : "border-border text-muted-foreground"
              }
            `}
          >
            Riddle {i + 1}
            {selections[r.id] !== undefined && (
              <span className={`ml-1 ${selections[r.id] === r.answer ? "text-green-500" : "text-red-500"}`}>
                {revealed[r.id] ? (selections[r.id] === r.answer ? "✓" : "✗") : "•"}
              </span>
            )}
          </button>
        ))}
      </div>

      <Card className="border-card-border">
        <CardContent className="p-5">
          <div className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Riddle {currentIndex + 1} of {riddles.length}
          </div>

          <div className="bg-muted/50 rounded-md p-4 mb-5">
            <p className="text-sm text-foreground leading-relaxed italic">
              "{currentRiddle.clue}"
            </p>
          </div>

          <p className="text-xs font-semibold text-muted-foreground mb-3">What am I?</p>
          <div className="grid grid-cols-2 gap-2">
            {currentRiddle.options.map((option) => {
              const isSelected = selected === option;
              const isCorrect = option === currentRiddle.answer;
              let btnClass = "border-border bg-card text-foreground hover:border-primary/40";
              if (isRevealed) {
                if (isCorrect) btnClass = "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300";
                else if (isSelected && !isCorrect) btnClass = "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300";
                else btnClass = "border-border bg-card text-muted-foreground";
              } else if (isSelected) {
                btnClass = "border-primary bg-primary/10 text-primary";
              }

              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  disabled={isRevealed}
                  data-testid={`option-${currentRiddle.id}-${option}`}
                  className={`px-4 py-3 rounded-md border text-sm font-medium transition-colors text-center ${btnClass}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentIndex === 0} data-testid="button-prev-riddle">
            Previous
          </Button>
          {!isRevealed && selected !== undefined && (
            <Button variant="outline" size="sm" onClick={handleReveal} data-testid="button-reveal">
              Check Answer
            </Button>
          )}
          {!isLastRiddle && (
            <Button variant="outline" size="sm" onClick={handleNext} data-testid="button-next-riddle">
              Next
            </Button>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          data-testid="button-submit-exercise"
        >
          {allAnswered ? "Submit All" : `Answer all ${riddles.length} riddles`}
        </Button>
      </div>
    </div>
  );
}
