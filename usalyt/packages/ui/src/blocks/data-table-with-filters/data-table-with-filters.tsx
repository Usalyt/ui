"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Combobox } from "../../components/combobox";
import { DataTable, DataTableColumnHeader } from "../../components/data-table";

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const columns: ColumnDef<SystemUser>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />
  },
  {
    accessorKey: "email",
    header: "Email"
  },
  {
    accessorKey: "role",
    header: "Role"
  },
  {
    accessorKey: "status",
    header: "Status"
  }
];

export interface DataTableWithFiltersProps {
  data: SystemUser[];
  title?: string;
  description?: string;
  className?: string;
}

const roleOptions = [
  { value: "all", label: "All Roles" },
  { value: "Admin", label: "Admin" },
  { value: "Evaluator", label: "Evaluator" },
  { value: "Viewer", label: "Viewer" }
];

export function DataTableWithFilters({
  data,
  title = "Team directory",
  description = "Review project access and filter members by role.",
  className
}: DataTableWithFiltersProps) {
  const [selectedRole, setSelectedRole] = React.useState("all");

  const filteredData = React.useMemo(() => {
    if (selectedRole === "all") return data;
    return data.filter((item) => item.role === selectedRole);
  }, [data, selectedRole]);

  return (
    <div className="w-full min-w-0 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <div className="w-full sm:w-56">
          <Combobox
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
            placeholder="Filter by role..."
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        filterPlaceholder="Filter users by name or email..."
        className="min-w-0"
      />
    </div>
  );
}
