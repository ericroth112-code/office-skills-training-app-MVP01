import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@shared/schema";

interface Position {
  id: string;
  label: string;
  correctBlock: string;
}

interface Props {
  exercise: Exercise;
  onComplete: (score: number, feedback: string[]) => void;
}

export default function DocumentBlockPlacement({ exercise, onComplete }: Props) {
  const data = exercise.data as { positions: Position[]; blocks: string[] };
  const { positions, blocks } = data;

  const [placements, setPlacements] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [draggedBlock, setDraggedBlock] = useState<string | null>(null);

  const placedBlocks = Object.values(placements);
  const availableBlocks = blocks.filter(b => !placedBlocks.includes(b));

  const handleDragStartBlock = (block: string) => setDraggedBlock(block);
  const handleDragStartPlaced = (block: string) => setDraggedBlock(block);

  const handleDropOnPosition = (posId: string) => {
    if (!draggedBlock || submitted) return;
    const oldPosId = Object.keys(placements).find(k => placements[k] === draggedBlock);
    const newPlacements = { ...placements };
    if (oldPosId) delete newPlacements[oldPosId];
    newPlacements[posId] = draggedBlock;
    setPlacements(newPlacements);
    setDraggedBlock(null);
  };

  const handleDropOnAvailable = () => {
    if (!draggedBlock || submitted) return;
    const oldPosId = Object.keys(placements).find(k => placements[k] === draggedBlock);
    if (oldPosId) {
      const newPlacements = { ...placements };
      delete newPlacements[oldPosId];
      setPlacements(newPlacements);
    }
    setDraggedBlock(null);
  };

  const removeFromPosition = (posId: string) => {
    if (submitted) return;
    const newPlacements = { ...placements };
    delete newPlacements[posId];
    setPlacements(newPlacements);
  };

  const handleSubmit = () => {
    if (Object.keys(placements).length < positions.length) return;
    setSubmitted(true);
    let correct = 0;
    const feedback: string[] = [];
    positions.forEach(pos => {
      const placed = placements[pos.id];
      if (placed === pos.correctBlock) {
        correct++;
        feedback.push(`Correct: "${pos.correctBlock}" belongs in "${pos.label}"`);
      } else {
        feedback.push(`Wrong: "${pos.label}" should contain "${pos.correctBlock}", but you placed "${placed}"`);
      }
    });
    const score = Math.round((correct / positions.length) * 100);
    setTimeout(() => onComplete(score, feedback), 400);
  };

  const getPositionStatus = (posId: string) => {
    if (!submitted) return null;
    const pos = positions.find(p => p.id === posId);
    return placements[posId] === pos?.correctBlock ? "correct" : "wrong";
  };

  return (
    <div className="space-y-5">
      <div
        className="border-2 border-dashed border-border rounded-md p-3 min-h-10"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDropOnAvailable}
        data-testid="available-blocks"
      >
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Available Blocks</p>
        {availableBlocks.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">All blocks have been placed</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableBlocks.map(block => (
              <div
                key={block}
                draggable
                onDragStart={() => handleDragStartBlock(block)}
                data-testid={`block-${block.slice(0, 10)}`}
                className="px-3 py-1.5 bg-primary/10 border border-primary/30 text-primary text-xs font-medium rounded-md cursor-grab select-none"
              >
                {block}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Document Positions</p>
        {positions.map(pos => {
          const status = getPositionStatus(pos.id);
          const placed = placements[pos.id];
          return (
            <div
              key={pos.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropOnPosition(pos.id)}
              data-testid={`position-${pos.id}`}
              className={`flex items-center gap-3 p-3 rounded-md border transition-colors
                ${status === "correct" ? "border-green-500 bg-green-50 dark:bg-green-950/30" : ""}
                ${status === "wrong" ? "border-red-500 bg-red-50 dark:bg-red-950/30" : ""}
                ${!status && placed ? "border-primary/40 bg-primary/5" : ""}
                ${!status && !placed ? "border-dashed border-border bg-muted/30" : ""}
              `}
            >
              <span className="text-xs text-muted-foreground w-28 flex-shrink-0 font-medium">{pos.label}</span>
              <div className="flex-1 min-h-7 flex items-center">
                {placed ? (
                  <div className="flex items-center justify-between w-full gap-2">
                    <span className={`text-sm font-medium
                      ${status === "correct" ? "text-green-700 dark:text-green-300" : ""}
                      ${status === "wrong" ? "text-red-700 dark:text-red-300" : "text-foreground"}
                    `}>
                      {placed}
                    </span>
                    {!submitted && (
                      <button
                        onClick={() => removeFromPosition(pos.id)}
                        className="text-muted-foreground text-xs underline flex-shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">Drop a block here</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(placements).length < positions.length || submitted}
          data-testid="button-submit-exercise"
        >
          {Object.keys(placements).length < positions.length
            ? `Place all ${positions.length} blocks to continue`
            : "Submit Placement"
          }
        </Button>
      </div>
    </div>
  );
}
