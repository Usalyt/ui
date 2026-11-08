import React from "react";
import { DataTableWithFilters } from "tu-ui";

interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const sampleUsers: SystemUser[] = [
  { id: "1", name: "Alice Johnson", email: "alice@uxcheck.io", role: "Admin", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@uxcheck.io", role: "Evaluator", status: "Active" },
  { id: "3", name: "Charlie Brown", email: "charlie@uxcheck.io", role: "Viewer", status: "Inactive" },
  { id: "4", name: "Diana Prince", email: "diana@uxcheck.io", role: "Evaluator", status: "Active" },
];

export function DataTableWithFiltersDemo() {
  return <DataTableWithFilters data={sampleUsers} />;
}
