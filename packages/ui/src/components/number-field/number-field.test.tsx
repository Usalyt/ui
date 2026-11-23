import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { NumberField } from "./number-field";
import { Label } from "../label";

describe("NumberField Primitive Component", () => {
  it("renders number input field and stepper buttons", () => {
    render(
      <div>
        <Label htmlFor="qty">Quantity</Label>
        <NumberField id="qty" defaultValue={1} min={1} max={10} />
      </div>
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /increase/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease/i })
    ).toBeInTheDocument();
  });

  it("increments value on increment button click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberField
        defaultValue={1}
        onValueChange={onValueChange}
        aria-label="Amount"
      />
    );
    const incBtn = screen.getByRole("button", { name: /increase/i });
    await user.click(incBtn);
    expect(onValueChange).toHaveBeenCalled();
  });

  it("decrements value on decrement button click", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <NumberField
        defaultValue={5}
        onValueChange={onValueChange}
        aria-label="Items"
      />
    );
    const decBtn = screen.getByRole("button", { name: /decrease/i });
    await user.click(decBtn);
    expect(onValueChange).toHaveBeenCalled();
  });

  it("disables stepper controls when disabled prop is set", () => {
    render(<NumberField disabled defaultValue={2} aria-label="Disabled field" />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: /increase/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /decrease/i })).toBeDisabled();
  });

  it("merges custom className without losing base container styles", () => {
    const { container } = render(
      <NumberField defaultValue={1} className="my-custom-number-field" />
    );

    expect(container.firstChild).toHaveClass("my-custom-number-field");
  });

  it("forwards ref to root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<NumberField ref={ref} defaultValue={1} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
