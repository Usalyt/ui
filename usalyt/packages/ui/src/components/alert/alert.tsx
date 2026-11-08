import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

// Variant palette (DESIGN.md chromatics): success = pulse-green,
// destructive = coral-red, warning = signal-teal — signal-teal is the
// palette's non-danger attention hue (no amber exists in DESIGN.md).
// Ink pairs are theme-calibrated tokens: every text/icon pair holds
// >= 4.5:1 in BOTH themes (see src/test/palette-contract.test.ts).
export const alertVariants = cva(
  "relative w-full rounded-xl border p-4 backdrop-blur-md transition-[border-color,background-color,color] duration-200 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4",
  {
    variants: {
      variant: {
        default:
          "bg-secondary/70 border-border text-foreground [&>svg]:text-foreground",
        destructive:
          "border-coral-red/40 bg-coral-red/10 text-coral-red-foreground [&>svg]:text-coral-red-foreground",
        success:
          "border-pulse-green/40 bg-pulse-green/10 text-pulse-green-foreground [&>svg]:text-pulse-green-foreground",
        warning:
          "border-signal-teal/40 bg-signal-teal/10 text-signal-teal-foreground [&>svg]:text-signal-teal-foreground",
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
));
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight text-balance", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-xs leading-relaxed opacity-90 text-pretty", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertTitle, AlertDescription };
