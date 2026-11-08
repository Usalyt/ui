import React, { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileInput } from "./file-input";

describe("FileInput Primitive Component", () => {
  it("renders upload label and hidden file input", () => {
    render(<FileInput aria-label="Upload document" />);
    expect(screen.getByText(/click to browse files/i)).toBeInTheDocument();
  });

  it("updates displayed file name on file selection", async () => {
    const user = userEvent.setup();
    render(<FileInput aria-label="Upload file" />);

    const file = new File(["content"], "document.pdf", {
      type: "application/pdf",
    });
    const input = screen.getByLabelText(/upload file/i) as HTMLInputElement;

    await user.upload(input, file);

    expect(input.files?.[0]).toBe(file);
    expect(screen.getByText("document.pdf")).toBeInTheDocument();
  });

  it("renders custom helper text when provided", () => {
    render(<FileInput helperText="PNG, JPG or PDF up to 10MB" />);
    expect(screen.getByText("PNG, JPG or PDF up to 10MB")).toBeInTheDocument();
  });

  it("displays error message when error prop is provided", () => {
    render(<FileInput error="Invalid file format selected." />);
    expect(
      screen.getByText("Invalid file format selected.")
    ).toBeInTheDocument();
  });

  it("disables input when disabled prop is true", () => {
    render(<FileInput disabled aria-label="Disabled input" />);
    const input = screen.getByLabelText(/disabled input/i) as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it("forwards ref to HTMLInputElement", () => {
    const ref = createRef<HTMLInputElement>();
    render(<FileInput ref={ref} aria-label="Ref input" />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("shows a visible focus state on the dropzone for keyboard users", async () => {
    const user = userEvent.setup();
    render(
      <>
        <FileInput aria-label="Upload file" />
        <button type="button">After</button>
      </>
    );

    await user.tab();

    const input = screen.getByLabelText(/upload file/i);
    expect(input).toHaveFocus();

    const dropzone = screen
      .getByText(/click to browse files/i)
      .closest("label");
    expect(dropzone).toHaveAttribute("data-focused", "true");
    expect(dropzone?.className).toContain("ring-2");

    await user.tab();
    expect(dropzone).not.toHaveAttribute("data-focused");
  });

  it("forwards focus handlers to the consumer", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<FileInput aria-label="Upload file" onFocus={onFocus} />);

    await user.tab();

    expect(onFocus).toHaveBeenCalledTimes(1);
  });
});
