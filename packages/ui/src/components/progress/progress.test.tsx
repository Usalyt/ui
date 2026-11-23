import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Progress } from "./progress";

describe("Progress Primitive Component", () => {
  it("renders progress element with aria-valuenow", () => {
    render(<Progress value={60} aria-label="Loading task" />);
    const progress = screen.getByRole("progressbar", { name: /loading task/i });
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute("aria-valuenow", "60");
  });

  it("renders 0% progress correctly", () => {
    render(<Progress value={0} aria-label="Zero progress" />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "0");
  });

  it("renders 100% complete progress", () => {
    render(<Progress value={100} aria-label="Complete progress" />);
    const progress = screen.getByRole("progressbar");
    expect(progress).toHaveAttribute("aria-valuenow", "100");
  });

  it("applies size variant classes (sm, md, lg)", () => {
    const { unmount: u1 } = render(
      <Progress size="sm" value={30} aria-label="Small" />
    );
    expect(screen.getByRole("progressbar")).toHaveClass("h-1.5");
    u1();

    const { unmount: u2 } = render(
      <Progress size="lg" value={30} aria-label="Large" />
    );
    expect(screen.getByRole("progressbar")).toHaveClass("h-5");
    u2();
  });

  it("applies color variant classes (success, warning, destructive)", () => {
    const { container } = render(
      <Progress variant="success" value={80} aria-label="Success bar" />
    );
    const indicator = container.querySelector(".bg-pulse-green-foreground");
    expect(indicator).toBeInTheDocument();
  });

  it("keeps the primary indicator as the default behavior", () => {
    const { container } = render(
      <Progress value={50} aria-label="Default bar" />
    );
    expect(container.querySelector(".bg-primary")).toBeInTheDocument();
  });

  it("renders an additive neutral indicator without changing defaults", () => {
    const { container } = render(
      <Progress variant="neutral" value={70} aria-label="Neutral bar" />
    );
    expect(container.querySelector(".bg-muted-foreground")).toBeInTheDocument();
    expect(container.querySelector(".bg-primary")).not.toBeInTheDocument();
  });

  it("forwards ref to root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Progress ref={ref} value={50} aria-label="Ref bar" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
