import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label";
import { Input } from "../input";

const meta: Meta<typeof Label> = {
  title: "Primitives/Label",
  component: Label,
  tags: ["autodocs"],
  argTypes: {
    required: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Username",
  },
};

export const WithRequiredAsterisk: Story = {
  args: {
    children: "Email Address",
    required: true,
  },
};

export const AssociatedInput: Story = {
  render: (args) => (
    <div className="w-full max-w-sm space-y-1.5">
      <Label htmlFor="storybook-email" required {...args}>
        Account Email
      </Label>
      <Input
        id="storybook-email"
        type="email"
        placeholder="alex@company.com"
      />
    </div>
  ),
};
