import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  ProjectKanbanBoard,
  type KanbanTask,
} from "./project-kanban-board";

const sampleTasks: KanbanTask[] = [
  {
    id: "task-101",
    title: "Fix low contrast on checkout label",
    status: "TODO",
    heuristicTag: "H1",
    severity: "CRITICAL",
    assigneeName: "David",
  },
  {
    id: "task-102",
    title: "Add error boundary for payment retry",
    status: "IN_PROGRESS",
    heuristicTag: "H9",
    severity: "MEDIUM",
  },
];

describe("ProjectKanbanBoard Block", () => {
  it("renders 4 columns and displays tasks in their corresponding status", () => {
    render(<ProjectKanbanBoard tasks={sampleTasks} />);

    expect(screen.getByText("To Do")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("In Review")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();

    expect(
      screen.getByText("Fix low contrast on checkout label")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Add error boundary for payment retry")
    ).toBeInTheDocument();
    expect(screen.getByText("H1")).toBeInTheDocument();
    expect(screen.getByText("CRITICAL")).toBeInTheDocument();
  });

  it("triggers onTaskClick and onAddTask callbacks", async () => {
    const user = userEvent.setup();
    const handleTaskClick = vi.fn();
    const handleAddTask = vi.fn();

    render(
      <ProjectKanbanBoard
        tasks={sampleTasks}
        onTaskClick={handleTaskClick}
        onAddTask={handleAddTask}
      />
    );

    const taskCard = screen.getByText("Fix low contrast on checkout label");
    await user.click(taskCard);
    expect(handleTaskClick).toHaveBeenCalledWith(sampleTasks[0]);

    const addBtn = screen.getByRole("button", { name: /add task to to do/i });
    await user.click(addBtn);
    expect(handleAddTask).toHaveBeenCalledWith("TODO");
  });

  it("activates task details with Enter and Space", async () => {
    const user = userEvent.setup();
    const handleTaskClick = vi.fn();

    render(
      <ProjectKanbanBoard tasks={sampleTasks} onTaskClick={handleTaskClick} />
    );

    const taskButton = screen.getByRole("button", {
      name: /open task fix low contrast on checkout label/i,
    });
    taskButton.focus();

    await user.keyboard("{Enter}");
    expect(handleTaskClick).toHaveBeenCalledWith(sampleTasks[0]);

    handleTaskClick.mockClear();
    await user.keyboard(" ");
    expect(handleTaskClick).toHaveBeenCalledWith(sampleTasks[0]);
  });

  it("moves tasks through a keyboard-accessible menu action", async () => {
    const user = userEvent.setup();
    const handleTaskMove = vi.fn();

    render(
      <ProjectKanbanBoard
        tasks={sampleTasks}
        onTaskMove={handleTaskMove}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /move task fix low contrast on checkout label/i,
      })
    );
    await user.click(
      await screen.findByRole("menuitem", { name: /in progress/i })
    );

    expect(handleTaskMove).toHaveBeenCalledWith("task-101", "IN_PROGRESS");
  });
});
