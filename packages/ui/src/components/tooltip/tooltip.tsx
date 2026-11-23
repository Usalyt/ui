import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "../../lib/utils";

export const TooltipProvider = BaseTooltip.Provider;
export const Tooltip = BaseTooltip.Root;
export const TooltipTrigger = BaseTooltip.Trigger;
export const TooltipPortal = BaseTooltip.Portal;

export const TooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseTooltip.Popup> & {
    sideOffset?: number;
  }
>(({ className, sideOffset = 4, role = "tooltip", ...props }, ref) => (
  <TooltipPortal>
    <BaseTooltip.Positioner sideOffset={sideOffset}>
      <BaseTooltip.Popup
        ref={ref}
        role={role}
        className={cn(
          "z-50 overflow-hidden rounded-sm border border-border bg-popover px-3 py-1.5 text-xs text-popover-foreground shadow-(--shadow-xl) outline-none data-open:animate-overlay-in data-closed:animate-overlay-out",
          className
        )}
        {...props}
      />
    </BaseTooltip.Positioner>
  </TooltipPortal>
));
TooltipContent.displayName = "TooltipContent";
