import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Input } from "./input";
import { Label } from "../label";

describe("Input Primitive Component", () => {
  it("renders input element with placeholder", () => {
    render(<Input placeholder="Enter username" />);
    expect(screen.getByPlaceholderText("Enter username")).toBeInTheDocument();
  });

  it("handles user typing and invokes onChange", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input onChange={onChange} aria-label="Username" />);
    const input = screen.getByRole("textbox", { name: /username/i });
    await user.type(input, "hello");
    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("hello");
  });

  it("disables user input when disabled prop is set", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input disabled onChange={onChange} aria-label="Disabled input" />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    await user.type(input, "test");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("sets aria-invalid='true' and applies error styling when aria-invalid is true", () => {
    render(<Input aria-invalid="true" placeholder="Invalid field" />);
    const input = screen.getByPlaceholderText("Invalid field");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass("aria-invalid:border-destructive");
  });

  it("associates correctly with Label component via htmlFor", () => {
    render(
      <>
        <Label htmlFor="email-input">Email Address</Label>
        <Input id="email-input" type="email" />
      </>
    );

    const input = screen.getByLabelText("Email Address");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("type", "email");
  });

  it("applies size variant classes (sm, md, lg)", () => {
    const { unmount: u1 } = render(
      <Input inputSize="sm" placeholder="Small" />
    );
    expect(screen.getByPlaceholderText("Small")).toHaveClass("h-8");
    u1();

    const { unmount: u2 } = render(
      <Input inputSize="lg" placeholder="Large" />
    );
    expect(screen.getByPlaceholderText("Large")).toHaveClass("h-10");
    u2();
  });

  it("forwards ref to native HTMLInputElement", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.placeholder).toBe("Ref test");
  });
});
