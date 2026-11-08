import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Separator } from "./separator";

describe("Separator Primitive Component", () => {
  it("renders horizontal separator by default", () => {
    render(<Separator aria-label="Section Divider" />);
    const sep = screen.getByRole("separator", { name: /section divider/i });
    expect(sep).toBeInTheDocument();
    expect(sep).toHaveClass("h-[1px]");
    expect(sep).toHaveClass("w-full");
  });

  it("renders vertical separator when orientation='vertical'", () => {
    render(<Separator orientation="vertical" aria-label="Inline Divider" />);
    const sep = screen.getByRole("separator", { name: /inline divider/i });
    expect(sep).toBeInTheDocument();
    expect(sep).toHaveClass("w-[1px]");
    expect(sep).toHaveClass("h-full");
  });

  it("forwards ref to the root DOM element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Separator ref={ref} aria-label="Ref Separator" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("merges custom className without dropping base styling", () => {
    render(<Separator className="my-custom-divider bg-primary" aria-label="Custom" />);
    const sep = screen.getByRole("separator");
    expect(sep).toHaveClass("my-custom-divider");
    expect(sep).toHaveClass("bg-primary");
  });
});
