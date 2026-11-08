import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "../../lib/utils";

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof BaseCheckbox.Root> {
  indeterminate?: boolean;
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, indeterminate, ...props }, ref) => {
    // `checked` doubles as the indeterminate sentinel ("indeterminate") in the
    // public API, but it must never force itself onto the uncontrolled
    // (defaultChecked) path: forcing a computed `checked` on the root makes
    // Base UI treat the checkbox as controlled and silently resets
    // defaultChecked to false — the docs "Checked Option" preview rendered
    // unchecked (owner report). Only pass a controlled `checked` when the
    // caller actually supplied one.
    const isIndeterminate = Boolean(
      indeterminate || (checked as unknown) === "indeterminate"
    );
    const isChecked =
      checked === undefined ? undefined : Boolean(checked === true || isIndeterminate);

    return (
      <BaseCheckbox.Root
        ref={ref}
        {...(isChecked === undefined ? {} : { checked: isChecked })}
        indeterminate={isIndeterminate || undefined}
        {...props}
        className={cn(
          // In-system paints: neutral hairline at rest (radio-group accent
          // discipline), token fill when checked/indeterminate, no native
          // input chrome; disabled = 50%.
          "peer h-4 w-4 shrink-0 rounded-sm border border-smoke bg-transparent text-foreground outline-none transition-colors duration-150 hover:border-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:bg-primary data-[checked]:border-primary data-[checked]:text-primary-foreground data-[indeterminate]:bg-primary data-[indeterminate]:border-primary data-[indeterminate]:text-primary-foreground",
          className
        )}
      >
        <BaseCheckbox.Indicator className="flex items-center justify-center text-current">
          {isIndeterminate ? (
            <Minus
              data-testid="checkbox-minus-icon"
              className="h-3 w-3 stroke-[3]"
            />
          ) : (
            <Check
              data-testid="checkbox-check-icon"
              className="h-3.5 w-3.5 stroke-[3]"
            />
          )}
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
    );
  }
);

Checkbox.displayName = "Checkbox";
