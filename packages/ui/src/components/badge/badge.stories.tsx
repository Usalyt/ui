import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge";
import { Check, Star, ShieldAlert } from "lucide-react";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "destructive",
        "pulse-green",
        "coral-red",
        "signal-teal",
        "iris-violet",
        "lavender",
        "acid-lime",
      ],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
    children: "Default Badge",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Badge",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Badge",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Destructive Badge",
  },
};

export const ChromaticAccents: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="pulse-green">Pulse Green</Badge>
      <Badge variant="coral-red">Coral Red</Badge>
      <Badge variant="signal-teal">Signal Teal</Badge>
      <Badge variant="iris-violet">Iris Violet</Badge>
      <Badge variant="lavender">Lavender</Badge>
      <Badge variant="acid-lime">Acid Lime</Badge>
    </div>
  ),
};

export const WithIcon: Story = {
  args: {
    variant: "secondary",
  },
  render: (args) => (
    <Badge {...args}>
      <Check className="h-3 w-3 text-pulse-green" />
      Verified
    </Badge>
  ),
};
