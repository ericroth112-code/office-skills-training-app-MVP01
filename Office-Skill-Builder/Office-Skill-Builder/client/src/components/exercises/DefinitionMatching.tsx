import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Exercise } from "@shared/schema";

interface Pair {
  term: string;
  definition: string;
}

interface Props {
  exercise: Exercise;
  onComplete: (score: number, feedback: string[]) => void;
}

export default function DefinitionMatching({ exercise, onComplete }: Props) {
  const data = exercise.data as { pairs: Pair[] };
  const pairs = data.pairs;

  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [shuffledDefs] = useState(() =>
    [...pairs.map(p => p.definition)].sort(() => Math.random() - 0.5)
  );
  const [submitted, setSubmitted] = useState(false);

  const matchedTerms = Object.keys(matches);
  const matchedDefs = Object.values(matches);

  const handleTermClick = (term: string) => {
    if (submitted) return;
    if (matchedTerms.includes(term)) {
      const newMatches = { ...matches };
      delete newMatches[term];
      setMatches(newMatches);
      setSelectedTerm(term);
      return;
    }
    setSelectedTerm(prev => prev === term ? null : term);
  };

  const handleDefClick = (def: string) => {
    if (submitted) return;
    if (matchedDefs.includes(def)) {
      const termForDef = Object.keys(matches).find(k => matches[k] === def);
      if (termForDef) {
        const newMatches = { ...matches };
        delete newMatches[termForDef];
        setMatches(newMatches);
        if (selectedTerm) {
          setMatches(prev => ({ ...prev, [selectedTerm]: def }));
          setSelectedTerm(null);
        } else {
          setSelectedTerm(termForDef);
        }
      }
      return;
    }
    if (selectedTerm) {
      setMatches(prev => ({ ...prev, [selectedTerm]: def }));
      setSelectedTerm(null);
    }
  };

  const handleSubmit = () => {
    if (Object.keys(matches).length < pairs.length) return;
    setSubmitted(true);
    let correct = 0;
    const feedback: string[] = [];
    pairs.forEach(pair => {
      if (matches[pair.term] === pair.definition) {
        correct++;
        feedback.push(`Correct: "${pair.term}" = "${pair.definition}"`);
      } else {
        feedback.push(`Wrong: "${pair.term}" should be "${pair.definition}"`);
      }
    });
    const score = Math.round((correct / pairs.length) * 100);
    setTimeout(() => onComplete(score, feedback), 600);
  };

  const isTermSelected = (term: string) => selectedTerm === term;
  const isTermMatched = (term: string) => matchedTerms.includes(term);
  const isDefMatched = (def: string) => matchedDefs.includes(def);

  const getTermStatus = (term: string) => {
    if (!submitted) return null;
    const pair = pairs.find(p => p.term === term);
    return matches[term] === pair?.definition ? "correct" : "wrong";
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">Terms</p>
          {pairs.map(pair => {
            const status = getTermStatus(pair.term);
            return (
              <button
                key={pair.term}
                onClick={() => handleTermClick(pair.term)}
                data-testid={`term-${pair.term}`}
                className={`w-full text-left px-4 py-3 rounded-md border text-sm font-medium transition-colors
                  ${isTermSelected(pair.term)
                    ? "border-primary bg-primary/10 text-primary"
                    : isTermMatched(pair.term)
                      ? status === "correct"
                        ? "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                        : status === "wrong"
                          ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                          : "border-primary/40 bg-primary/5 text-foreground"
                      : "border-border bg-card text-foreground hover:border-primary/40"
                  }`}
              >
                {pair.term}
              </button>
            );
          })}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">Definitions</p>
          {shuffledDefs.map(def => {
            const matchedTerm = Object.keys(matches).find(k => matches[k] === def);
            const status = matchedTerm ? getTermStatus(matchedTerm) : null;
            return (
              <button
                key={def}
                onClick={() => handleDefClick(def)}
                data-testid={`def-${def.slice(0, 10)}`}
                className={`w-full text-left px-4 py-3 rounded-md border text-sm transition-colors leading-snug
                  ${isDefMatched(def)
                    ? status === "correct"
                      ? "border-green-500 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                      : status === "wrong"
                        ? "border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                        : "border-primary/40 bg-primary/5 text-foreground"
                    : selectedTerm
                      ? "border-primary/30 bg-card text-foreground hover:border-primary/60 hover:bg-primary/5"
                      : "border-border bg-card text-foreground"
                  }`}
              >
                {def}
              </button>
            );
          })}
        </div>
      </div>

      {selectedTerm && (
        <div className="bg-primary/5 border border-primary/20 rounded-md px-4 py-2 text-sm text-primary">
          Selected: <span className="font-semibold">{selectedTerm}</span> &mdash; now click a definition to match.
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={Object.keys(matches).length < pairs.length || submitted}
          data-testid="button-submit-exercise"
        >
          {Object.keys(matches).length < pairs.length
            ? `Match all ${pairs.length} pairs to continue`
            : "Submit Answers"
          }
        </Button>
      </div>
    </div>
  );
}
