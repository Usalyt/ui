import * as React from "react";
import { Check, AlertCircle } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex w-full",
        orientation === "horizontal"
          ? "flex-row items-center justify-between"
          : "flex-col items-start gap-4",
        className
      )}
      {...props}
    />
  )
);
Stepper.displayName = "Stepper";

export interface StepProps extends React.HTMLAttributes<HTMLDivElement> {
  status?: "active" | "completed" | "inactive" | "error" | "disabled";
  stepNumber?: number;
}

export const Step = React.forwardRef<HTMLDivElement, StepProps>(
  ({ className, status = "inactive", stepNumber, children, ...props }, ref) => (
    <div
      ref={ref}
      aria-current={status === "active" ? "step" : undefined}
      className={cn(
        "flex items-center gap-3",
        status === "disabled" && "opacity-50 pointer-events-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
);
Step.displayName = "Step";

const stepIndicatorVariants = cva(
  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
  {
    variants: {
      status: {
        active: "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2",
        completed: "bg-primary text-primary-foreground",
        inactive: "border border-border bg-muted text-muted-foreground",
        error: "bg-destructive text-destructive-foreground",
        disabled: "border border-border bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      status: "inactive",
    },
  }
);

export interface StepIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stepIndicatorVariants> {
  stepNumber?: number;
}

export const StepIndicator = React.forwardRef<HTMLDivElement, StepIndicatorProps>(
  ({ className, status = "inactive", stepNumber, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(stepIndicatorVariants({ status }), className)}
        {...props}
      >
        {status === "completed" ? (
          <Check className="h-4 w-4" />
        ) : status === "error" ? (
          <AlertCircle className="h-4 w-4" />
        ) : (
          children ?? stepNumber
        )}
      </div>
    );
  }
);
StepIndicator.displayName = "StepIndicator";

export const StepTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h4
    ref={ref}
    className={cn("text-sm font-medium text-foreground", className)}
    {...props}
  />
));
StepTitle.displayName = "StepTitle";

export const StepDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-xs text-muted-foreground", className)}
    {...props}
  />
));
StepDescription.displayName = "StepDescription";

export const StepSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("h-[2px] flex-1 bg-border mx-2 min-w-4", className)}
    {...props}
  />
));
StepSeparator.displayName = "StepSeparator";
