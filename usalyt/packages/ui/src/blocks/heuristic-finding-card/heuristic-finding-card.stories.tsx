import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HeuristicFindingCard,
  type HeuristicFinding,
} from "./heuristic-finding-card";

const meta: Meta<typeof HeuristicFindingCard> = {
  title: "Blocks/HeuristicFindingCard",
  component: HeuristicFindingCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleFinding: HeuristicFinding = {
  id: "finding-h1-01",
  heuristicId: "H1",
  heuristicTitle: "Visibility of System Status",
  severity: "CRITICAL",
  rating: 4,
  selector: "button#complete-purchase.btn-primary",
  description:
    "El botón no muestra spinner ni estado de carga al procesar la transacción, provocando doble envío por parte del usuario.",
  createdAt: "2 Sep 2026",
  evaluatorName: "María R.",
};

export const Default: Story = {
  args: {
    finding: sampleFinding,
    className: "w-[calc(100vw_-_6rem)] lg:w-auto max-w-md",
  },
};

const screenshotDataUrl =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

const fixtureFinding: HeuristicFinding = {
  ...sampleFinding,
  description:
    "The button does not show a spinner or loading state while processing the transaction, causing double submission by the user.",
};

function FindingFixture({
  width,
  testId,
  withScreenshot,
  finding,
}: {
  width: number;
  testId: string;
  withScreenshot: boolean;
  finding: HeuristicFinding;
}) {
  const [status, setStatus] = React.useState("");
  const [copied, setCopied] = React.useState("");

  const readClipboard = async () => {
    try {
      const value = await navigator.clipboard.readText();
      setCopied(value ? "copied" : "empty");
    } catch {
      setCopied("failed");
    }
  };

  return (
    <div style={{ width }}>
      <output data-testid="status">{status}</output>
      <button type="button" data-testid="clipboard-read" onClick={readClipboard}>
        Read clipboard
      </button>
      <output data-testid="copied">{copied}</output>
      <HeuristicFindingCard
        finding={{
          ...finding,
          screenshotUrl: withScreenshot ? screenshotDataUrl : undefined,
        }}
        data-testid={testId}
        className="w-full"
        onEdit={() => setStatus("edit")}
        onDelete={() => setStatus("delete")}
        onViewScreenshot={() => setStatus("view-screenshot")}
      />
    </div>
  );
}

export const Fixture: Story = {
  args: { finding: fixtureFinding },
  render: (args) => (
    <FindingFixture
      width={760}
      testId="finding-with-screenshot"
      withScreenshot
      finding={args.finding ?? sampleFinding}
    />
  ),
};

export const FixtureNarrow: Story = {
  args: { finding: fixtureFinding },
  render: (args) => (
    <FindingFixture
      width={260}
      testId="finding-with-screenshot"
      withScreenshot
      finding={args.finding ?? sampleFinding}
    />
  ),
};

export const FixtureEmpty: Story = {
  args: { finding: fixtureFinding },
  render: (args) => (
    <FindingFixture
      width={760}
      testId="finding-without-screenshot"
      withScreenshot={false}
      finding={args.finding ?? sampleFinding}
    />
  ),
};
