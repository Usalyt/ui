import React, { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandFooter,
} from "./command";

describe("Command Primitive Component", () => {
  it("renders command input and group items", () => {
    render(
      <Command>
        <CommandInput placeholder="Type a command..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    expect(
      screen.getByPlaceholderText("Type a command...")
    ).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
  });

  it("filters items on search typing", async () => {
    const user = userEvent.setup();
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Actions">
            <CommandItem>Profile</CommandItem>
            <CommandItem>Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    await user.type(screen.getByPlaceholderText("Search..."), "prof");
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("invokes onSelect handler when item is clicked", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <Command>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandGroup heading="Actions">
            <CommandItem onSelect={onSelect}>Billing</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    await user.click(screen.getByText("Billing"));
    expect(onSelect).toHaveBeenCalled();
  });

  it("renders CommandShortcut element inside CommandItem", () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>
            <span>New Document</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>
    );

    expect(screen.getByText("⌘N")).toBeInTheDocument();
  });

  it("forwards ref to Command root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Command ref={ref}>
        <CommandInput placeholder="Ref test" />
      </Command>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

// ---------------------------------------------------------------------------
// Redesign contract (OpenSpec change refactor-sdd-tdd-full-coverage, task 14):
// no dead blur, no doubled borders, caption-scale rows, mono shortcuts at
// normal tracking and a footer of real key hints.
// ---------------------------------------------------------------------------

describe("Command redesign contract", () => {
  it("renders the footer key hints for the palette's real keyboard behaviors", () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>Calendar</CommandItem>
        </CommandList>
        <CommandFooter />
      </Command>
    );

    expect(screen.getByText("↑↓")).toBeInTheDocument();
    expect(screen.getByText("Navigate")).toBeInTheDocument();
    expect(screen.getByText("↵")).toBeInTheDocument();
    expect(screen.getByText("Select")).toBeInTheDocument();
    expect(screen.getByText("esc")).toBeInTheDocument();
    expect(screen.getByText("Close")).toBeInTheDocument();
  });

  it("root surface carries no decorative backdrop blur", () => {
    render(<Command data-testid="command-root" />);

    const root = screen.getByTestId("command-root");
    expect(root.className).not.toMatch(/backdrop-blur/);
    expect(root.className).toMatch(/bg-popover/);
    expect(root.className).toMatch(/shadow-\(--shadow-xl\)|shadow-xl/);
    expect(root.className).toMatch(/rounded-lg/);
    expect(root.className).toMatch(/border border-border/);
  });

  it("shortcuts render in mono at normal tracking", () => {
    render(
      <Command>
        <CommandList>
          <CommandItem>
            <span>New Document</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
        </CommandList>
      </Command>
    );

    const shortcut = screen.getByText("⌘N");
    expect(shortcut.className).toMatch(/font-mono/);
    expect(shortcut.className).toMatch(/tracking-normal/);
    expect(shortcut.className).not.toMatch(/tracking-widest/);
  });

  it("group headings use the 12px label scale at weight 510, never 600+", () => {
    render(
      <Command>
        <CommandList>
          <CommandGroup heading="Suggestions">
            <CommandItem>Calendar</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    );

    const group = screen
      .getByText("Calendar")
      .closest("[cmdk-group]") as HTMLElement;
    expect(group.className).toContain("[&_[cmdk-group-heading]]:text-label");
    expect(group.className).toContain("[&_[cmdk-group-heading]]:font-w510");
    expect(group.className).not.toMatch(/font-semibold/);
  });
});
