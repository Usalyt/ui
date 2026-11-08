import React, { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChartContainer, ChartLegend, ChartEmptyState } from "./chart";

describe("Chart Component", () => {
  it("renders container with role='img' and legend items", () => {
    const legendItems = [
      { label: "Revenue", color: "#10b981" },
      { label: "Expenses", color: "#ef4444" },
    ];

    render(
      <ChartContainer
        title="Quarterly Financials"
        description="Q1-Q4 breakdown"
      >
        <svg height="100" width="100">
          <circle cx="50" cy="50" r="40" fill="green" />
        </svg>
        <ChartLegend items={legendItems} />
      </ChartContainer>
    );

    expect(
      screen.getByRole("img", { name: "Quarterly Financials" })
    ).toBeInTheDocument();
    expect(screen.getByText("Q1-Q4 breakdown")).toBeInTheDocument();
    expect(screen.getByText("Revenue")).toBeInTheDocument();
    expect(screen.getByText("Expenses")).toBeInTheDocument();
  });

  it("renders ChartEmptyState message when no data is present", () => {
    render(<ChartEmptyState message="No sales data found for this range" />);
    expect(
      screen.getByText("No sales data found for this range")
    ).toBeInTheDocument();
  });

  it("applies custom className to ChartContainer root", () => {
    const { container } = render(
      <ChartContainer className="my-custom-chart p-8">
        <div>Chart Mock</div>
      </ChartContainer>
    );

    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("my-custom-chart");
    expect(el).toHaveClass("p-8");
  });

  it("renders color swatch for each legend item", () => {
    const items = [{ label: "Active", color: "#3b82f6" }];
    const { container } = render(<ChartLegend items={items} />);

    const swatch = container.querySelector('span[aria-hidden="true"]');
    expect(swatch).toBeInTheDocument();
    expect(swatch).toHaveStyle("background-color: #3b82f6");
  });

  it("forwards ref to ChartContainer and ChartLegend elements", () => {
    const containerRef = createRef<HTMLDivElement>();
    const legendRef = createRef<HTMLDivElement>();

    render(
      <ChartContainer ref={containerRef} title="Ref Chart">
        <ChartLegend ref={legendRef} items={[{ label: "Val", color: "#000" }]} />
      </ChartContainer>
    );

    expect(containerRef.current).toBeInstanceOf(HTMLDivElement);
    expect(legendRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
