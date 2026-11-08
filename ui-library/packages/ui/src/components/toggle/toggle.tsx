import * as React from "react";
import { Toggle as BaseToggle } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all duration-150 ease-out hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] data-[pressed]:bg-accent data-[pressed]:text-accent-foreground data-[pressed]:font-semibold",
  {
    variants: {
      variant: {
        default: "bg-transparent text-foreground/80",
        outline: "border border-input/80 bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground data-[pressed]:border-primary"
      },
      size: {
        sm: "h-8 px-2.5 min-w-8 text-xs",
        md: "h-9 px-3.5 min-w-9 text-sm",
        lg: "h-10 px-4 min-w-10 text-base"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

export interface ToggleProps
  extends React.ComponentPropsWithoutRef<typeof BaseToggle>,
    VariantProps<typeof toggleVariants> {}

export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(
  ({ className, variant, size, ...props }, ref) => (
    <BaseToggle
      ref={ref}
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
);

Toggle.displayName = "Toggle";
