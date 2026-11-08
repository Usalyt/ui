import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
} from "./menubar";

describe("Menubar Primitive Component", () => {
  it("renders menubar container with role='menubar' and triggers", () => {
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    );

    expect(screen.getByRole("menubar")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "File" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
  });

  it("opens menu content when trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>New Tab</MenubarItem>
            <MenubarItem>New Window</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    await user.click(screen.getByRole("menuitem", { name: "File" }));
    expect(await screen.findByRole("menuitem", { name: "New Tab" })).toBeInTheDocument();
  });

  it("invokes onClick callback when menu item is clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent>
            <MenubarItem onClick={onClick}>Undo</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    await user.click(screen.getByRole("menuitem", { name: "Edit" }));
    const undoItem = await screen.findByRole("menuitem", { name: "Undo" });
    await user.click(undoItem);
    expect(onClick).toHaveBeenCalled();
  });

  it("renders MenubarShortcut element inside item", async () => {
    const user = userEvent.setup();
    render(
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Save <MenubarShortcut>⌘S</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    );

    await user.click(screen.getByRole("menuitem", { name: "File" }));
    expect(await screen.findByText("⌘S")).toBeInTheDocument();
  });

  it("forwards ref to Menubar container div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Menubar ref={ref}>
        <MenubarMenu>
          <MenubarTrigger>Ref Test</MenubarTrigger>
        </MenubarMenu>
      </Menubar>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "menubar");
  });
});
