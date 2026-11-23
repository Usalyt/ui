import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DataTableWithFilters, SystemUser } from "./data-table-with-filters";

const meta: Meta<typeof DataTableWithFilters> = {
  title: "Blocks/DataTableWithFilters",
  component: DataTableWithFilters,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const sampleUsers: SystemUser[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Evaluator", status: "Active" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Evaluator", status: "Active" },
];

export const Default: Story = {
  render: () => (
    <div className="w-[calc(100vw_-_6rem)] lg:w-auto min-w-0 max-w-3xl p-4 sm:p-6 border rounded-xl bg-background">
      <DataTableWithFilters data={sampleUsers} />
    </div>
  ),
};

const wideUsers: SystemUser[] = [
  { id: "1", name: "Alexandria Catherine Montgomery", email: "alexandria.montgomery@international-ux-research-collective.example", role: "Principal Experience Architect", status: "Active" },
  { id: "2", name: "Maximilian Alexander Rodriguez", email: "maximilian.rodriguez@enterprise-design-systems.example", role: "Staff Design Technologist", status: "Active" },
  { id: "3", name: "Charlotte Isabella Whitmore", email: "charlotte.whitmore@accessibility-assurance.example", role: "Accessibility Program Lead", status: "Inactive" },
];

export const WideRecords: Story = {
  render: () => (
    <div className="w-[360px] max-w-[calc(100vw_-_6rem)] p-4 border rounded-xl bg-background">
      <DataTableWithFilters data={wideUsers} />
    </div>
  ),
};
