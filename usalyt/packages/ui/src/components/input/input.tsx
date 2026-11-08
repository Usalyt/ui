import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

export const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-field text-foreground px-3 py-1 text-sm transition-[border-color,box-shadow,background-color] duration-150 ease-out file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-fog focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive",
  {
    variants: {
      inputSize: {
        sm: "h-8 px-2 text-xs rounded-md",
        md: "h-9 px-3 text-sm rounded-md",
        lg: "h-10 px-4 text-base rounded-md",
      },
    },
    defaultVariants: {
      inputSize: "md",
    },
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", inputSize, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ inputSize, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
