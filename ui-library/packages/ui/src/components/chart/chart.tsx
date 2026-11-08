import * as React from "react";
import { cn } from "../../lib/utils";

export interface ChartContainerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
}

export const ChartContainer = React.forwardRef<
  HTMLDivElement,
  ChartContainerProps
>(({ title = "Chart", description, className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      role="img"
      aria-label={title}
      className={cn(
        "w-full p-4 rounded-xl border border-border bg-background text-foreground space-y-3 backdrop-blur-md",
        className
      )}
      {...props}
    >
      <div className="flex flex-col space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="relative w-full overflow-hidden flex items-center justify-center min-h-[160px]">
        {children}
      </div>
    </div>
  );
});

ChartContainer.displayName = "ChartContainer";

export interface ChartLegendProps
  extends React.HTMLAttributes<HTMLDivElement> {
  items: { label: string; color: string }[];
}

export const ChartLegend = React.forwardRef<HTMLDivElement, ChartLegendProps>(
  ({ items, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap gap-4 pt-2 text-xs text-muted-foreground",
          className
        )}
        {...props}
      >
        {items.map((item) => (
          <div key={item.label} className="flex items-center space-x-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="font-medium text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    );
  }
);

ChartLegend.displayName = "ChartLegend";

export interface ChartEmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export const ChartEmptyState = React.forwardRef<
  HTMLDivElement,
  ChartEmptyStateProps
>(({ message = "No data available", className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center text-xs text-muted-foreground rounded-lg border border-dashed border-border w-full",
        className
      )}
      {...props}
    >
      <span>{message}</span>
    </div>
  );
});

ChartEmptyState.displayName = "ChartEmptyState";
