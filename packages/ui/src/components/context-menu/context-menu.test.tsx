import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "./context-menu";

describe("ContextMenu Primitive Component", () => {
  it("renders trigger element", () => {
    render(
      <ContextMenu>
        <ContextMenuTrigger>Right-click area</ContextMenuTrigger>
      </ContextMenu>
    );

    expect(screen.getByText("Right-click area")).toBeInTheDocument();
  });

  it("renders open menu content items when open prop is true", () => {
    render(
      <ContextMenu open>
        <ContextMenuTrigger>Area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem>Forward</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>
            Reload
            <ContextMenuShortcut>⌘R</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    expect(screen.getByRole("menuitem", { name: /back/i })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /forward/i })).toBeInTheDocument();
    expect(screen.getByText("⌘R")).toBeInTheDocument();
  });

  it("invokes onClick when item is activated", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ContextMenu open>
        <ContextMenuTrigger>Area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={onClick}>Inspect Element</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const item = screen.getByRole("menuitem", { name: "Inspect Element" });
    await user.click(item);
    expect(onClick).toHaveBeenCalled();
  });

  it("disables item interaction when disabled prop is set", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ContextMenu open>
        <ContextMenuTrigger>Area</ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem disabled onClick={onClick}>
            Paste (Disabled)
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    );

    const disabledItem = screen.getByRole("menuitem", { name: /paste/i });
    expect(disabledItem).toHaveAttribute("aria-disabled", "true");
    await user.click(disabledItem);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards ref to ContextMenuTrigger container element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ContextMenu>
        <ContextMenuTrigger ref={ref}>Ref Area</ContextMenuTrigger>
      </ContextMenu>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("cursor-context-menu");
  });
});
