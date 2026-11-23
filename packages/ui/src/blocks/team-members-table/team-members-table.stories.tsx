import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { TeamMembersTable } from "./team-members-table";

const meta: Meta<typeof TeamMembersTable> = {
  title: "Blocks/TeamMembersTable",
  component: TeamMembersTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    members: [
      {
        id: "usr-01",
        name: "Sara Gómez",
        email: "sara@company.com",
        role: "owner",
        joinedAt: "12 May 2026",
      },
      {
        id: "usr-02",
        name: "Carlos Rivera",
        email: "carlos@company.com",
        role: "moderator",
        joinedAt: "18 May 2026",
      },
      {
        id: "usr-03",
        name: "Mateo Ortiz",
        email: "mateo@company.com",
        role: "evaluator",
        joinedAt: "25 Jun 2026",
      },
    ],
    className: "w-[calc(100vw_-_6rem)] lg:w-auto max-w-4xl mx-auto",
  },
};
