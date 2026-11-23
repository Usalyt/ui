import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./spinner";
import { Button } from "../button";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
    variant: {
      control: "select",
      options: ["default", "primary", "secondary", "destructive"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: "md",
    label: "Loading content...",
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" label="Small spinner" />
      <Spinner size="md" label="Medium spinner" />
      <Spinner size="lg" label="Large spinner" />
      <Spinner size="xl" label="Extra large spinner" />
    </div>
  ),
};

export const ColorVariants: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner variant="default" label="Default spinner" />
      <Spinner variant="primary" label="Primary spinner" />
      <Spinner variant="destructive" label="Destructive spinner" />
    </div>
  ),
};

export const InsideButton: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button disabled variant="default">
        <Spinner size="sm" variant="secondary" className="mr-2" />
        Processing Order
      </Button>
      <Button disabled variant="outline">
        <Spinner size="sm" variant="primary" className="mr-2" />
        Syncing Data
      </Button>
    </div>
  ),
};