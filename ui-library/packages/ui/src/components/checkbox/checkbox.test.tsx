import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Checkbox } from "./checkbox";
import { Label } from "../label";

describe("Checkbox Primitive Component", () => {
  it("renders with correct checkbox role and label", () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(
      screen.getByRole("checkbox", { name: /accept terms/i })
    ).toBeInTheDocument();
  });

  it("toggles checked state on user click", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox onCheckedChange={onCheckedChange} aria-label="Toggle me" />
    );
    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it("renders as checked when checked prop is true", () => {
    render(<Checkbox checked aria-label="Always checked" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
    expect(screen.getByTestId("checkbox-check-icon")).toBeInTheDocument();
  });

  it("renders checked with defaultChecked (uncontrolled passthrough)", () => {
    // Regression: the wrapper used to pass `checked={false}` in uncontrolled
    // usage, silently overriding defaultChecked so the docs "Checked" row
    // rendered unchecked — the owner's broken preview.
    render(<Checkbox defaultChecked aria-label="Pre-checked" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();
    const root = screen.getByRole("checkbox");
    expect(root).toHaveAttribute("data-checked");
    expect(screen.getByTestId("checkbox-check-icon")).toBeInTheDocument();
  });

  it("paints in-system states: primary fill when checked, hairline at rest, 50% disabled", () => {
    // Checked: token fill + visible glyph, never a native input chrome.
    const { unmount } = render(<Checkbox defaultChecked aria-label="Contract" />);
    const checked = screen.getByRole("checkbox");
    expect(checked).toHaveAttribute("data-checked");
    expect(checked.className).toContain("data-[checked]:bg-primary");
    expect(checked.className).toContain("data-[checked]:text-primary-foreground");
    expect(screen.getByTestId("checkbox-check-icon")).toBeInTheDocument();
    unmount();

    render(<Checkbox aria-label="Contract rest" />);
    const unchecked = screen.getByRole("checkbox");
    expect(unchecked).toHaveAttribute("data-unchecked");
    // At rest the box is a hairline (no fill, no glyph).
    expect(unchecked.className).not.toContain("data-[unchecked]:bg-primary");
    expect(unchecked.className).toContain("disabled:opacity-50");
    unmount();

    render(<Checkbox disabled aria-label="Contract disabled" />);
    const disabled = screen.getByRole("checkbox", { name: "Contract disabled" });
    expect(disabled).toHaveAttribute("aria-disabled", "true");
  });

  it("supports indeterminate mixed state with aria-checked='mixed'", () => {
    render(<Checkbox indeterminate aria-label="Indeterminate selection" />);
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-checked", "mixed");
    expect(screen.getByTestId("checkbox-minus-icon")).toBeInTheDocument();
  });

  it("is togglable with Space key when focused", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox
        onCheckedChange={onCheckedChange}
        aria-label="Keyboard checkbox"
      />
    );
    const checkbox = screen.getByRole("checkbox");
    checkbox.focus();
    expect(checkbox).toHaveFocus();
    await user.keyboard(" ");
    expect(onCheckedChange).toHaveBeenCalled();
  });

  it("does NOT toggle when disabled", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <Checkbox disabled onCheckedChange={onCheckedChange} aria-label="Disabled" />
    );
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("aria-disabled", "true");
    await user.click(checkbox);
    expect(onCheckedChange).not.toHaveBeenCalled();
  });

  it("associates with Label component via htmlFor", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <div className="flex items-center gap-2">
        <Checkbox id="terms" onCheckedChange={onCheckedChange} />
        <Label htmlFor="terms">I accept terms and conditions</Label>
      </div>
    );

    const label = screen.getByText("I accept terms and conditions");
    await user.click(label);
    expect(onCheckedChange).toHaveBeenCalled();
  });
});
