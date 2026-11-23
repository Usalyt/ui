import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsCardGrid, StatItem } from "./stats-card-grid";

const mockStats: StatItem[] = [
  {
    id: "evals",
    title: "Total Evaluations",
    value: "1,248",
    change: "+12.5%",
    trend: "up",
    description: "from last month",
  },
  {
    id: "issues",
    title: "Critical Usability Issues",
    value: "42",
    change: "-4.1%",
    trend: "down",
    description: "resolved this week",
  },
];

describe("StatsCardGrid Block Component", () => {
  it("renders stat items with titles, values, and trends", () => {
    render(<StatsCardGrid stats={mockStats} />);

    expect(screen.getByText("Total Evaluations")).toBeInTheDocument();
    expect(screen.getByText("1,248")).toBeInTheDocument();
    expect(screen.getByText("+12.5%")).toBeInTheDocument();

    expect(screen.getByText("Critical Usability Issues")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("-4.1%")).toBeInTheDocument();
  });

  it("applies responsive grid columns class based on columns prop", () => {
    const { container } = render(
      <StatsCardGrid stats={mockStats} columns={4} className="my-stats-grid" />
    );

    const gridEl = container.firstChild as HTMLElement;
    expect(gridEl).toHaveClass("my-stats-grid");
    expect(gridEl).toHaveClass("lg:grid-cols-4");
  });

  it("renders an empty state when no stats are available", () => {
    render(<StatsCardGrid stats={[]} />);

    expect(screen.getByText(/no metrics available/i)).toBeInTheDocument();
  });
});
