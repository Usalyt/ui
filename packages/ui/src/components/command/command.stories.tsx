import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
} from "lucide-react";

const meta: Meta<typeof Command> = {
  title: "Primitives/Command",
  component: Command,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Command>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar className="h-4 w-4 text-fog" aria-hidden="true" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile className="h-4 w-4 text-fog" aria-hidden="true" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator className="h-4 w-4 text-fog" aria-hidden="true" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <CommandFooter />
      </Command>
    </div>
  ),
};

export const GroupedActions: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Command>
        <CommandInput placeholder="Search actions and settings..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="h-4 w-4 text-fog" aria-hidden="true" />
              <span>Profile Settings</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="h-4 w-4 text-fog" aria-hidden="true" />
              <span>Billing & Subscription</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="h-4 w-4 text-fog" aria-hidden="true" />
              <span>Workspace Preferences</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
        <CommandFooter />
      </Command>
    </div>
  ),
};
