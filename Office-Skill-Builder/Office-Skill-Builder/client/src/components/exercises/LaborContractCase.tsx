import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Exercise } from "@shared/schema";

interface Case {
  id: string;
  scenario: string;
  options: string[];
  correctOption: number;
  explanation: string;
}

interface Props {
  exercise: Exercise;
  onComplete: (score: number, feedback: string[]) => void;
}

export default function LaborContractCase({ exercise, onComplete }: Props) {
  const data = exercise.data as { cases: Case[] };
  const cases = data.cases;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const currentCase = cases[currentIndex];
  const selected = selections[currentCase.id];
  const isRevealed = revealed[currentCase.id];
  const isLastCase = currentIndex === cases.length - 1;
  const allAnswered = cases.every(c => selections[c.id] !== undefined);

  const handleSelect = (optionIndex: number) => {
    if (isRevealed) return;
    setSelections(prev => ({ ...prev, [currentCase.id]: optionIndex }));
  };

  const handleReveal = () => {
    setRevealed(prev => ({ ...prev, [currentCase.id]: true }));
  };

  const handleNext = () => {
    if (currentIndex < cases.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleSubmit = () => {
    let correct = 0;
    const feedback: string[] = [];
    cases.forEach(c => {
      if (selections[c.id] === c.correctOption) {
        correct++;
        feedback.push(`Case ${c.id}: Correct answer selected.`);
      } else {
        feedback.push(`Case ${c.id}: Wrong. Correct was: "${c.options[c.correctOption]}"`);
      }
    });
    const score = Math.round((correct / cases.length) * 100);
    onComplete(score, feedback);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        {cases.map((c, i) => (
          <button
            key={c.id}
            onClick={() => setCurrentIndex(i)}
            data-testid={`case-tab-${i}`}
            className={`px-3 py-1 rounded-md text-xs font-medium border transition-colors
              ${i === currentIndex
                ? "border-primary bg-primary/10 text-primary"
                : selections[c.id] !== undefined
                  ? "border-border bg-muted text-muted-foreground"
                  : "border-border text-muted-foreground"
              }
            `}
          >
            Case {i + 1}
            {selections[c.id] !== undefined && (
              <span className={`ml-1 ${selections[c.id] === c.correctOption ? "text-green-500" : "text-red-500"}`}>
                {revealed[c.id] ? (selections[c.id] === c.correctOption ? "✓" : "✗") : "•"}
              </span>
            )}
          </button>
        ))}
      </div>

      <Card className="border-card-border">
        <CardContent className="p-5">
          <div className="mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Case {currentIndex + 1} of {cases.length}
          </div>
          <p className="text-sm text-foreground leading-relaxed mb-5">{currentCase.scenario}</p>

          <div className="space-y-2">
            {currentCase.options.map((option, i) => {
              const isSelected = selected === i;
              const isCorrect = i === currentCase.correctOption;
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
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={isRevealed}
                  data-testid={`option-${currentCase.id}-${i}`}
                  className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-colors ${btnClass}`}
                >
                  <span className="font-semibold mr-2">{String.fromCharCode(65 + i)}.</span>
                  {option}
                </button>
              );
            })}
          </div>

          {isRevealed && (
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-md">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">Explanation</p>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">{currentCase.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrev} disabled={currentIndex === 0} data-testid="button-prev-case">
            Previous
          </Button>
          {!isRevealed && selected !== undefined && (
            <Button variant="outline" size="sm" onClick={handleReveal} data-testid="button-reveal">
              Check Answer
            </Button>
          )}
          {!isLastCase && (
            <Button variant="outline" size="sm" onClick={handleNext} data-testid="button-next-case">
              Next
            </Button>
          )}
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!allAnswered}
          data-testid="button-submit-exercise"
        >
          {allAnswered ? "Submit All" : `Answer all ${cases.length} cases`}
        </Button>
      </div>
    </div>
  );
}
