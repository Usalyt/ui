import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";
import { Button } from "../button";

const meta: Meta<typeof Alert> = {
  title: "Primitives/Alert",
  component: Alert,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "destructive", "success", "warning"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <Info className="h-4 w-4" />
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>System maintenance is scheduled for midnight UTC.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <XCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>Your session has expired. Please sign in again.</AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  args: {
    variant: "success",
  },
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <CheckCircle2 className="h-4 w-4 text-pulse-green-foreground" />
      <AlertTitle>Success</AlertTitle>
      <AlertDescription>Your changes have been saved successfully.</AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  args: {
    variant: "warning",
  },
  render: (args) => (
    <Alert {...args} className="max-w-lg">
      <AlertTriangle className="h-4 w-4 text-signal-teal-foreground" />
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>Storage limit is at 90% capacity.</AlertDescription>
    </Alert>
  ),
};

export const WithAction: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <Alert {...args} className="max-w-lg flex items-center justify-between">
      <div>
        <Info className="h-4 w-4" />
        <AlertTitle>Update Available</AlertTitle>
        <AlertDescription>Version 2.0 is now ready to install.</AlertDescription>
      </div>
      <Button size="sm" variant="outline" className="ml-4 shrink-0">
        Update Now
      </Button>
    </Alert>
  ),
};
