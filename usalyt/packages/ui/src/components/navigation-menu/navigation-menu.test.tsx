import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Popover as BasePopover } from "@base-ui/react/popover";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./navigation-menu";

describe("NavigationMenu Primitive Component", () => {
  it("renders navigation landmark with aria-label", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="/docs">Docs</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(
      screen.getByRole("navigation", { name: /main navigation/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Docs" })).toBeInTheDocument();
  });

  it("opens navigation panel on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <BasePopover.Root>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/button">Button</NavigationMenuLink>
              </NavigationMenuContent>
            </BasePopover.Root>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    const trigger = screen.getByRole("button", { name: /components/i });
    await user.click(trigger);
    expect(await screen.findByRole("link", { name: "Button" })).toBeInTheDocument();
  });

  it("merges custom className on NavigationMenuLink", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink href="#" className="my-nav-link">
              Link
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    );

    expect(screen.getByRole("link", { name: "Link" })).toHaveClass(
      "my-nav-link"
    );
  });

  it("forwards ref to HTMLElement nav tag", () => {
    const ref = createRef<HTMLElement>();
    render(
      <NavigationMenu ref={ref}>
        <NavigationMenuList />
      </NavigationMenu>
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveAttribute("aria-label", "Main Navigation");
  });
});
