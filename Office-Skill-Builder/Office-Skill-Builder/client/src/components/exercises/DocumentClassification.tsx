import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@shared/schema";

interface Document {
  id: string;
  name: string;
  correctCategory: string;
}

interface Props {
  exercise: Exercise;
  onComplete: (score: number, feedback: string[]) => void;
}

export default function DocumentClassification({ exercise, onComplete }: Props) {
  const data = exercise.data as { documents: Document[]; categories: string[] };
  const { documents, categories } = data;

  const [selections, setSelections] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (docId: string, category: string) => {
    if (submitted) return;
    setSelections(prev => ({ ...prev, [docId]: category }));
  };

  const handleSubmit = () => {
    if (Object.keys(selections).length < documents.length) return;
    setSubmitted(true);
    let correct = 0;
    const feedback: string[] = [];
    documents.forEach(doc => {
      if (selections[doc.id] === doc.correctCategory) {
        correct++;
        feedback.push(`Correct: "${doc.name}" belongs to "${doc.correctCategory}"`);
      } else {
        feedback.push(`Wrong: "${doc.name}" belongs to "${doc.correctCategory}", not "${selections[doc.id]}"`);
      }
    });
    const score = Math.round((correct / documents.length) * 100);
    setTimeout(() => onComplete(score, feedback), 400);
  };

  const getDocStatus = (doc: Document) => {
    if (!submitted) return null;
    return selections[doc.id] === doc.correctCategory ? "correct" : "wrong";
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        {documents.map(doc => {
          const status = getDocStatus(doc);
          return (
            <div
              key={doc.id}
              data-testid={`classify-doc-${doc.id}`}
              className={`rounded-md border p-4 transition-colors
                ${status === "correct" ? "border-green-500 bg-green-50 dark:bg-green-950/30" : ""}
                ${status === "wrong" ? "border-red-500 bg-red-50 dark:bg-red-950/30" : ""}
                ${!status ? "border-border bg-card" : ""}
              `}
            >
              <p className={`text-sm font-semibold mb-3
                ${status === "correct" ? "text-green-700 dark:text-green-300" : ""}
                ${status === "wrong" ? "text-red-700 dark:text-red-300" : "text-foreground"}
              `}>
                {doc.name}
              </p>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleSelect(doc.id, cat)}
                    disabled={submitted}
                    data-testid={`category-${doc.id}-${cat}`}
                    className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors
                      ${selections[doc.id] === cat
                        ? status === "correct"
                          ? "border-green-500 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                          : status === "wrong"
                            ? "border-red-500 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                            : "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {submitted && status === "wrong" && (
                <p className="text-xs text-muted-foreground mt-2">
                  Correct answer: <span className="font-semibold text-green-600 dark:text-green-400">{doc.correctCategory}</span>
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(selections).length < documents.length || submitted}
          data-testid="button-submit-exercise"
        >
          {Object.keys(selections).length < documents.length
            ? `Classify all ${documents.length} documents to continue`
            : "Submit Classification"
          }
        </Button>
      </div>
    </div>
  );
}
