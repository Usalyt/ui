import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  TeamMembersTable,
  type TeamMember,
} from "./team-members-table";

const sampleMembers: TeamMember[] = [
  { id: "u-1", name: "Alice Owner", email: "alice@example.com", role: "owner" },
  {
    id: "u-2",
    name: "Bob Evaluator",
    email: "bob@example.com",
    role: "evaluator",
  },
];

describe("TeamMembersTable Block", () => {
  it("renders members, role badges and select options", () => {
    render(<TeamMembersTable members={sampleMembers} />);

    expect(screen.getByText("Alice Owner")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Owner")).toBeInTheDocument();

    expect(screen.getByText("Bob Evaluator")).toBeInTheDocument();
    expect(screen.getByText("bob@example.com")).toBeInTheDocument();
    expect(
      screen.getByLabelText(/change role for bob evaluator/i)
    ).toBeInTheDocument();
  });

  it("handles role change and member removal", async () => {
    const user = userEvent.setup();
    const handleRoleChange = vi.fn();
    const handleRemove = vi.fn();

    render(
      <TeamMembersTable
        members={sampleMembers}
        onRoleChange={handleRoleChange}
        onRemoveMember={handleRemove}
      />
    );

    const roleSelect = screen.getByLabelText(/change role for bob evaluator/i);
    await user.selectOptions(roleSelect, "moderator");
    expect(handleRoleChange).toHaveBeenCalledWith("u-2", "moderator");

    const removeBtn = screen.getByRole("button", {
      name: /remove bob evaluator/i,
    });
    await user.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledWith("u-2");
  });
});
