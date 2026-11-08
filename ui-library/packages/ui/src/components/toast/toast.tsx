import * as React from "react";
import { Toast as BaseToast } from "@base-ui/react/toast";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../../lib/utils";

export const ToastProvider = BaseToast.Provider;
export const useToastManager = BaseToast.useToastManager;

export const ToastPortal = (props: React.ComponentProps<typeof BaseToast.Portal>) => (
  <BaseToast.Portal {...props} />
);
ToastPortal.displayName = "ToastPortal";

export const ToastPositioner = BaseToast.Positioner;

export const ToastViewport = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Viewport>
>(({ className, ...props }, ref) => (
  <BaseToast.Viewport
    ref={ref}
    className={cn(
      "fixed right-4 bottom-4 top-auto left-auto z-50 flex w-[min(calc(100vw-2rem),24rem)] flex-col items-end gap-2 outline-none",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

// Base UI retains toasts beyond `limit` as inert, promotable entries. Keep
// them out of layout flow so retained entries cannot push the stack offscreen.
export const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border border-border bg-popover text-popover-foreground p-4 shadow-subtle-2 transition-[opacity,translate,scale] duration-enter ease-out-expo data-starting-style:opacity-0 data-starting-style:translate-y-3 data-starting-style:scale-[0.97] data-ending-style:opacity-0 data-ending-style:translate-y-2 data-ending-style:scale-[0.98] data-ending-style:duration-exit data-limited:hidden",
  {
    variants: {
      variant: {
        default: "",
        destructive:
          "border-coral-red/40 bg-coral-red/10 text-coral-red-foreground",
        success:
          "border-pulse-green/40 bg-pulse-green/10 text-pulse-green-foreground",
        warning:
          "border-signal-teal/40 bg-signal-teal/10 text-signal-teal-foreground",
        info: "border-iris-violet/40 bg-iris-violet/10 text-iris-violet-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof BaseToast.Root>,
    VariantProps<typeof toastVariants> {}

export const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, role, "aria-live": ariaLive, ...props }, ref) => {
    const isDestructive = variant === "destructive";
    const defaultRole = isDestructive ? "alert" : "status";
    const defaultAriaLive = isDestructive ? "assertive" : "polite";

    return (
      <BaseToast.Root
        ref={ref}
        role={role ?? defaultRole}
        aria-live={ariaLive ?? defaultAriaLive}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Toast.displayName = "Toast";

export const ToastContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Content>
>(({ className, ...props }, ref) => (
  <BaseToast.Content
    ref={ref}
    className={cn("flex min-w-0 flex-1 flex-col gap-1", className)}
    {...props}
  />
));
ToastContent.displayName = "ToastContent";

export const ToastTitle = React.forwardRef<
  HTMLHeadingElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Title>
>(({ className, ...props }, ref) => (
  <BaseToast.Title
    ref={ref}
    className={cn("text-sm font-semibold leading-tight", className)}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

export const ToastDescription = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Description>
>(({ className, ...props }, ref) => (
  <BaseToast.Description
    ref={ref}
    className={cn("text-xs opacity-90 leading-relaxed", className)}
    {...props}
  />
));
ToastDescription.displayName = "ToastDescription";

export const ToastAction = BaseToast.Action;

export const ToastClose = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseToast.Close>
>(({ className, ...props }, ref) => (
  <BaseToast.Close
    ref={ref}
    aria-hidden={false}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-70 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring",
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" aria-hidden="true" />
    <span className="sr-only">Close</span>
  </BaseToast.Close>
));
ToastClose.displayName = "ToastClose";
