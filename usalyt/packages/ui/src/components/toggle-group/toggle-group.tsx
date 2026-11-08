import * as React from "react";
import { ToggleGroup as BaseToggleGroup } from "@base-ui/react/toggle-group";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";
import { toggleVariants } from "../toggle/toggle";

const ToggleGroupContext = React.createContext<VariantProps<typeof toggleVariants>>({
  size: "md",
  variant: "default"
});

export interface ToggleGroupProps
  extends React.ComponentPropsWithoutRef<typeof BaseToggleGroup>,
    VariantProps<typeof toggleVariants> {}

export const ToggleGroup = React.forwardRef<HTMLDivElement, ToggleGroupProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <BaseToggleGroup
      ref={ref}
      className={cn("flex items-center justify-center gap-1", className)}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </BaseToggleGroup>
  )
);

ToggleGroup.displayName = "ToggleGroup";

export interface ToggleGroupItemProps
  extends React.ComponentPropsWithoutRef<typeof BaseToggle>,
    VariantProps<typeof toggleVariants> {}

export const ToggleGroupItem = React.forwardRef<HTMLButtonElement, ToggleGroupItemProps>(
  ({ className, children, variant, size, ...props }, ref) => {
    const context = React.useContext(ToggleGroupContext);
    return (
      <BaseToggle
        ref={ref}
        className={cn(
          toggleVariants({
            variant: context.variant || variant,
            size: context.size || size,
            className
          })
        )}
        {...props}
      >
        {children}
      </BaseToggle>
    );
  }
);

ToggleGroupItem.displayName = "ToggleGroupItem";
