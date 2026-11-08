import React from "react";
import { DataTableWithFilters } from "@usalyt/ui";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const sampleUsers: SystemUser[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Evaluator", status: "Active" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive" },
  { id: "4", name: "Diana Prince", email: "diana@example.com", role: "Evaluator", status: "Active" },
];

export function DataTableWithFiltersDemo() {
  return <DataTableWithFilters data={sampleUsers} />;
}
