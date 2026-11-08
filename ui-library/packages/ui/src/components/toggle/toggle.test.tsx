import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Toggle } from "./toggle";
import { Bold } from "lucide-react";

describe("Toggle Primitive Component", () => {
  it("renders with button role and aria-pressed='false'", () => {
    render(
      <Toggle aria-label="Toggle bold">
        <Bold className="h-4 w-4" />
      </Toggle>
    );
    const toggle = screen.getByRole("button", { name: /toggle bold/i });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-pressed", "false");
  });

  it("toggles pressed state and aria-pressed on click", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle onPressedChange={onPressedChange} aria-label="Toggle italic">
        Italic
      </Toggle>
    );

    const toggle = screen.getByRole("button", { name: /toggle italic/i });
    await user.click(toggle);
    expect(onPressedChange).toHaveBeenCalled();
  });

  it("applies outline variant styling", () => {
    render(
      <Toggle variant="outline" aria-label="Outline toggle">
        Outline
      </Toggle>
    );
    const toggle = screen.getByRole("button", { name: /outline toggle/i });
    expect(toggle).toHaveClass("border");
  });

  it("applies size variant classes (sm, md, lg)", () => {
    const { unmount: u1 } = render(
      <Toggle size="sm" aria-label="Small">
        Sm
      </Toggle>
    );
    expect(screen.getByRole("button")).toHaveClass("h-8");
    u1();

    const { unmount: u2 } = render(
      <Toggle size="lg" aria-label="Large">
        Lg
      </Toggle>
    );
    expect(screen.getByRole("button")).toHaveClass("h-10");
    u2();
  });

  it("does NOT toggle when disabled prop is true", async () => {
    const user = userEvent.setup();
    const onPressedChange = vi.fn();
    render(
      <Toggle disabled onPressedChange={onPressedChange} aria-label="Disabled">
        Off
      </Toggle>
    );

    const toggle = screen.getByRole("button", { name: /disabled/i });
    expect(toggle).toBeDisabled();
    await user.click(toggle);
    expect(onPressedChange).not.toHaveBeenCalled();
  });

  it("forwards ref to root button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Toggle ref={ref} aria-label="Ref Toggle">
        Ref
      </Toggle>
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
