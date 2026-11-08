import * as React from "react";
import { cn } from "../../lib/utils";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        aria-hidden="true"
        className={cn(
          "animate-pulse rounded-md bg-muted/80 border border-border/30 backdrop-blur-xs",
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
