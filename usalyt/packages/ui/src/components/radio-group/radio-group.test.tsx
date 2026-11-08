import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "../label";

describe("RadioGroup Primitive Component", () => {
  it("renders radio group items with radiogroup role", () => {
    render(
      <RadioGroup defaultValue="option-one" aria-label="Options">
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-one" id="r1" />
          <Label htmlFor="r1">Option One</Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="option-two" id="r2" />
          <Label htmlFor="r2">Option Two</Label>
        </div>
      </RadioGroup>
    );
    expect(
      screen.getByRole("radiogroup", { name: /options/i })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("selects radio item on click and triggers onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={onValueChange} aria-label="Selection">
        <RadioGroupItem value="a" aria-label="Option A" />
        <RadioGroupItem value="b" aria-label="Option B" />
      </RadioGroup>
    );
    const radioB = screen.getByRole("radio", { name: /option b/i });
    await user.click(radioB);
    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChange.mock.calls[0][0]).toBe("b");
  });

  it("renders dot indicator when option is checked", () => {
    render(
      <RadioGroup defaultValue="active" aria-label="Status">
        <RadioGroupItem value="active" aria-label="Active" />
      </RadioGroup>
    );
    const radio = screen.getByRole("radio", { name: /active/i });
    expect(radio).toBeChecked();
    expect(screen.getByTestId("radio-dot")).toBeInTheDocument();
  });

  it("disables option when disabled prop is set", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={onValueChange} aria-label="Disabled test">
        <RadioGroupItem value="enabled" aria-label="Enabled option" />
        <RadioGroupItem disabled value="disabled" aria-label="Disabled option" />
      </RadioGroup>
    );
    const disabledRadio = screen.getByRole("radio", {
      name: /disabled option/i,
    });
    expect(disabledRadio).toHaveAttribute("aria-disabled", "true");
    await user.click(disabledRadio);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("associates with Label via click delegation", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup onValueChange={onValueChange}>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="email" id="email-opt" />
          <Label htmlFor="email-opt">Email Notifications</Label>
        </div>
      </RadioGroup>
    );

    const label = screen.getByText("Email Notifications");
    await user.click(label);
    expect(onValueChange).toHaveBeenCalled();
    expect(onValueChange.mock.calls[0][0]).toBe("email");
  });

  it("forwards ref to RadioGroup root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <RadioGroup ref={ref} aria-label="Ref Radio">
        <RadioGroupItem value="val" aria-label="Val" />
      </RadioGroup>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("grid");
  });
});

// ---------------------------------------------------------------------------
// DESIGN.md token contract (task 15 — Redesign Workstream).
//
// RED before the redesign: every item ring rendered in `primary` (acid lime in
// dark theme) whether checked or not, the checked fill was a lucide <Circle>
// inside a `font-bold` wrapper, and the group used `gap-2`.
// ---------------------------------------------------------------------------
describe("RadioGroup DESIGN.md token contract (task 15)", () => {
  const classesOf = (element: Element) => element.className.split(/\s+/);

  it("renders unchecked items with a neutral hairline and no unconditional primary border", () => {
    render(
      <RadioGroup aria-label="Unchecked">
        <RadioGroupItem value="alpha" aria-label="Alpha" />
      </RadioGroup>
    );

    const radio = screen.getByRole("radio", { name: /alpha/i });
    const classes = classesOf(radio);

    expect(classes).toContain("border-smoke");
    expect(
      classes,
      "the unchecked ring must be a neutral hairline, never an unconditional border-primary",
    ).not.toContain("border-primary");
    expect(classes).not.toContain("bg-primary");
  });

  it("binds the checked state to the token fill and keeps the radio-dot indicator", () => {
    render(
      <RadioGroup defaultValue="alpha" aria-label="Checked">
        <RadioGroupItem value="alpha" aria-label="Alpha" />
      </RadioGroup>
    );

    const radio = screen.getByRole("radio", { name: /alpha/i });
    expect(radio).toBeChecked();
    expect(radio).toHaveAttribute("data-checked");
    expect(radio.className).toContain("data-checked:border-primary");
    expect(radio.className).toContain("data-checked:bg-primary");

    const dot = screen.getByTestId("radio-dot");
    expect(dot.tagName).toBe("SPAN");
    expect(dot.className).toContain("rounded-full");
    expect(dot.className).toContain("bg-primary-foreground");
  });

  it("keeps the compact 2.5 gap rhythm on the group", () => {
    render(
      <RadioGroup aria-label="Rhythm">
        <RadioGroupItem value="alpha" aria-label="Alpha" />
      </RadioGroup>
    );

    expect(screen.getByRole("radiogroup", { name: /rhythm/i })).toHaveClass(
      "gap-2.5"
    );
  });
});
