import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Popover as BasePopover } from "@base-ui/react/popover";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "./navigation-menu";

const meta: Meta<typeof NavigationMenu> = {
  title: "Primitives/NavigationMenu",
  component: NavigationMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <BasePopover.Root>
            <NavigationMenuTrigger>Getting Started</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[350px]">
              <div className="grid gap-3 p-2">
                <NavigationMenuLink href="#">
                  <div className="text-xs font-semibold">Introduction</div>
                  <p className="text-[10px] text-muted-foreground">
                    Re-usable UI components built with Base UI and Tailwind.
                  </p>
                </NavigationMenuLink>
                <NavigationMenuLink href="#">
                  <div className="text-xs font-semibold">Installation</div>
                  <p className="text-[10px] text-muted-foreground">
                    How to install dependencies and structure app code.
                  </p>
                </NavigationMenuLink>
              </div>
            </NavigationMenuContent>
          </BasePopover.Root>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <BasePopover.Root>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent className="w-[450px] grid grid-cols-2 gap-2">
              <NavigationMenuLink href="#">
                <div className="text-xs font-semibold">Accordion</div>
                <p className="text-[10px] text-muted-foreground">
                  Stacked collapsible panels.
                </p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="text-xs font-semibold">Dialog</div>
                <p className="text-[10px] text-muted-foreground">
                  Modal dialog overlays.
                </p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="text-xs font-semibold">Popover</div>
                <p className="text-[10px] text-muted-foreground">
                  Floating cards anchored to triggers.
                </p>
              </NavigationMenuLink>
              <NavigationMenuLink href="#">
                <div className="text-xs font-semibold">Tooltip</div>
                <p className="text-[10px] text-muted-foreground">
                  Brief hover descriptions.
                </p>
              </NavigationMenuLink>
            </NavigationMenuContent>
          </BasePopover.Root>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink href="#" className="px-4 py-2">
            Documentation
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  ),
};

export const Constrained: Story = {
  render: () => (
    <div className="w-[300px]">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <BasePopover.Root>
              <NavigationMenuTrigger>Components</NavigationMenuTrigger>
              <NavigationMenuContent className="w-[450px] grid grid-cols-2 gap-2">
                <NavigationMenuLink href="#">
                  <div className="text-xs font-semibold">Accordion</div>
                  <p className="text-[10px] text-muted-foreground">
                    Stacked collapsible panels.
                  </p>
                </NavigationMenuLink>
                <NavigationMenuLink href="#">
                  <div className="text-xs font-semibold">Dialog</div>
                  <p className="text-[10px] text-muted-foreground">
                    Modal dialog overlays.
                  </p>
                </NavigationMenuLink>
              </NavigationMenuContent>
            </BasePopover.Root>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  ),
};
