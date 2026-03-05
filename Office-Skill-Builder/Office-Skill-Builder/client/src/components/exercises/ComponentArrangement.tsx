import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GripVertical, ArrowUp, ArrowDown } from "lucide-react";
import type { Exercise } from "@shared/schema";

interface Component {
  id: string;
  label: string;
  correctOrder: number;
}

interface Props {
  exercise: Exercise;
  onComplete: (score: number, feedback: string[]) => void;
}

export default function ComponentArrangement({ exercise, onComplete }: Props) {
  const data = exercise.data as { components: Component[] };
  const [items, setItems] = useState<Component[]>(() =>
    [...data.components].sort(() => Math.random() - 0.5)
  );
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(from, 1);
    newItems.splice(to, 0, moved);
    setItems(newItems);
  };

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    moveItem(dragIndex, index);
    setDragIndex(index);
  };

  const handleDrop = () => {
    setDragIndex(null);
  };

  const handleSubmit = () => {
    setSubmitted(true);
    let correct = 0;
    const feedback: string[] = [];
    items.forEach((item, index) => {
      const position = index + 1;
      if (item.correctOrder === position) {
        correct++;
        feedback.push(`Correct: "${item.label}" is at position ${position}`);
      } else {
        feedback.push(`Wrong: "${item.label}" should be at position ${item.correctOrder}, but was at ${position}`);
      }
    });
    const score = Math.round((correct / items.length) * 100);
    setTimeout(() => onComplete(score, feedback), 400);
  };

  const getItemStatus = (item: Component, index: number) => {
    if (!submitted) return null;
    return item.correctOrder === index + 1 ? "correct" : "wrong";
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Move items up or down using the arrows, or drag and drop to reorder them.
      </p>
      <div className="space-y-2">
        {items.map((item, index) => {
          const status = getItemStatus(item, index);
          return (
            <div
              key={item.id}
              draggable={!submitted}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={handleDrop}
              data-testid={`arrangement-item-${item.id}`}
              className={`flex items-center gap-3 p-3 rounded-md border bg-card select-none transition-colors
                ${dragIndex === index ? "opacity-50 border-primary" : ""}
                ${status === "correct" ? "border-green-500 bg-green-50 dark:bg-green-950/30" : ""}
                ${status === "wrong" ? "border-red-500 bg-red-50 dark:bg-red-950/30" : ""}
                ${!status ? "border-border" : ""}
              `}
            >
              <span className={`text-xs font-bold w-5 text-center flex-shrink-0
                ${status === "correct" ? "text-green-600 dark:text-green-400" : ""}
                ${status === "wrong" ? "text-red-600 dark:text-red-400" : "text-muted-foreground"}
              `}>
                {index + 1}
              </span>

              {!submitted && (
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0 cursor-grab" />
              )}

              <span className={`flex-1 text-sm font-medium
                ${status === "correct" ? "text-green-700 dark:text-green-300" : ""}
                ${status === "wrong" ? "text-red-700 dark:text-red-300" : "text-foreground"}
              `}>
                {item.label}
              </span>

              {!submitted && (
                <div className="flex flex-col gap-0.5 flex-shrink-0">
                  <button
                    onClick={() => moveItem(index, index - 1)}
                    disabled={index === 0}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                    data-testid={`btn-up-${item.id}`}
                  >
                    <ArrowUp className="w-3 h-3 text-muted-foreground" />
                  </button>
                  <button
                    onClick={() => moveItem(index, index + 1)}
                    disabled={index === items.length - 1}
                    className="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
                    data-testid={`btn-down-${item.id}`}
                  >
                    <ArrowDown className="w-3 h-3 text-muted-foreground" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={submitted}
          data-testid="button-submit-exercise"
        >
          Submit Order
        </Button>
      </div>
    </div>
  );
}
