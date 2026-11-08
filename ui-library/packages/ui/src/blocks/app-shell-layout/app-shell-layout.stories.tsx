import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppShellLayout } from "./app-shell-layout";
import { LayoutDashboard, Calendar, Users, Settings } from "lucide-react";

const meta: Meta<typeof AppShellLayout> = {
  title: "Blocks/AppShellLayout",
  component: AppShellLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    brandName: "UX Check Platform",
    navItems: [
      {
        title: "Overview",
        href: "#",
        icon: <LayoutDashboard className="h-4 w-4" />,
        isActive: true,
      },
      {
        title: "Calendar",
        href: "#",
        icon: <Calendar className="h-4 w-4" />,
      },
      {
        title: "Team Members",
        href: "#",
        icon: <Users className="h-4 w-4" />,
      },
      {
        title: "Settings",
        href: "#",
        icon: <Settings className="h-4 w-4" />,
      },
    ],
    breadcrumbs: [
      { label: "Home", href: "#" },
      { label: "Projects", href: "#" },
      { label: "Checkout Flow Audit" },
    ],
    user: {
      name: "Alex Doe",
      email: "alex@uxcheck.io",
    },
    children: (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Project Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Welcome to the collaborative heuristic evaluation workspace.
        </p>
      </div>
    ),
  },
};
