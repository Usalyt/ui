import * as React from "react";
import { Select as BaseSelect } from "@base-ui/react/select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export const Select = BaseSelect.Root;
export const SelectValue = BaseSelect.Value;
export const SelectPortal = BaseSelect.Portal;

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.Trigger
    ref={ref}
    className={cn(
      "flex h-9 w-full items-center justify-between rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    )}
    {...props}
  >
    {children}
    <BaseSelect.Icon>
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
    </BaseSelect.Icon>
  </BaseSelect.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Popup> & {
    align?: "start" | "center" | "end";
    sideOffset?: number;
  }
>(({ className, align = "start", sideOffset = 4, ...props }, ref) => (
  <SelectPortal>
    <BaseSelect.Positioner align={align} sideOffset={sideOffset}>
      <BaseSelect.Popup
        ref={ref}
        className={cn(
          // `w-[var(--anchor-width)]` tracks the trigger width exactly: the
          // Base UI v1.6.0 positioner writes `--anchor-width` inline on the
          // floating element (utils/useAnchorPositioning), and the popup
          // inherits it. Same mechanism Combobox uses.
          "relative z-50 w-[var(--anchor-width)] min-w-[8rem] overflow-hidden rounded-lg border border-border bg-popover text-popover-foreground shadow-(--shadow-xl) outline-none data-open:animate-overlay-in data-closed:animate-overlay-out p-1",
          className
        )}
        {...props}
      />
    </BaseSelect.Positioner>
  </SelectPortal>
));
SelectContent.displayName = "SelectContent";

export const SelectGroup = BaseSelect.Group;

export const SelectLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.GroupLabel>
>(({ className, ...props }, ref) => (
  <BaseSelect.GroupLabel
    ref={ref}
    className={cn("px-2 py-1.5 text-xs font-semibold text-muted-foreground", className)}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseSelect.Item>
>(({ className, children, ...props }, ref) => (
  <BaseSelect.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2.5 py-1.5 text-xs outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[selected]:font-semibold",
      className
    )}
    {...props}
  >
    <BaseSelect.ItemText>{children}</BaseSelect.ItemText>
    <BaseSelect.ItemIndicator>
      <Check className="h-3.5 w-3.5 text-primary shrink-0 ml-2" />
    </BaseSelect.ItemIndicator>
  </BaseSelect.Item>
));
SelectItem.displayName = "SelectItem";
