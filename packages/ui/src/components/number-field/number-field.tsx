import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { Minus, Plus } from "lucide-react";
import { cn } from "../../lib/utils";

export type NumberFieldProps = React.ComponentPropsWithoutRef<
  typeof BaseNumberField.Root
>;

export const NumberField = React.forwardRef<HTMLDivElement, NumberFieldProps>(
  ({ className, children, "aria-label": ariaLabel, ...props }, ref) => (
    <BaseNumberField.Root
      ref={ref}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-background",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <BaseNumberField.Decrement
            className="flex h-9 w-9 items-center justify-center rounded-l-md border-r border-border text-foreground transition-colors hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Decrease value"
          >
            <Minus className="h-4 w-4" />
          </BaseNumberField.Decrement>
          <BaseNumberField.Input
            aria-label={ariaLabel ?? "Value"}
            className="h-9 w-16 bg-transparent text-center text-sm font-semibold text-foreground focus:outline-none disabled:opacity-40"
          />
          <BaseNumberField.Increment
            className="flex h-9 w-9 items-center justify-center rounded-r-md border-l border-border text-foreground transition-colors hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Increase value"
          >
            <Plus className="h-4 w-4" />
          </BaseNumberField.Increment>
        </>
      )}
    </BaseNumberField.Root>
  )
);
NumberField.displayName = "NumberField";

export const NumberFieldInput = BaseNumberField.Input;
export const NumberFieldIncrement = BaseNumberField.Increment;
export const NumberFieldDecrement = BaseNumberField.Decrement;
