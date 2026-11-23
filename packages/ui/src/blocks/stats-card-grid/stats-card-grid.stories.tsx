import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatsCardGrid, StatItem } from "./stats-card-grid";
import { Activity, AlertTriangle, CheckCircle2, Users } from "lucide-react";

const meta: Meta<typeof StatsCardGrid> = {
  title: "Blocks/StatsCardGrid",
  component: StatsCardGrid,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const dashboardStats: StatItem[] = [
  {
    id: "evals",
    title: "Evaluations Conducted",
    value: "3,842",
    change: "+18.2%",
    trend: "up",
    description: "vs previous quarter",
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: "critical",
    title: "Critical Severity Violations",
    value: "14",
    change: "-22.5%",
    trend: "down",
    description: "requires immediate fix",
    icon: <AlertTriangle className="h-4 w-4" />,
  },
  {
    id: "passed",
    title: "Good Practice Score",
    value: "94.8%",
    change: "+3.4%",
    trend: "up",
    description: "WCAG & Nielsen aligned",
    icon: <CheckCircle2 className="h-4 w-4" />,
  },
  {
    id: "team",
    title: "Active Team Members",
    value: "28",
    change: "0%",
    trend: "neutral",
    description: "collaborating live",
    icon: <Users className="h-4 w-4" />,
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-5xl p-4">
      <StatsCardGrid stats={dashboardStats} columns={4} />
    </div>
  ),
};

export const Empty: Story = {
  args: {
    stats: []
  }
};
