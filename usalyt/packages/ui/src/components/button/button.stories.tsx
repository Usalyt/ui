import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button";
import { Mail, ArrowRight } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "default",
        "secondary",
        "outline",
        "destructive",
        "ghost",
        "link",
        "pill",
      ],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "icon"],
    },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: "default",
    children: "Primary Button",
  },
};

export const Default: Story = Primary;

export const AcidLimeCTA: Story = {
  args: {
    variant: "default",
    children: "Action CTA",
  },
};

export const Pill: Story = {
  args: {
    variant: "pill",
    children: "Pill Action",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary Button",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline Button",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "Delete Account",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost Button",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Read Documentation",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    children: "Small Button",
  },
};

export const Medium: Story = {
  args: {
    size: "md",
    children: "Medium Button",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: "Large Button",
  },
};

export const IconOnly: Story = {
  args: {
    size: "icon",
    "aria-label": "Send Email",
  },
  render: (args) => (
    <Button {...args}>
      <Mail className="h-4 w-4" />
    </Button>
  ),
};

export const WithLeftIcon: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Button {...args}>
      <Mail className="h-4 w-4 shrink-0" />
      Send Message
    </Button>
  ),
};

export const LoadingState: Story = {
  args: {
    loading: true,
    children: "Saving Changes",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "Disabled Button",
  },
};
