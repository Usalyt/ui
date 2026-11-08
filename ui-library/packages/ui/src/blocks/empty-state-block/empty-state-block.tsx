"use client";

import * as React from "react";
import { Plus, HelpCircle } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/button";

export interface EmptyStateBlockProps
  extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
}

export function EmptyStateBlock({
  icon,
  title = "No evaluations recorded",
  description = "Get started by selecting an element on the host page or importing an existing audit.",
  actionLabel = "New Evaluation",
  secondaryActionLabel,
  onAction,
  onSecondaryAction,
  className,
  ...props
}: EmptyStateBlockProps) {
  const titleId = React.useId();
  const descriptionId = React.useId();

  return (
    <div
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center max-w-lg mx-auto",
        className
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-muted border border-border/80 text-muted-foreground mb-4"
      >
        {icon ?? <HelpCircle className="h-6 w-6" />}
      </div>

      <h3 id={titleId} className="text-base font-semibold text-foreground mb-1">{title}</h3>
      <p
        id={descriptionId}
        className="text-xs text-muted-foreground max-w-sm mb-6 leading-relaxed"
      >
        {description}
      </p>

      <div className="flex w-full max-w-full flex-wrap items-center justify-center gap-3">
        {secondaryActionLabel && onSecondaryAction && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSecondaryAction}
            className="h-auto min-h-8 max-w-full whitespace-normal py-2 text-center text-xs"
          >
            {secondaryActionLabel}
          </Button>
        )}
        {actionLabel && onAction && (
          <Button
            size="sm"
            onClick={onAction}
            className="h-auto min-h-8 max-w-full gap-1.5 whitespace-normal py-2 text-center text-xs"
          >
            <Plus className="h-3.5 w-3.5 shrink-0" />
            <span>{actionLabel}</span>
          </Button>
        )}
      </div>
    </div>
  );
}
