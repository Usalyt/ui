import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toggle } from "./toggle";
import { Bold, Italic, Underline } from "lucide-react";

const meta: Meta<typeof Toggle> = {
  title: "Primitives/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    pressed: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    size: "md",
    "aria-label": "Toggle bold",
  },
  render: (args) => (
    <Toggle {...args}>
      <Bold className="h-4 w-4" />
      <span>Bold</span>
    </Toggle>
  ),
};

export const Pressed: Story = {
  args: {
    defaultPressed: true,
    variant: "default",
    "aria-label": "Toggle italic (pressed)",
  },
  render: (args) => (
    <Toggle {...args}>
      <Italic className="h-4 w-4" />
      <span>Italic</span>
    </Toggle>
  ),
};

export const Outline: Story = {
  args: {
    variant: "outline",
    "aria-label": "Toggle underline",
  },
  render: (args) => (
    <Toggle {...args}>
      <Underline className="h-4 w-4" />
      <span>Underline</span>
    </Toggle>
  ),
};

export const SmallSize: Story = {
  args: {
    size: "sm",
    variant: "outline",
    "aria-label": "Small toggle",
  },
  render: (args) => (
    <Toggle {...args}>
      <Bold className="h-3.5 w-3.5" />
    </Toggle>
  ),
};

export const LargeSize: Story = {
  args: {
    size: "lg",
    variant: "outline",
    "aria-label": "Large toggle",
  },
  render: (args) => (
    <Toggle {...args}>
      <Bold className="h-5 w-5" />
      <span>Bold Format</span>
    </Toggle>
  ),
};

export const DisabledState: Story = {
  args: {
    disabled: true,
    "aria-label": "Disabled toggle",
  },
  render: (args) => (
    <Toggle {...args}>
      <Bold className="h-4 w-4" />
      <span>Disabled</span>
    </Toggle>
  ),
};
