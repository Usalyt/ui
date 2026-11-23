import React from "react";
import { DataTable } from "@usalyt/ui";

const columns = [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "role", header: "Role" },
];

const data = [
  { id: "1", name: "Alice Johnson", role: "Developer" },
  { id: "2", name: "Bob Smith", role: "Designer" },
];

export function DataTableDemo() {
  return <DataTable columns={columns} data={data} />;
}
