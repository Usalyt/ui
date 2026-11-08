import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const kbdVariants = cva(
  "inline-flex items-center justify-center select-none font-mono font-medium rounded-sm border border-border bg-card text-foreground",
  {
    variants: {
      variant: {
        default: "bg-card text-foreground border-border",
        outline: "bg-background text-foreground border-border",
        secondary: "bg-secondary text-secondary-foreground border-transparent",
        ghost: "border-transparent bg-transparent text-muted-foreground",
      },
      size: {
        sm: "h-5 min-w-5 px-1 text-[10px]",
        md: "h-6 min-w-6 px-1.5 text-xs",
        lg: "h-7 min-w-7 px-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {}

export const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, variant, size, ...props }, ref) => (
    <kbd
      ref={ref}
      className={cn(kbdVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Kbd.displayName = "Kbd";
