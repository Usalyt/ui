import * as React from "react";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { cn } from "../../lib/utils";

export type RadioGroupProps = React.ComponentPropsWithoutRef<
  typeof BaseRadioGroup
>;

export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ className, ...props }, ref) => {
    return (
      <BaseRadioGroup
        className={cn("grid gap-2.5", className)}
        {...props}
        ref={ref}
      />
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export type RadioGroupItemProps = React.ComponentPropsWithoutRef<
  typeof BaseRadio.Root
>;

/**
 * Unchecked radios are neutral hairlines (`border-smoke` on transparent, fog
 * on hover); the checked state takes the semantic `primary` fill with a
 * foreground dot. The lime/void flip between themes therefore stays a token
 * decision instead of a hardcoded hue.
 */
export const RadioGroupItem = React.forwardRef<
  HTMLButtonElement,
  RadioGroupItemProps
>(({ className, ...props }, ref) => {
  return (
    <BaseRadio.Root
      ref={ref}
      className={cn(
        "peer aspect-square h-4 w-4 shrink-0 cursor-pointer rounded-full border border-smoke bg-transparent text-foreground outline-none transition-colors duration-150 hover:border-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-checked:border-primary data-checked:bg-primary",
        className
      )}
      {...props}
    >
      <BaseRadio.Indicator className="flex h-full w-full items-center justify-center">
        <span
          data-testid="radio-dot"
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full bg-primary-foreground"
        />
      </BaseRadio.Indicator>
    </BaseRadio.Root>
  );
});
RadioGroupItem.displayName = "RadioGroupItem";
