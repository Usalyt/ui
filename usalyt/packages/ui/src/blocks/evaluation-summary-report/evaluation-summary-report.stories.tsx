import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  EvaluationSummaryReport,
  type HeuristicScoreItem,
} from "./evaluation-summary-report";

const meta: Meta<typeof EvaluationSummaryReport> = {
  title: "Blocks/EvaluationSummaryReport",
  component: EvaluationSummaryReport,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleHeuristics: HeuristicScoreItem[] = [
  { id: "H1", name: "Visibility of system status", score: 75, findingCount: 3 },
  { id: "H2", name: "Match between system and real world", score: 90, findingCount: 1 },
  { id: "H3", name: "User control and freedom", score: 65, findingCount: 4 },
  { id: "H4", name: "Consistency and standards", score: 85, findingCount: 2 },
  { id: "H5", name: "Error prevention", score: 70, findingCount: 3 },
];

export const Default: Story = {
  args: {
    title: "Checkout Flow Usability Audit",
    projectName: "E-Commerce Web Portal",
    overallScore: 78,
    criticalCount: 4,
    mediumCount: 6,
    goodCount: 12,
    heuristics: sampleHeuristics,
    className: "w-full max-w-4xl mx-auto",
  },
};

function EvaluationFixture({
  width,
  ...args
}: React.ComponentProps<typeof EvaluationSummaryReport> & { width: number }) {
  const [status, setStatus] = React.useState("");

  return (
    <div style={{ width }}>
      <span data-testid="reset-probe">reset probe</span>
      <output data-testid="status">{status}</output>
      <EvaluationSummaryReport
        {...args}
        data-testid="report"
        onShareReport={() => setStatus("share")}
        onExportPdf={() => setStatus("export")}
      />
    </div>
  );
}

const fixtureArgs = {
  title: "Checkout Flow Usability Audit",
  projectName: "E-Commerce Web Portal",
  overallScore: 78,
  criticalCount: 4,
  mediumCount: 6,
  goodCount: 12,
  heuristics: sampleHeuristics,
  className: "w-full",
};

export const Fixture: Story = {
  args: fixtureArgs,
  render: (args) => <EvaluationFixture {...args} width={760} />,
};

export const FixtureNarrow: Story = {
  args: fixtureArgs,
  render: (args) => <EvaluationFixture {...args} width={260} />,
};
