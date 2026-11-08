"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button, type ButtonProps } from "../button";

export interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  value: string;
  onCopy?: () => void;
  timeout?: number;
}

export const CopyButton = React.forwardRef<HTMLButtonElement, CopyButtonProps>(
  (
    {
      value,
      onCopy,
      timeout = 2000,
      className,
      variant = "ghost",
      size = "icon",
      children,
      ...props
    },
    ref
  ) => {
    const [hasCopied, setHasCopied] = React.useState(false);

    const copyToClipboard = React.useCallback(async () => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard) {
          await navigator.clipboard.writeText(value);
        }
        setHasCopied(true);
        onCopy?.();
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }, [value, onCopy]);

    React.useEffect(() => {
      if (!hasCopied) return;
      const timer = setTimeout(() => {
        setHasCopied(false);
      }, timeout);

      return () => clearTimeout(timer);
    }, [hasCopied, timeout]);

    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        onClick={copyToClipboard}
        aria-label={hasCopied ? "Copied to clipboard" : "Copy to clipboard"}
        className={cn("h-8 w-8 transition-colors", className)}
        {...props}
      >
        {children ??
          (hasCopied ? (
            <Check className="h-4 w-4 text-pulse-green-foreground" />
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          ))}
      </Button>
    );
  }
);
CopyButton.displayName = "CopyButton";
