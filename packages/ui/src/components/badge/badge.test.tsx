import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge";
import { Check } from "lucide-react";

describe("Badge Primitive Component", () => {
  it("renders badge with default variant styling", () => {
    render(<Badge>Default Badge</Badge>);
    const badge = screen.getByText("Default Badge");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-primary");
    expect(badge).toHaveClass("text-primary-foreground");
  });

  it("renders secondary variant with proper CSS classes", () => {
    render(<Badge variant="secondary">Secondary Badge</Badge>);
    const badge = screen.getByText("Secondary Badge");
    expect(badge).toHaveClass("bg-secondary");
    expect(badge).toHaveClass("text-secondary-foreground");
  });

  it("renders destructive variant with proper CSS classes", () => {
    render(<Badge variant="destructive">Error</Badge>);
    const badge = screen.getByText("Error");
    expect(badge).toHaveClass("bg-destructive");
    expect(badge).toHaveClass("text-destructive-foreground");
  });

  it("renders outline variant with proper CSS classes", () => {
    render(<Badge variant="outline">Outline Badge</Badge>);
    const badge = screen.getByText("Outline Badge");
    expect(badge).toHaveClass("border-border");
    expect(badge).toHaveClass("bg-background");
  });

  it("forwards ref to root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Badge ref={ref}>Ref Badge</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveTextContent("Ref Badge");
  });

  it("merges custom className without overriding base styles", () => {
    render(<Badge className="uppercase tracking-wider">Custom Badge</Badge>);
    const badge = screen.getByText("Custom Badge");
    expect(badge).toHaveClass("uppercase");
    expect(badge).toHaveClass("tracking-wider");
    expect(badge).toHaveClass("rounded-sm");
  });

  it("renders chromatic supporting accent variants (pulse-green, coral-red, signal-teal)", () => {
    const { unmount: u1 } = render(<Badge variant="pulse-green">Active</Badge>);
    const greenBadge = screen.getByText("Active");
    expect(greenBadge).toHaveClass("text-pulse-green-foreground");
    expect(greenBadge).toHaveClass("rounded-sm");
    u1();

    const { unmount: u2 } = render(<Badge variant="coral-red">Issue</Badge>);
    const redBadge = screen.getByText("Issue");
    expect(redBadge).toHaveClass("text-coral-red-foreground");
    u2();

    render(<Badge variant="signal-teal">Telemetry</Badge>);
    expect(screen.getByText("Telemetry")).toHaveClass("text-signal-teal-foreground");
  });

  it("renders with embedded icon and preserves text content", () => {
    render(
      <Badge variant="secondary">
        <Check data-testid="badge-icon" className="h-3 w-3" />
        Verified
      </Badge>
    );

    expect(screen.getByTestId("badge-icon")).toBeInTheDocument();
    expect(screen.getByText("Verified")).toBeInTheDocument();
  });
});
