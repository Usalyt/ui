import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "./data-table";
import { Badge } from "../badge";

const meta: Meta<typeof DataTable> = {
  title: "Primitives/DataTable",
  component: DataTable,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

const sampleUsers: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Developer", status: "active" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Designer", status: "inactive" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Manager", status: "active" },
  { id: "5", name: "Edward Elric", email: "edward@example.com", role: "Evaluator", status: "active" },
  { id: "6", name: "Fiona Gallagher", email: "fiona@example.com", role: "Tester", status: "inactive" },
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "default" : "secondary"}>
        {row.original.status}
      </Badge>
    ),
  },
];

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-2xl border rounded-xl p-4 bg-background shadow-xl">
      <DataTable columns={columns} data={sampleUsers} pageSize={4} />
    </div>
  ),
};

export const SmallPageSize: Story = {
  render: () => (
    <div className="w-full max-w-2xl border rounded-xl p-4 bg-background shadow-xl">
      <DataTable columns={columns} data={sampleUsers} pageSize={2} />
    </div>
  ),
};

const wideUsers: User[] = [
  { id: "1", name: "Alexandria Catherine Montgomery", email: "alexandria.montgomery@international-ux-research-collective.example", role: "Principal Experience Architect", status: "active" },
  { id: "2", name: "Maximilian Alexander Rodriguez", email: "maximilian.rodriguez@enterprise-design-systems.example", role: "Staff Design Technologist", status: "active" },
  { id: "3", name: "Charlotte Isabella Whitmore", email: "charlotte.whitmore@accessibility-assurance.example", role: "Accessibility Program Lead", status: "inactive" },
];

export const WideRecords: Story = {
  render: () => (
    <div className="w-[360px] max-w-[calc(100vw_-_6rem)] border rounded-xl p-4 bg-background shadow-xl">
      <DataTable columns={columns} data={wideUsers} pageSize={3} />
    </div>
  ),
};
