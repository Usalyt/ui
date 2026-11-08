import React from "react";
import { HeuristicFindingCard, type HeuristicFinding } from "@usalyt/ui";

const sampleFinding: HeuristicFinding = {
  id: "finding-h1-01",
  heuristicId: "H1",
  heuristicTitle: "Visibility of System Status",
  severity: "CRITICAL",
  rating: 4,
  selector: "button#complete-purchase.btn-primary",
  description:
    "The button shows no spinner or loading state while the transaction is processed, causing users to submit the order twice.",
  createdAt: "2 Sep 2026",
  evaluatorName: "María R.",
};

export function HeuristicFindingCardDemo() {
  const [finding, setFinding] = React.useState<HeuristicFinding | null>(sampleFinding);
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  if (!finding) {
    return (
      <div className="w-full max-w-md space-y-2 text-center">
        <p className="text-xs text-muted-foreground" role="status">
          Finding {sampleFinding.id} deleted.
        </p>
        <button
          type="button"
          className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          onClick={() => setFinding(sampleFinding)}
        >
          Restore finding
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-2">
      <HeuristicFindingCard
        finding={finding}
        onEdit={() => setLastAction(`Edit requested for ${finding.id}`)}
        onDelete={() => setFinding(null)}
      />
      {lastAction && (
        <p className="text-center text-xs text-muted-foreground" role="status">
          {lastAction}
        </p>
      )}
    </div>
  );
}
