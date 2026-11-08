import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const progressVariants = cva(
  "relative w-full overflow-hidden rounded-full bg-secondary transition-all duration-200",
  {
    variants: {
      size: {
        sm: "h-1.5",
        md: "h-3",
        lg: "h-5",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const indicatorVariants = cva(
  "h-full w-full flex-1 transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary",
        neutral: "bg-muted-foreground",
        success: "bg-pulse-green-foreground",
        warning: "bg-signal-teal-foreground",
        destructive: "bg-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ProgressProps
  extends Omit<React.ComponentPropsWithoutRef<typeof BaseProgress.Root>, "value">,
    VariantProps<typeof progressVariants> {
  value?: number;
  variant?: "default" | "neutral" | "success" | "warning" | "destructive";
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value = 0, size, variant = "default", ...props }, ref) => (
    <BaseProgress.Root
      ref={ref}
      value={value}
      className={cn(progressVariants({ size }), className)}
      {...props}
    >
      <BaseProgress.Track className="h-full w-full">
        <BaseProgress.Indicator
          className={cn(indicatorVariants({ variant }))}
          style={{ transform: `translateX(-${100 - Math.min(100, Math.max(0, value))})%` }}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  )
);
Progress.displayName = "Progress";
