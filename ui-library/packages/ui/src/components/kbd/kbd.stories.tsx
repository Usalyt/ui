import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Kbd } from "./kbd";

const meta: Meta<typeof Kbd> = {
  title: "Primitives/Kbd",
  component: Kbd,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Kbd>Alt+P</Kbd>
      <Kbd variant="outline">⌘K</Kbd>
      <Kbd variant="secondary">Esc</Kbd>
    </div>
  ),
};
