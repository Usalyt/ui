"use client";

import * as React from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "../../lib/utils";

export const HoverCard = ({
  open,
  defaultOpen,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) => {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen ?? false);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  return (
    <BasePopover.Root open={isOpen} onOpenChange={handleOpenChange}>
      {children}
    </BasePopover.Root>
  );
};

/**
 * Hover-to-open trigger.
 *
 * Base UI's `Popover.Trigger` owns the hover interaction: `openOnHover` turns
 * the pointer rest over the trigger into an open (after `delay` ms), and
 * `closeDelay` keeps the card alive long enough for the pointer to travel into
 * it — Base UI's safe-polygon keeps the popup open along that path. Keyboard
 * focus and activation still work through the native button semantics the
 * trigger renders (Enter/Space open, Escape closes and restores focus).
 */
export const HoverCardTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Trigger> & {
    delay?: number;
    closeDelay?: number;
  }
>(({ openOnHover = true, delay = 300, closeDelay = 100, ...props }, ref) => (
  <BasePopover.Trigger
    ref={ref}
    openOnHover={openOnHover}
    delay={delay}
    closeDelay={closeDelay}
    {...props}
  />
));
HoverCardTrigger.displayName = "HoverCardTrigger";

export const HoverCardPortal = BasePopover.Portal;

export const HoverCardContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Popup> & {
    align?: "start" | "center" | "end";
    sideOffset?: number;
  }
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <HoverCardPortal>
    <BasePopover.Positioner align={align} sideOffset={sideOffset}>
      <BasePopover.Popup
        ref={ref}
        className={cn(
          "z-50 w-72 rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-(--shadow-xl) outline-none data-open:animate-overlay-in data-closed:animate-overlay-out",
          className
        )}
        {...props}
      />
    </BasePopover.Positioner>
  </HoverCardPortal>
));
HoverCardContent.displayName = "HoverCardContent";
