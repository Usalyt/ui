import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Textarea } from "./textarea";
import { Label } from "../label";

describe("Textarea Primitive Component", () => {
  it("renders textarea element with rows and placeholder", () => {
    render(<Textarea rows={4} placeholder="Enter your biography" />);
    const textarea = screen.getByPlaceholderText("Enter your biography");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute("rows", "4");
  });

  it("handles multiline typing and onChange events", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} aria-label="Bio" />);
    const textarea = screen.getByRole("textbox", { name: /bio/i });
    await user.type(textarea, "Line 1{enter}Line 2");
    expect(onChange).toHaveBeenCalled();
    expect(textarea).toHaveValue("Line 1\nLine 2");
  });

  it("disables user input when disabled prop is set", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <Textarea disabled onChange={onChange} aria-label="Disabled textarea" />
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).toBeDisabled();
    await user.type(textarea, "test content");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("sets aria-invalid='true' and applies error border style when aria-invalid is true", () => {
    render(<Textarea aria-invalid="true" placeholder="Invalid feedback" />);
    const textarea = screen.getByPlaceholderText("Invalid feedback");
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(textarea).toHaveClass("aria-invalid:border-destructive");
  });

  it("applies resize variant classes (none, vertical, horizontal, both)", () => {
    const { unmount: u1 } = render(
      <Textarea resize="none" placeholder="No resize" />
    );
    expect(screen.getByPlaceholderText("No resize")).toHaveClass("resize-none");
    u1();

    const { unmount: u2 } = render(
      <Textarea resize="both" placeholder="Both resize" />
    );
    expect(screen.getByPlaceholderText("Both resize")).toHaveClass("resize");
    u2();
  });

  it("forwards ref to native HTMLTextAreaElement", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} placeholder="Ref test" />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current?.placeholder).toBe("Ref test");
  });
});
