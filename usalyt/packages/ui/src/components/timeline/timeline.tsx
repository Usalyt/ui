import * as React from "react";
import { cn } from "../../lib/utils";

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  orientation?: "vertical" | "horizontal";
}

export const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, orientation = "vertical", ...props }, ref) => (
    <ol
      ref={ref}
      aria-label="timeline"
      className={cn(
        "group flex",
        orientation === "vertical" ? "flex-col" : "flex-row items-start",
        className
      )}
      {...props}
      data-orientation={orientation}
    />
  )
);
Timeline.displayName = "Timeline";

export const TimelineItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn(
      "relative flex gap-4 pb-8 last:pb-0 group-data-[orientation=horizontal]:min-w-0 group-data-[orientation=horizontal]:flex-1 group-data-[orientation=horizontal]:basis-0 group-data-[orientation=horizontal]:flex-col group-data-[orientation=horizontal]:gap-2 group-data-[orientation=horizontal]:pb-0",
      className
    )}
    {...props}
  />
));
TimelineItem.displayName = "TimelineItem";

export const TimelineConnector = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    aria-hidden="true"
    className={cn(
      "absolute left-4 top-4 -bottom-4 w-0.5 bg-border -translate-x-1/2 group-data-[orientation=horizontal]:left-4 group-data-[orientation=horizontal]:-right-4 group-data-[orientation=horizontal]:top-4 group-data-[orientation=horizontal]:bottom-auto group-data-[orientation=horizontal]:h-0.5 group-data-[orientation=horizontal]:w-auto group-data-[orientation=horizontal]:translate-x-0 group-data-[orientation=horizontal]:-translate-y-1/2",
      className
    )}
    {...props}
  />
));
TimelineConnector.displayName = "TimelineConnector";

export const TimelineHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center gap-3 group-data-[orientation=horizontal]:flex-col group-data-[orientation=horizontal]:items-start group-data-[orientation=horizontal]:gap-2",
      className
    )}
    {...props}
  />
));
TimelineHeader.displayName = "TimelineHeader";

export const TimelineIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground",
      className
    )}
    {...props}
  />
));
TimelineIcon.displayName = "TimelineIcon";

export const TimelineContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-1 flex-col gap-1 pt-0.5 group-data-[orientation=horizontal]:min-w-0 group-data-[orientation=horizontal]:flex-none group-data-[orientation=horizontal]:pt-0",
      className
    )}
    {...props}
  />
));
TimelineContent.displayName = "TimelineContent";

export const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("text-sm font-semibold text-foreground leading-none", className)}
    {...props}
  />
));
TimelineTitle.displayName = "TimelineTitle";

export const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground leading-relaxed", className)}
    {...props}
  />
));
TimelineDescription.displayName = "TimelineDescription";

export const TimelineTime = React.forwardRef<
  HTMLTimeElement,
  React.TimeHTMLAttributes<HTMLTimeElement>
>(({ className, ...props }, ref) => (
  <time
    ref={ref}
    className={cn("text-xs font-mono text-muted-foreground", className)}
    {...props}
  />
));
TimelineTime.displayName = "TimelineTime";
