import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Display-only color reference: a chip painted with `color` plus the supplied
 * CSS color string as readable text. Intentionally noninteractive — no picker,
 * no copy control, no fake role and no tab stop. The adjacent value carries
 * the non-color-only information, so the chip itself is hidden from assistive
 * technology to avoid a redundant announcement.
 */
export const colorSwatchVariants = cva(
  "inline-flex min-w-0 items-center align-middle",
  {
    variants: {
      size: {
        sm: "gap-1.5 text-[11px]",
        md: "gap-2 text-xs",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const colorSwatchChipVariants = cva(
  "shrink-0 rounded-[3px] border border-border ring-1 ring-inset ring-foreground/10",
  {
    variants: {
      size: {
        sm: "size-3",
        md: "size-4",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface ColorSwatchProps
  extends Omit<React.HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof colorSwatchVariants> {
  /** Any valid CSS color string; rendered verbatim as the visible value. */
  color: string;
}

export const ColorSwatch = React.forwardRef<HTMLSpanElement, ColorSwatchProps>(
  ({ color, size, className, ...props }, ref) => {
    const resolvedSize = size ?? "md";

    return (
      <span
        ref={ref}
        className={cn(colorSwatchVariants({ size: resolvedSize }), className)}
        {...props}
      >
        <span
          aria-hidden="true"
          className={colorSwatchChipVariants({ size: resolvedSize })}
          style={{ backgroundColor: color }}
        />
        <span className="whitespace-nowrap font-mono text-foreground">
          {color}
        </span>
      </span>
    );
  }
);

ColorSwatch.displayName = "ColorSwatch";
