import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Separator } from "./separator";

const meta: Meta<typeof Separator> = {
  title: "Primitives/Separator",
  component: Separator,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-full max-w-md space-y-4">
      <div>
        <h4 className="text-sm font-semibold">Design System Core</h4>
        <p className="text-xs text-muted-foreground">
          An open-source UI component library built with Base UI + Tailwind v4.
        </p>
      </div>
      <Separator orientation="horizontal" {...args} />
      <div className="flex h-5 items-center space-x-4 text-xs font-medium">
        <span>Components</span>
        <span>Documentation</span>
        <span>GitHub</span>
      </div>
    </div>
  ),
};

export const Default: Story = Horizontal;

export const Vertical: Story = {
  render: () => (
    <div className="flex h-6 items-center space-x-4 text-xs font-medium">
      <span>Dashboard</span>
      <Separator orientation="vertical" />
      <span>Analytics</span>
      <Separator orientation="vertical" />
      <span>Settings</span>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div className="w-full max-w-md space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator orientation="horizontal" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground font-semibold">
            Or Continue With
          </span>
        </div>
      </div>
    </div>
  ),
};
