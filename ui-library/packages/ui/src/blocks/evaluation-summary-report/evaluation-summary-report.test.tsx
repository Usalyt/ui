import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  EvaluationSummaryReport,
  type HeuristicScoreItem,
} from "./evaluation-summary-report";

const sampleHeuristics: HeuristicScoreItem[] = [
  { id: "H1", name: "Visibility of system status", score: 80, findingCount: 2 },
  {
    id: "H2",
    name: "Match between system and real world",
    score: 95,
    findingCount: 0,
  },
];

describe("EvaluationSummaryReport Block", () => {
  it("renders report title, metrics and heuristic progress items", () => {
    render(
      <EvaluationSummaryReport
        title="Sprint 4 Audit"
        projectName="Checkout Flow"
        overallScore={88}
        criticalCount={2}
        mediumCount={4}
        goodCount={10}
        heuristics={sampleHeuristics}
      />
    );

    expect(screen.getByText("Sprint 4 Audit")).toBeInTheDocument();
    expect(screen.getByText("Checkout Flow")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
    expect(screen.getByText("Visibility of system status")).toBeInTheDocument();
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("uses neutral score meters while preserving values", () => {
    render(
      <EvaluationSummaryReport
        overallScore={78}
        heuristics={sampleHeuristics}
      />
    );

    const bars = screen.getAllByRole("progressbar");
    expect(bars).toHaveLength(3);
    for (const bar of bars) {
      expect(bar.querySelector(".bg-muted-foreground")).toBeInTheDocument();
      expect(bar.querySelector(".bg-primary")).not.toBeInTheDocument();
    }
    expect(screen.getByText("78")).toBeInTheDocument();
  });

  it("calls onExportPdf when export button is clicked", async () => {
    const user = userEvent.setup();
    const handleExport = vi.fn();

    render(<EvaluationSummaryReport onExportPdf={handleExport} />);

    const exportBtn = screen.getByRole("button", { name: /export pdf/i });
    await user.click(exportBtn);

    expect(handleExport).toHaveBeenCalledOnce();
  });
});
