import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "../../lib/utils";

export interface RatingProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  value?: number;
  defaultValue?: number;
  max?: number;
  readOnly?: boolean;
  onChange?: (value: number) => void;
}

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      value: valueProp,
      defaultValue = 0,
      max = 5,
      readOnly = false,
      onChange,
      className,
      onKeyDown,
      ...props
    },
    ref
  ) => {
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const radioRefs = React.useRef<Array<HTMLButtonElement | null>>([]);

    const isControlled = valueProp !== undefined;
    const value = isControlled ? valueProp : internalValue;

    const handleSelect = (val: number) => {
      if (readOnly) return;
      if (!isControlled) {
        setInternalValue(val);
      }
      onChange?.(val);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);

      if (readOnly) return;

      const { key } = e;
      if (
        key !== "ArrowRight" &&
        key !== "ArrowUp" &&
        key !== "ArrowLeft" &&
        key !== "ArrowDown" &&
        key !== "Home" &&
        key !== "End"
      ) {
        return;
      }

      e.preventDefault();

      const current = value >= 1 ? value : 1;
      let next = current;

      if (key === "ArrowRight" || key === "ArrowUp") {
        next = Math.min(max, current + 1);
      } else if (key === "ArrowLeft" || key === "ArrowDown") {
        next = Math.max(1, current - 1);
      } else if (key === "Home") {
        next = 1;
      } else if (key === "End") {
        next = max;
      }

      if (next !== value) {
        handleSelect(next);
      }
      radioRefs.current[next - 1]?.focus();
    };

    const tabbableValue = value >= 1 && value <= max ? value : 1;

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label="Rating"
        data-valuenow={value}
        className={cn("inline-flex items-center gap-1", className)}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {Array.from({ length: max }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = (hoverValue ?? value) >= starNumber;

          return (
            <button
              key={starNumber}
              ref={(node) => {
                radioRefs.current[index] = node;
              }}
              type="button"
              disabled={readOnly}
              aria-label={`${starNumber} of ${max} stars`}
              aria-checked={value === starNumber}
              role="radio"
              tabIndex={readOnly || starNumber !== tabbableValue ? -1 : 0}
              onMouseEnter={() => !readOnly && setHoverValue(starNumber)}
              onMouseLeave={() => !readOnly && setHoverValue(null)}
              onClick={() => handleSelect(starNumber)}
              className={cn(
                "rounded-xs p-0.5 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                readOnly
                  ? "cursor-default pointer-events-none"
                  : "cursor-pointer hover:scale-110 transition-transform"
              )}
            >
              <Star
                className={cn(
                  "h-4 w-4 transition-colors",
                  isFilled
                    ? "fill-pulse-green-foreground text-pulse-green-foreground"
                    : "fill-transparent text-muted-foreground/40"
                )}
              />
            </button>
          );
        })}
      </div>
    );
  }
);
Rating.displayName = "Rating";
