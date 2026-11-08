import React from "react";
import { StatsCardGrid } from "tu-ui";

const stats = [
  { id: "1", title: "Total Revenue", value: "$45,231.89", change: "+20.1%", trend: "up" as const, description: "from last month" },
  { id: "2", title: "Subscriptions", value: "+2,350", change: "+180.1%", trend: "up" as const, description: "from last month" },
  { id: "3", title: "Active Now", value: "+573", change: "+201", trend: "up" as const, description: "since last hour" },
];

export function StatsCardGridDemo() {
  return <StatsCardGrid stats={stats} columns={3} />;
}
