import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
} from "./dropdown-menu";
import { Button } from "../button";
import { User, Settings, CreditCard, LogOut, Plus, Users, Mail } from "lucide-react";

const meta: Meta<typeof DropdownMenu> = {
  title: "Primitives/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const StandardMenu: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">My Account ▾</Button>} />
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" /> Profile
            </span>
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Billing
            </span>
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span className="flex items-center gap-2">
              <Settings className="h-4 w-4" /> Settings
            </span>
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-destructive focus:bg-destructive/10">
          <span className="flex items-center gap-2">
            <LogOut className="h-4 w-4" /> Log out
          </span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const Default: Story = StandardMenu;

export const WithShortcuts: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Actions ▾</Button>} />
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Team
          </span>
          <DropdownMenuShortcut>⌘+N</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="flex items-center gap-2">
            <Users className="h-4 w-4" /> Invite Members
          </span>
          <DropdownMenuShortcut>⌘+I</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4" /> Send Email
          </span>
          <DropdownMenuShortcut>⌘+E</DropdownMenuShortcut>
        </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};