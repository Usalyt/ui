import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Switch } from "./switch";
import { Label } from "../label";

describe("Switch Primitive Component", () => {
  it("renders switch element with correct role and attributes", () => {
    render(<Switch aria-label="Enable notifications" />);
    const toggle = screen.getByRole("switch", {
      name: /enable notifications/i,
    });
    expect(toggle).toBeInTheDocument();
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("toggles state and invokes onCheckedChange when clicked", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch onCheckedChange={onCheckedChange} aria-label="Dark Mode" />
    );
    const toggle = screen.getByRole("switch");
    await user.click(toggle);
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it("renders as checked when checked prop is true", () => {
    render(<Switch checked aria-label="Always active" />);
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("toggles state with Space key when focused", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch onCheckedChange={onCheckedChange} aria-label="Keyboard switch" />
    );
    const toggle = screen.getByRole("switch");
    toggle.focus();
    expect(toggle).toHaveFocus();
    await user.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it("does NOT toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Switch disabled onCheckedChange={onCheckedChange} aria-label="Disabled" />
    );
    const toggle = screen.getByRole("switch");
    expect(toggle).toHaveAttribute("aria-disabled", "true");
    await user.click(toggle);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("associates with Label component via htmlFor", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <div className="flex items-center gap-2">
        <Switch id="wifi" onCheckedChange={onCheckedChange} />
        <Label htmlFor="wifi">Enable Wi-Fi</Label>
      </div>
    );

    const label = screen.getByText("Enable Wi-Fi");
    await user.click(label);
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it("forwards ref to root DOM element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Switch ref={ref} aria-label="Ref Switch" />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveAttribute("role", "switch");
  });
});
