import React from "react";
import { ProjectKanbanBoard, type KanbanColumnId, type KanbanTask } from "tu-ui";

const initialTasks: KanbanTask[] = [
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

export function ProjectKanbanBoardDemo() {
  const [tasks, setTasks] = React.useState<KanbanTask[]>(initialTasks);
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  const moveTask = (taskId: string, targetStatus: KanbanColumnId) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, status: targetStatus } : task))
    );
    setLastAction(`${taskId} moved to ${targetStatus}`);
  };

  return (
    <div className="w-full space-y-2">
      <div className="rounded-xl border border-border bg-background p-4">
        <ProjectKanbanBoard
          tasks={tasks}
          onTaskMove={moveTask}
          onTaskClick={(task) => setLastAction(`Opened ${task.id}`)}
          onAddTask={(status) => {
            const newTask: KanbanTask = {
              id: `task-${tasks.length + 1}`,
              title: "New remediation task from evaluation",
              status,
              severity: "MEDIUM",
            };
            setTasks((prev) => [...prev, newTask]);
            setLastAction(`Task added to ${status}`);
          }}
        />
      </div>
      {lastAction && (
        <p className="text-center text-xs text-muted-foreground" role="status">
          {lastAction}
        </p>
      )}
    </div>
  );
}
