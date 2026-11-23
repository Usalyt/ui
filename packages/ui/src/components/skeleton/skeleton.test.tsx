import React, { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Skeleton } from "./skeleton";

describe("Skeleton Component", () => {
  it("renders with animate-pulse class and aria-hidden='true'", () => {
    const { container } = render(<Skeleton className="h-4 w-20" />);
    const el = container.firstChild as HTMLElement;

    expect(el).toHaveClass("animate-pulse");
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("applies background muted styling", () => {
    const { container } = render(<Skeleton className="h-10 w-10 rounded-full" />);
    const el = container.firstChild as HTMLElement;

    expect(el).toHaveClass("bg-muted/80");
    expect(el).toHaveClass("rounded-full");
  });

  it("forwards ref to the root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} className="h-4 w-32" />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("animate-pulse");
  });

  it("merges custom className without dropping base styling", () => {
    const { container } = render(
      <Skeleton className="my-custom-skeleton h-12 w-full" />
    );
    const el = container.firstChild as HTMLElement;

    expect(el).toHaveClass("my-custom-skeleton");
    expect(el).toHaveClass("h-12");
    expect(el).toHaveClass("w-full");
  });
});
