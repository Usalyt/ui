import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,border-color,color,fill,stroke,opacity,box-shadow,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-subtle-3 hover:bg-primary/90 hover:shadow-subtle-4 tracking-[-0.011em]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-border bg-background text-secondary-foreground hover:bg-accent hover:text-accent-foreground hover:border-ring",
        secondary:
          "border border-border bg-secondary text-secondary-foreground hover:bg-accent hover:border-border",
        ghost: "hover:bg-accent hover:text-accent-foreground text-secondary-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        pill: "bg-paper text-void rounded-full shadow-subtle-3 hover:bg-bone font-medium",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-9 px-4",
        lg: "h-10 px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      disabled,
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <BaseButton
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        render={asChild ? undefined : <button />}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {loading ? (
          <>
            <Loader2
              data-testid="button-spinner"
              className="h-4 w-4 animate-spin shrink-0"
              aria-hidden="true"
            />
            <span className="sr-only">Loading...</span>
            {children}
          </>
        ) : (
          children
        )}
      </BaseButton>
    );
  }
);

Button.displayName = "Button";
