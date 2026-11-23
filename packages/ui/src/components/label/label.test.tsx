import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Label } from "./label";
import { Input } from "../input";

describe("Label Primitive Component", () => {
  it("renders label element with children text", () => {
    render(<Label>Username</Label>);
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("focuses associated input element on label click", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Label htmlFor="user-input">User Name</Label>
        <Input id="user-input" />
      </div>
    );
    await user.click(screen.getByText("User Name"));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("renders required indicator when required prop is true", () => {
    render(<Label required>Email Address</Label>);
    const label = screen.getByText("Email Address");
    expect(label).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByText("*")).toHaveClass("text-destructive");
  });

  it("forwards ref to the native HTMLLabelElement", () => {
    const ref = createRef<HTMLLabelElement>();
    render(<Label ref={ref}>Ref Label</Label>);
    expect(ref.current).toBeInstanceOf(HTMLLabelElement);
  });

  it("merges custom className without overriding base styles", () => {
    render(<Label className="text-lg text-primary">Custom Label</Label>);
    const label = screen.getByText("Custom Label");
    expect(label).toHaveClass("text-lg");
    expect(label).toHaveClass("text-primary");
    expect(label).toHaveClass("font-medium");
  });
});
