import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  HeuristicFindingCard,
  type HeuristicFinding,
} from "./heuristic-finding-card";

const mockFinding: HeuristicFinding = {
  id: "finding-1",
  heuristicId: "H1",
  heuristicTitle: "Visibility of System Status",
  severity: "CRITICAL",
  rating: 4,
  selector: "button.checkout-btn",
  description: "Checkout button does not indicate ongoing request state.",
  createdAt: "2026-09-02",
  evaluatorName: "UX Evaluator",
};

describe("HeuristicFindingCard Block", () => {
  it("renders heuristic finding details with badges, selector and description", () => {
    render(<HeuristicFindingCard finding={mockFinding} />);

    expect(screen.getByText("H1")).toBeInTheDocument();
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
    expect(screen.getByText("Visibility of System Status")).toBeInTheDocument();
    expect(screen.getByText("button.checkout-btn")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Checkout button does not indicate ongoing request state."
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Evaluated by UX Evaluator")).toBeInTheDocument();
  });

  it("presents an explicit numeric severity instead of positive-green stars", () => {
    render(<HeuristicFindingCard finding={mockFinding} />);

    expect(screen.getByText("4 / 5")).toBeInTheDocument();
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
  });

  it("triggers onEdit and onDelete callbacks", async () => {
    const user = userEvent.setup();
    const handleEdit = vi.fn();
    const handleDelete = vi.fn();

    render(
      <HeuristicFindingCard
        finding={mockFinding}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    );

    const editBtn = screen.getByRole("button", { name: /edit finding/i });
    const deleteBtn = screen.getByRole("button", { name: /delete finding/i });

    await user.click(editBtn);
    expect(handleEdit).toHaveBeenCalledWith(mockFinding);

    await user.click(deleteBtn);
    expect(handleDelete).toHaveBeenCalledWith("finding-1");
  });
});
