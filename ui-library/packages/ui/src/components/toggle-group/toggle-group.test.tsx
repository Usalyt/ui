import React, { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

describe("ToggleGroup Primitive Component", () => {
  it("renders toggle group items", () => {
    render(
      <ToggleGroup aria-label="Text Formatting">
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          Italic
        </ToggleGroupItem>
      </ToggleGroup>
    );
    expect(
      screen.getByRole("button", { name: "Toggle bold" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Toggle italic" })
    ).toBeInTheDocument();
  });

  it("handles single selection mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup value={["align-left"]} onValueChange={onValueChange}>
        <ToggleGroupItem value="align-left" aria-label="Align left">
          Left
        </ToggleGroupItem>
        <ToggleGroupItem value="align-center" aria-label="Align center">
          Center
        </ToggleGroupItem>
      </ToggleGroup>
    );

    const centerBtn = screen.getByRole("button", { name: "Align center" });
    await user.click(centerBtn);
    expect(onValueChange).toHaveBeenCalled();
  });

  it("handles multiple selection mode", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        value={["bold"]}
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="bold" aria-label="Bold">
          Bold
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          Italic
        </ToggleGroupItem>
      </ToggleGroup>
    );

    const italicBtn = screen.getByRole("button", { name: "Italic" });
    await user.click(italicBtn);
    expect(onValueChange).toHaveBeenCalled();
  });

  it("does NOT trigger when item is disabled", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup onValueChange={onValueChange}>
        <ToggleGroupItem value="active" aria-label="Active item">
          Active
        </ToggleGroupItem>
        <ToggleGroupItem disabled value="disabled" aria-label="Disabled item">
          Disabled
        </ToggleGroupItem>
      </ToggleGroup>
    );

    const disabledBtn = screen.getByRole("button", { name: "Disabled item" });
    expect(disabledBtn).toBeDisabled();
    await user.click(disabledBtn);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("forwards ref to ToggleGroup root element and items", () => {
    const rootRef = createRef<HTMLDivElement>();
    const itemRef = createRef<HTMLButtonElement>();
    render(
      <ToggleGroup ref={rootRef}>
        <ToggleGroupItem ref={itemRef} value="v1" aria-label="V1">
          V1
        </ToggleGroupItem>
      </ToggleGroup>
    );

    expect(rootRef.current).toBeInstanceOf(HTMLDivElement);
    expect(itemRef.current).toBeInstanceOf(HTMLButtonElement);
  });
});
