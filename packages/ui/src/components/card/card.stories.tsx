import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import { Button } from "../button";
import { Badge } from "../badge";
import { Input } from "../input";
import { Label } from "../label";
import { TrendingUp, Bell, Check } from "lucide-react";

const meta: Meta<typeof Card> = {
  title: "Primitives/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Monthly Active Users</CardTitle>
          <Badge variant="pulse-green" className="gap-1">
            <TrendingUp className="h-3 w-3" /> +12.4%
          </Badge>
        </div>
        <CardDescription>
          Metrics calculated for the last 30 days of active platform sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-extrabold tracking-tight font-mono">
          14,280
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Compared to 12,700 in the previous billing cycle.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="outline" size="sm">
          View Report
        </Button>
        <Button variant="default" size="sm">
          Export Data
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const InteractiveCard: Story = {
  render: () => (
    <Card className="w-[380px] hover:border-primary/50 cursor-pointer transition-all">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Bell className="h-5 w-5 text-primary" />
          <div>
            <CardTitle className="text-base">Push Notifications</CardTitle>
            <CardDescription className="text-xs">
              Receive real-time alerts on your device.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
    </Card>
  ),
};

export const FormCard: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <CardTitle>Create Project</CardTitle>
        <CardDescription>
          Deploy your new project in one click.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="card-name">Project Name</Label>
          <Input id="card-name" placeholder="My Awesome Project" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="card-framework">Framework</Label>
          <Input id="card-framework" defaultValue="Next.js 15" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <Button variant="ghost">Cancel</Button>
        <Button variant="default" className="gap-2">
          <Check className="h-4 w-4" /> Deploy
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const SubtleCard: Story = {
  render: () => (
    <Card variant="subtle" className="w-[380px]">
      <CardHeader>
        <CardTitle className="text-base">Subtle Inset Card</CardTitle>
        <CardDescription className="text-xs">
          Nested card surface on carbon background with 6px radius.
        </CardDescription>
      </CardHeader>
    </Card>
  ),
};
