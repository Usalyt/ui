import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Kbd } from "./kbd";

describe("Kbd Primitive Component", () => {
  it("renders semantic <kbd> element with default styling", () => {
    render(<Kbd>Alt+P</Kbd>);
    const kbd = screen.getByText("Alt+P");
    expect(kbd).toBeInTheDocument();
    expect(kbd.tagName.toLowerCase()).toBe("kbd");
    expect(kbd).toHaveClass("font-mono");
  });

  it("applies variant and size classes", () => {
    render(
      <Kbd variant="outline" size="sm">
        ⌘K
      </Kbd>
    );
    const kbd = screen.getByText("⌘K");
    expect(kbd).toHaveClass("text-[10px]");
    expect(kbd).toHaveClass("border-border");
  });
});
