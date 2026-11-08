import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Progress } from "./progress";

const meta: Meta<typeof Progress> = {
  title: "Primitives/Progress",
  component: Progress,
  tags: ["autodocs"],
  argTypes: {
    value: { control: { type: "range", min: 0, max: 100, step: 1 } },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    variant: {
      control: "select",
      options: ["default", "neutral", "success", "warning", "destructive"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 65,
    "aria-label": "Upload Progress",
  },
  render: (args) => (
    <div className="w-full max-w-md space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span>Uploading build artifact...</span>
        <span className="font-mono">{args.value}%</span>
      </div>
      <Progress {...args} />
    </div>
  ),
};

export const LowValue: Story = {
  args: {
    value: 15,
  },
  render: (args) => (
    <div className="w-full max-w-md space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span>Initializing system...</span>
        <span>15%</span>
      </div>
      <Progress {...args} />
    </div>
  ),
};

export const HalfwayValue: Story = {
  args: {
    value: 50,
  },
  render: (args) => (
    <div className="w-full max-w-md space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span>Processing files...</span>
        <span>50%</span>
      </div>
      <Progress {...args} />
    </div>
  ),
};

export const Completed: Story = {
  args: {
    value: 100,
    variant: "success",
  },
  render: (args) => (
    <div className="w-full max-w-md space-y-2">
      <div className="flex justify-between text-xs font-medium text-pulse-green-foreground">
        <span>Export completed!</span>
        <span>100%</span>
      </div>
      <Progress {...args} />
    </div>
  ),
};

export const NeutralVariant: Story = {
  args: {
    value: 65,
    variant: "neutral",
  },
  render: (args) => (
    <div className="w-full max-w-md space-y-2">
      <div className="flex justify-between text-xs font-medium">
        <span>Usability score</span>
        <span>{args.value}%</span>
      </div>
      <Progress {...args} />
    </div>
  ),
};

export const WarningVariant: Story = {
  args: {
    value: 85,
    variant: "warning",
  },
  render: (args) => (
    <div className="w-full max-w-md space-y-2">
      <div className="flex justify-between text-xs font-medium text-signal-teal-foreground">
        <span>Storage limit warning</span>
        <span>85%</span>
      </div>
      <Progress {...args} />
    </div>
  ),
};

export const DestructiveVariant: Story = {
  args: {
    value: 95,
    variant: "destructive",
  },
  render: (args) => (
    <div className="w-full max-w-md space-y-2">
      <div className="flex justify-between text-xs font-medium text-destructive">
        <span>Memory usage critical</span>
        <span>95%</span>
      </div>
      <Progress {...args} />
    </div>
  ),
};
