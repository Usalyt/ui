import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable, DataTableColumnHeader } from "./data-table";

interface User {
  id: string;
  name: string;
  role: string;
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
  },
];

const mockData: User[] = [
  { id: "1", name: "Alice Johnson", role: "Admin" },
  { id: "2", name: "Bob Smith", role: "Developer" },
  { id: "3", name: "Charlie Brown", role: "Designer" },
  { id: "4", name: "Diana Prince", role: "Manager" },
  { id: "5", name: "Edward Elric", role: "Evaluator" },
  { id: "6", name: "Fiona Gallagher", role: "Tester" },
];

describe("DataTable Primitive Component", () => {
  it("renders table headers and paginated rows", () => {
    render(<DataTable columns={columns} data={mockData} pageSize={5} />);

    expect(screen.getByRole("button", { name: "Name" })).toBeInTheDocument();
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.queryByText("Fiona Gallagher")).not.toBeInTheDocument();
  });

  it("filters rows based on user input", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={mockData}
        filterPlaceholder="Search users..."
      />
    );

    await user.type(screen.getByPlaceholderText("Search users..."), "Bob");
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
  });

  it("navigates to next page cleanly", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={mockData} pageSize={5} />);

    await user.click(screen.getByRole("button", { name: /next page/i }));
    expect(screen.getByText("Fiona Gallagher")).toBeInTheDocument();
  });

  it("renders empty state message when search yields no matches", async () => {
    const user = userEvent.setup();
    render(
      <DataTable
        columns={columns}
        data={mockData}
        filterPlaceholder="Search..."
      />
    );

    await user.type(
      screen.getByPlaceholderText("Search..."),
      "non-existent-user-query"
    );
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("sorts column on header button click", async () => {
    const user = userEvent.setup();
    render(<DataTable columns={columns} data={mockData} pageSize={10} />);

    const sortBtn = screen.getByRole("button", { name: "Name" });
    await user.click(sortBtn); // Sort asc

    const rows = screen.getAllByRole("row");
    expect(rows.length).toBeGreaterThan(1);
  });

  it("applies custom className to wrapper container", () => {
    const { container } = render(
      <DataTable
        columns={columns}
        data={mockData}
        className="my-custom-data-table"
      />
    );

    expect(container.firstChild).toHaveClass("my-custom-data-table");
  });

  it("owns horizontal overflow on the table frame", () => {
    const { container } = render(
      <DataTable columns={columns} data={mockData} />
    );

    const frame = container.querySelector("table")?.parentElement;
    expect(frame).toHaveClass("overflow-x-auto");
    expect(frame).not.toHaveClass("overflow-hidden");
  });
});
