import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DataTableWithFilters, SystemUser } from "./data-table-with-filters";

const mockUsers: SystemUser[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Evaluator", status: "Active" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", status: "Inactive" },
];

describe("DataTableWithFilters Block Component", () => {
  it("renders data table with role filter combobox", () => {
    render(<DataTableWithFilters data={mockUsers} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
  });

  it("filters table data by role selection", async () => {
    const user = userEvent.setup();
    render(<DataTableWithFilters data={mockUsers} />);

    const combobox = screen.getByRole("combobox");
    await user.click(combobox);

    const evaluatorOption = screen.getByRole("option", { name: "Evaluator" });
    await user.click(evaluatorOption);

    expect(screen.getByText("Bob Smith")).toBeInTheDocument();
    expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
  });

  it("renders empty state when filter matches 0 items", () => {
    render(<DataTableWithFilters data={[]} />);
    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });
});
