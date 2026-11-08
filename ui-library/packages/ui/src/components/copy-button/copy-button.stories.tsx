import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CopyButton } from "./copy-button";

const meta: Meta<typeof CopyButton> = {
  title: "Primitives/CopyButton",
  component: CopyButton,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 w-fit">
      <code className="text-xs font-mono">pnpm add tu-ui</code>
      <CopyButton value="pnpm add tu-ui" />
    </div>
  ),
};
