import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui/react/scroll-area";
import { cn } from "../../lib/utils";

export const ScrollArea = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Root>
>(({ className, children, ...props }, ref) => (
  <BaseScrollArea.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <BaseScrollArea.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </BaseScrollArea.Viewport>
    <ScrollBar />
    <BaseScrollArea.Corner />
  </BaseScrollArea.Root>
));
ScrollArea.displayName = "ScrollArea";

export const ScrollBar = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Scrollbar> & {
    orientation?: "vertical" | "horizontal";
  }
>(({ className, orientation = "vertical", keepMounted = true, ...props }, ref) => (
  <BaseScrollArea.Scrollbar
    ref={ref}
    orientation={orientation}
    keepMounted={keepMounted}
    className={cn(
      "flex select-none touch-none transition-colors duration-150 p-0.5 bg-transparent hover:bg-muted/50",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent",
      orientation === "horizontal" &&
        "h-2.5 w-full flex-col border-t border-t-transparent",
      className
    )}
    {...props}
  >
    <BaseScrollArea.Thumb className="relative flex-1 rounded-full bg-border hover:bg-muted-foreground/60 transition-colors" />
  </BaseScrollArea.Scrollbar>
));
ScrollBar.displayName = "ScrollBar";
