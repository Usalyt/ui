import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyStateBlock } from "./empty-state-block";
import { ClipboardCheck } from "lucide-react";

const meta: Meta<typeof EmptyStateBlock> = {
  title: "Blocks/EmptyStateBlock",
  component: EmptyStateBlock,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    icon: <ClipboardCheck className="h-6 w-6 text-primary" />,
    title: "No heuristic evaluations yet",
    description: "Inspect elements on the page or launch the extension to log your first findings.",
    actionLabel: "Launch Extension",
    secondaryActionLabel: "View Docs",
  },
};

export const LongLabels: Story = {
  render: () => (
    <div className="w-[320px] max-w-full">
      <EmptyStateBlock
        icon={<ClipboardCheck className="h-6 w-6 text-primary" />}
        title="No evaluations recorded for this workspace yet"
        description="Inspect elements on the host page or launch the extension to log the first findings for this evaluation."
        actionLabel="Launch the browser extension and start a new evaluation"
        secondaryActionLabel="Read the evaluation methodology guide"
        onAction={() => {}}
        onSecondaryAction={() => {}}
      />
    </div>
  ),
};
