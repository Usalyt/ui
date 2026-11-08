import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DashboardHeader } from "./dashboard-header";

const meta: Meta<typeof DashboardHeader> = {
  title: "Blocks/DashboardHeader",
  component: DashboardHeader,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Analytics Dashboard",
    userName: "Alice Johnson",
    userAvatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  },
};

export const WithActions: Story = {
  args: {
    title: "Analytics Dashboard",
    userName: "Alice Johnson",
    notificationCount: 3,
    onNotificationsClick: () => {},
    onProfileSettings: () => {},
    onTeamManagement: () => {},
    onLogout: () => {},
    actions: (
      <button
        type="button"
        className="rounded-md border border-border px-3 py-1.5 text-xs text-foreground"
      >
        Invite teammate
      </button>
    ),
  },
};
