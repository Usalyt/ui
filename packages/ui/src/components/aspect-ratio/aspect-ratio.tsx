import * as React from "react";
import { cn } from "../../lib/utils";

export interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
  asChild?: boolean;
}

export const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ className, ratio = 16 / 9, style, children, asChild = false, ...props }, ref) => {
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children as React.ReactElement<any>, {
        ref,
        style: {
          aspectRatio: `${ratio}`,
          ...(children.props as any).style,
          ...style,
        },
        className: cn("relative w-full", (children.props as any).className, className),
        ...props,
      });
    }

    return (
      <div
        ref={ref}
        style={{
          aspectRatio: `${ratio}`,
          ...style,
        }}
        className={cn("relative w-full overflow-hidden", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
AspectRatio.displayName = "AspectRatio";
