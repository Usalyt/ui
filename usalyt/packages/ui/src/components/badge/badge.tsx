import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium tabular-nums transition-[background-color,border-color,color] duration-150 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "text-foreground border-border bg-background hover:bg-accent hover:text-accent-foreground",
        neutral:
          "border-border bg-foreground/5 text-muted-foreground",
        "pulse-green":
          "border-pulse-green/40 bg-pulse-green/10 text-pulse-green-foreground",
        "coral-red":
          "border-coral-red/40 bg-coral-red/10 text-coral-red-foreground",
        "signal-teal":
          "border-signal-teal/40 bg-signal-teal/10 text-signal-teal-foreground",
        "iris-violet":
          "border-iris-violet/40 bg-iris-violet/10 text-iris-violet-foreground",
        lavender:
          "border-lavender/40 bg-lavender/10 text-lavender-foreground",
        "acid-lime":
          "border-transparent bg-acid-lime text-void font-semibold",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";
