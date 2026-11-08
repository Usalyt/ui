import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from "./dropdown-menu";
import { Button } from "../button";

describe("DropdownMenu Primitive Component", () => {
  it("renders trigger button and opens menu on click", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button>Options</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onClick}>Profile</DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    const trigger = screen.getByRole("button", { name: /options/i });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();

    await user.click(trigger);
    const item = await screen.findByRole("menuitem", { name: /profile/i });
    expect(item).toBeInTheDocument();
    await user.click(item);
    expect(onClick).toHaveBeenCalled();
  });

  it("renders menu labels and separators inside a group", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button>Account Menu</Button>} />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuItem>Profile</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByRole("button", { name: /account menu/i }));
    expect(await screen.findByText("My Account")).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: /profile/i })).toBeInTheDocument();
  });

  it("renders keyboard shortcuts inside menu items", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button>File Menu</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem>
            New Tab <DropdownMenuShortcut>⌘T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByRole("button", { name: /file menu/i }));
    expect(await screen.findByText("⌘T")).toBeInTheDocument();
  });

  it("closes menu when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button>Open Menu</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem>Item 1</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByRole("button", { name: /open menu/i }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("navigates menu items with ArrowDown and ArrowUp keys", async () => {
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button>Nav Menu</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem>First Item</DropdownMenuItem>
          <DropdownMenuItem>Second Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByRole("button", { name: /nav menu/i }));
    const firstItem = await screen.findByRole("menuitem", {
      name: /first item/i,
    });
    expect(firstItem).toBeInTheDocument();

    await user.keyboard("{ArrowDown}");
    const secondItem = screen.getByRole("menuitem", { name: /second item/i });
    expect(secondItem).toBeInTheDocument();
  });

  it("forwards ref to DropdownMenuItem DOM element", async () => {
    const ref = createRef<HTMLDivElement>();
    const user = userEvent.setup();
    render(
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button>Ref Menu</Button>} />
        <DropdownMenuContent>
          <DropdownMenuItem ref={ref}>Ref Item</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );

    await user.click(screen.getByRole("button", { name: /ref menu/i }));
    await screen.findByRole("menu");
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
