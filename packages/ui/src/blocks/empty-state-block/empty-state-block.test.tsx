import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { EmptyStateBlock } from "./empty-state-block";

describe("EmptyStateBlock Block", () => {
  it("renders title, description and triggers actions", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();
    const handleSecondary = vi.fn();

    render(
      <EmptyStateBlock
        title="No audits yet"
        description="Run an evaluation to populate findings."
        actionLabel="Start Evaluation"
        secondaryActionLabel="Learn More"
        onAction={handleAction}
        onSecondaryAction={handleSecondary}
      />
    );

    expect(screen.getByText("No audits yet")).toBeInTheDocument();
    expect(
      screen.getByText("Run an evaluation to populate findings.")
    ).toBeInTheDocument();

    const actionBtn = screen.getByRole("button", { name: /start evaluation/i });
    await user.click(actionBtn);
    expect(handleAction).toHaveBeenCalledOnce();

    const secBtn = screen.getByRole("button", { name: /learn more/i });
    await user.click(secBtn);
    expect(handleSecondary).toHaveBeenCalledOnce();
  });

  it("keeps long action labels complete and clickable", async () => {
    const user = userEvent.setup();
    const handleAction = vi.fn();
    const handleSecondary = vi.fn();
    const primaryLabel =
      "Launch the browser extension and start a new evaluation";
    const secondaryLabel = "Read the evaluation methodology guide";

    render(
      <EmptyStateBlock
        actionLabel={primaryLabel}
        secondaryActionLabel={secondaryLabel}
        onAction={handleAction}
        onSecondaryAction={handleSecondary}
      />
    );

    const primary = screen.getByRole("button", { name: primaryLabel });
    const secondary = screen.getByRole("button", { name: secondaryLabel });
    expect(primary).toHaveTextContent(primaryLabel);
    expect(secondary).toHaveTextContent(secondaryLabel);
    expect(primary).toHaveClass("whitespace-normal");
    expect(primary).toHaveClass("max-w-full");
    expect(secondary).toHaveClass("whitespace-normal");
    expect(secondary).toHaveClass("max-w-full");
    expect(primary.parentElement).toHaveClass("flex-wrap");

    await user.click(primary);
    await user.click(secondary);
    expect(handleAction).toHaveBeenCalledOnce();
    expect(handleSecondary).toHaveBeenCalledOnce();
  });

  it("keeps the non-action empty state free of controls", () => {
    render(<EmptyStateBlock title="Nothing here" />);
    expect(screen.getByText("Nothing here")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
