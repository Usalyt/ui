import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ProjectKanbanBoard, type KanbanColumnId, type KanbanTask } from "./project-kanban-board";

const meta: Meta<typeof ProjectKanbanBoard> = {
  title: "Blocks/ProjectKanbanBoard",
  component: ProjectKanbanBoard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const defaultTasks: KanbanTask[] = [
  {
    id: "task-01",
    title: "Adjust contrast ratio on secondary actions",
    status: "TODO",
    heuristicTag: "H1",
    severity: "CRITICAL",
    assigneeName: "Lucas",
  },
  {
    id: "task-02",
    title: "Replace technical error code with human-readable text",
    status: "IN_PROGRESS",
    heuristicTag: "H9",
    severity: "MEDIUM",
    assigneeName: "Elena",
  },
  {
    id: "task-03",
    title: "Verify undo/redo keyboard shortcuts in evaluation form",
    status: "REVIEW",
    heuristicTag: "H3",
    severity: "GOOD",
  },
  {
    id: "task-04",
    title: "Implement consistent button hover tokens",
    status: "DONE",
    heuristicTag: "H4",
    severity: "GOOD",
    assigneeName: "Alex",
  },
];

export const Interactive: Story = {
  render: () => {
    const [tasks, setTasks] = React.useState<KanbanTask[]>(defaultTasks);

    const moveTask = (taskId: string, targetStatus: KanbanColumnId) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, status: targetStatus } : task
        )
      );
    };

    return (
      <ProjectKanbanBoard
        tasks={tasks}
        onTaskMove={moveTask}
        onTaskClick={() => {}}
        onAddTask={() => {}}
      />
    );
  },
};

export const Default: Story = {
  args: {
    tasks: [
      {
        id: "task-01",
        title: "Adjust contrast ratio on secondary actions",
        status: "TODO",
        heuristicTag: "H1",
        severity: "CRITICAL",
        assigneeName: "Lucas",
      },
      {
        id: "task-02",
        title: "Replace technical error code with human-readable text",
        status: "IN_PROGRESS",
        heuristicTag: "H9",
        severity: "MEDIUM",
        assigneeName: "Elena",
      },
      {
        id: "task-03",
        title: "Verify undo/redo keyboard shortcuts in evaluation form",
        status: "REVIEW",
        heuristicTag: "H3",
        severity: "GOOD",
      },
      {
        id: "task-04",
        title: "Implement consistent button hover tokens",
        status: "DONE",
        heuristicTag: "H4",
        severity: "GOOD",
        assigneeName: "Alex",
      },
    ],
  },
};
