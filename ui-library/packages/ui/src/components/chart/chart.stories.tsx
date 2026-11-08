import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartContainer, ChartLegend, ChartEmptyState } from "./chart";

const meta: Meta<typeof ChartContainer> = {
  title: "Primitives/Chart",
  component: ChartContainer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <ChartContainer
        title="Monthly Revenue Overview"
        description="Comparing Q1 vs Q2 recurring revenue stream."
      >
        <div className="h-40 w-full flex items-center justify-center border border-dashed rounded-lg text-xs text-muted-foreground">
          [SVG Chart Area]
        </div>
        <ChartLegend
          items={[
            { label: "Q1 Revenue", color: "#3b82f6" },
            { label: "Q2 Revenue", color: "#10b981" },
          ]}
        />
      </ChartContainer>
    </div>
  ),
};

export const BarChartExample: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <ChartContainer
        title="Active User Conversion"
        description="Daily active signups per channel."
      >
        <div className="h-40 w-full flex items-end justify-around p-4 border border-dashed rounded-lg">
          <div className="w-8 bg-primary rounded-t-md h-24" />
          <div className="w-8 bg-pulse-green rounded-t-md h-32" />
          <div className="w-8 bg-signal-teal rounded-t-md h-16" />
          <div className="w-8 bg-iris-violet rounded-t-md h-28" />
        </div>
        <ChartLegend
          items={[
            { label: "Organic Search", color: "#3b82f6" },
            { label: "Referrals", color: "#10b981" },
            { label: "Social", color: "#f59e0b" },
          ]}
        />
      </ChartContainer>
    </div>
  ),
};

export const EmptyState: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <ChartContainer
        title="Analytics Breakdown"
        description="No events recorded for this selected time window."
      >
        <ChartEmptyState message="No analytical data recorded in the last 24 hours." />
      </ChartContainer>
    </div>
  ),
};
