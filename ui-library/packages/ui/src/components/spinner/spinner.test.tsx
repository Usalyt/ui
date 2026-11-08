import React, { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./spinner";

describe("Spinner Primitive Component", () => {
  it("renders with role='status' and accessible label", () => {
    render(<Spinner label="Processing..." />);
    const status = screen.getByRole("status");

    expect(status).toHaveAttribute("aria-label", "Processing...");
    expect(screen.getByText("Processing...")).toBeInTheDocument();
  });

  it("applies size variant classes (sm, md, lg, xl)", () => {
    const { unmount: u1 } = render(<Spinner size="sm" />);
    expect(screen.getByTestId("spinner-icon")).toHaveClass("h-4");
    u1();

    const { unmount: u2 } = render(<Spinner size="xl" />);
    expect(screen.getByTestId("spinner-icon")).toHaveClass("h-12");
    u2();
  });

  it("applies color variant classes (primary, destructive)", () => {
    const { unmount: u1 } = render(<Spinner variant="primary" />);
    expect(screen.getByTestId("spinner-icon")).toHaveClass("text-primary");
    u1();

    const { unmount: u2 } = render(<Spinner variant="destructive" />);
    expect(screen.getByTestId("spinner-icon")).toHaveClass("text-destructive");
    u2();
  });

  it("forwards ref to the root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Spinner ref={ref} label="Ref Spinner" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "status");
  });

  it("merges custom className without dropping base styling", () => {
    render(<Spinner className="my-custom-spinner text-emerald-500" />);
    const status = screen.getByRole("status");
    expect(status).toHaveClass("my-custom-spinner");
    expect(status).toHaveClass("text-emerald-500");
  });
});
