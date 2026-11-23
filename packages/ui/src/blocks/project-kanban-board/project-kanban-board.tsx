"use client";

import * as React from "react";
import {
  Plus,
  CheckCircle2,
  Clock,
  Eye,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Card } from "../../components/card";
import { Badge } from "../../components/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { Button } from "../../components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../components/dropdown-menu";

export type KanbanColumnId = "TODO" | "IN_PROGRESS" | "REVIEW" | "DONE";

export interface KanbanTask {
  id: string;
  title: string;
  status: KanbanColumnId;
  heuristicTag?: string;
  severity?: "CRITICAL" | "MEDIUM" | "GOOD";
  assigneeName?: string;
  assigneeAvatar?: string;
}

export interface ProjectKanbanBoardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  tasks?: KanbanTask[];
  onTaskMove?: (taskId: string, targetStatus: KanbanColumnId) => void;
  onTaskClick?: (task: KanbanTask) => void;
  onAddTask?: (status: KanbanColumnId) => void;
}

const COLUMNS: Array<{
  id: KanbanColumnId;
  title: string;
  icon: React.ReactNode;
}> = [
  {
    id: "TODO",
    title: "To Do",
    icon: <AlertCircle className="h-4 w-4 text-muted-foreground" />,
  },
  {
    id: "IN_PROGRESS",
    title: "In Progress",
    icon: <Clock className="h-4 w-4 text-signal-teal-foreground" />,
  },
  {
    id: "REVIEW",
    title: "In Review",
    icon: <Eye className="h-4 w-4 text-iris-violet-foreground" />,
  },
  {
    id: "DONE",
    title: "Done",
    icon: <CheckCircle2 className="h-4 w-4 text-pulse-green-foreground" />,
  },
];

export function ProjectKanbanBoard({
  tasks = [],
  onTaskMove,
  onTaskClick,
  onAddTask,
  className,
  ...props
}: ProjectKanbanBoardProps) {
  const getTasksByStatus = (status: KanbanColumnId) =>
    tasks.filter((t) => t.status === status);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4 w-full",
        className
      )}
      {...props}
    >
      {COLUMNS.map((column) => {
        const columnTasks = getTasksByStatus(column.id);

        return (
          <section
            key={column.id}
            aria-label={column.title}
            className="flex min-h-0 flex-col rounded-lg border border-border bg-surface-raised p-3 md:h-full md:min-h-[480px]"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                {column.icon}
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                  {column.title}
                </span>
                <Badge
                  variant="neutral"
                  className="h-5 px-1.5 text-[10px] font-mono text-muted-foreground border-border"
                >
                  {columnTasks.length}
                </Badge>
              </div>

              {onAddTask && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground"
                  onClick={() => onAddTask(column.id)}
                  aria-label={`Add task to ${column.title}`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>

            <div className="flex flex-col gap-2.5 pt-3 md:flex-1 md:overflow-y-auto">
              {columnTasks.length === 0 && (
                <p className="rounded-md border border-dashed border-border/70 px-3 py-6 text-center text-[11px] text-muted-foreground">
                  No tasks in this column.
                </p>
              )}

              {columnTasks.map((task) => (
                <Card
                  key={task.id}
                  className="p-3 border border-border bg-card shadow-2xs hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-1 mb-2">
                    {task.heuristicTag && (
                      <Badge
                        variant="neutral"
                        className="font-mono text-[10px] px-1.5 py-0 border-border"
                      >
                        {task.heuristicTag}
                      </Badge>
                    )}
                    {task.severity && (
                      <Badge
                        variant={
                          task.severity === "CRITICAL"
                            ? "coral-red"
                            : task.severity === "GOOD"
                            ? "pulse-green"
                            : "signal-teal"
                        }
                        className="text-[10px] px-1.5 py-0"
                      >
                        {task.severity}
                      </Badge>
                    )}
                  </div>

                  {onTaskClick ? (
                    <button
                      type="button"
                      onClick={() => onTaskClick(task)}
                      aria-label={`Open task ${task.title}`}
                      className="block w-full rounded-sm text-left text-xs font-medium text-card-foreground leading-snug line-clamp-2 mb-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card"
                    >
                      {task.title}
                    </button>
                  ) : (
                    <p className="text-xs font-medium text-card-foreground leading-snug line-clamp-2 mb-3">
                      {task.title}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
                    <span className="text-[10px] font-mono text-muted-foreground">
                      #{task.id}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {task.assigneeName && (
                        <>
                          <span className="text-[10px] truncate max-w-[80px] text-muted-foreground">
                            {task.assigneeName}
                          </span>
                          <Avatar className="h-4 w-4 border border-border">
                            {task.assigneeAvatar && (
                              <AvatarImage src={task.assigneeAvatar} />
                            )}
                            <AvatarFallback className="text-[8px] bg-muted text-foreground">
                              {task.assigneeName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </>
                      )}
                      {onTaskMove && (
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-muted-foreground hover:text-foreground"
                                aria-label={`Move task ${task.title}`}
                              >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </Button>
                            }
                          />
                          <DropdownMenuContent align="end">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel>Move to</DropdownMenuLabel>
                              {COLUMNS.filter(
                                (target) => target.id !== task.status
                              ).map((target) => (
                                <DropdownMenuItem
                                  key={target.id}
                                  onClick={() =>
                                    onTaskMove(task.id, target.id)
                                  }
                                >
                                  {target.title}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
