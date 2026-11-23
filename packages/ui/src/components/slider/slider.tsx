import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "../../lib/utils";

export type SliderProps = React.ComponentPropsWithoutRef<typeof BaseSlider.Root>;

export const Slider = React.forwardRef<
  HTMLDivElement,
  SliderProps
>(({ className, "aria-label": ariaLabel, "aria-labelledby": ariaLabelledBy, ...props }, ref) => (
  <BaseSlider.Root
    ref={ref}
    aria-label={ariaLabel}
    aria-labelledby={ariaLabelledBy}
    className={cn(
      "relative flex w-full touch-none select-none items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
      className
    )}
    {...props}
  >
    <BaseSlider.Control className="relative flex w-full items-center data-[orientation=vertical]:h-full data-[orientation=vertical]:w-5 data-[orientation=vertical]:justify-center">
      <BaseSlider.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2 data-[orientation=vertical]:grow-0">
        <BaseSlider.Indicator className="absolute h-full bg-primary" />
      </BaseSlider.Track>
      <BaseSlider.Thumb
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
    </BaseSlider.Control>
  </BaseSlider.Root>
));

Slider.displayName = "Slider";
