import React from "react";
import { EvaluationSummaryReport, type HeuristicScoreItem } from "@usalyt/ui";

const heuristics: HeuristicScoreItem[] = [
  { id: "H1", name: "Visibility of system status", score: 75, findingCount: 3 },
  { id: "H2", name: "Match between system and real world", score: 90, findingCount: 1 },
  { id: "H3", name: "User control and freedom", score: 65, findingCount: 4 },
  { id: "H4", name: "Consistency and standards", score: 85, findingCount: 2 },
  { id: "H5", name: "Error prevention", score: 70, findingCount: 3 },
];

export function EvaluationSummaryReportDemo() {
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl space-y-2">
      <EvaluationSummaryReport
        title="Checkout Flow Usability Audit"
        projectName="E-Commerce Web Portal"
        overallScore={78}
        criticalCount={4}
        mediumCount={6}
        goodCount={12}
        heuristics={heuristics}
        onExportPdf={() => setLastAction("Exporting the executive summary as PDF…")}
        onShareReport={() => setLastAction("Share link copied to clipboard")}
      />
      {lastAction && (
        <p className="text-center text-xs text-muted-foreground" role="status">
          {lastAction}
        </p>
      )}
    </div>
  );
}
