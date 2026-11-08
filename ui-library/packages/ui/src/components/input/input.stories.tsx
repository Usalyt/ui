import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input";
import { Label } from "../label";
import { Search, Mail, Lock } from "lucide-react";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    inputSize: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["text", "email", "password", "number"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Enter text...",
    "aria-label": "Text input",
  },
};

export const WithLabelAndHelper: Story = {
  render: (args) => (
    <div className="w-full max-w-sm space-y-1.5">
      <Label htmlFor="email" className="text-sm font-semibold text-foreground">
        Email Address
      </Label>
      <Input
        id="email"
        type="email"
        placeholder="name@example.com"
        {...args}
      />
      <p className="text-xs text-muted-foreground">
        We will send your order receipt to this address.
      </p>
    </div>
  ),
};

export const InvalidState: Story = {
  render: (args) => (
    <div className="w-full max-w-sm space-y-1.5">
      <Label
        htmlFor="invalid-email"
        className="text-sm font-semibold text-destructive"
      >
        Email Address
      </Label>
      <Input
        id="invalid-email"
        type="email"
        aria-invalid="true"
        defaultValue="invalid-email-format"
        {...args}
      />
      <p className="text-xs text-destructive">
        Please enter a valid email address.
      </p>
    </div>
  ),
};

export const DisabledState: Story = {
  render: (args) => (
    <div className="w-full max-w-sm space-y-1.5">
      <Label
        htmlFor="disabled-input"
        className="text-sm font-semibold text-muted-foreground"
      >
        Disabled Field
      </Label>
      <Input
        id="disabled-input"
        disabled
        value="admin@internal.system"
        {...args}
      />
    </div>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <div className="w-full max-w-sm space-y-1.5">
      <Label htmlFor="search" className="text-sm font-semibold">
        Search Component
      </Label>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          id="search"
          placeholder="Search components..."
          className="pl-9"
          {...args}
        />
      </div>
    </div>
  ),
};

export const Small: Story = {
  args: {
    inputSize: "sm",
    placeholder: "Small input (h-8)...",
    "aria-label": "Small text input",
  },
};

export const Large: Story = {
  args: {
    inputSize: "lg",
    placeholder: "Large input (h-10)...",
    "aria-label": "Large text input",
  },
};

export const LinearCarbonInput: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-1.5">
      <Label htmlFor="linear-input" className="text-sm font-medium text-foreground">
        Issue Title
      </Label>
      <Input
        id="linear-input"
        placeholder="Linear style input..."
        defaultValue="ENG-2703: Implement Linear design tokens"
      />
      <p className="text-xs text-muted-foreground">
        Uses translucent background, Fog placeholder, and semantic focus ring.
      </p>
    </div>
  ),
};
