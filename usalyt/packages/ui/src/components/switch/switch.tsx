import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "../../lib/utils";

export type SwitchProps = React.ComponentPropsWithoutRef<typeof BaseSwitch.Root>;

export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, ...props }, ref) => (
    <BaseSwitch.Root
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-input data-[checked]:bg-primary data-[unchecked]:bg-input",
        className
      )}
      {...props}
      ref={ref}
    >
      <BaseSwitch.Thumb
        className={cn(
          "pointer-events-none block h-4 w-4 rounded-full bg-background dark:bg-mist shadow-md ring-0 transition-[transform,background-color] duration-200 ease-out data-[checked]:translate-x-4 data-[unchecked]:translate-x-0 data-[checked]:bg-primary-foreground"
        )}
      />
    </BaseSwitch.Root>
  )
);

Switch.displayName = "Switch";
