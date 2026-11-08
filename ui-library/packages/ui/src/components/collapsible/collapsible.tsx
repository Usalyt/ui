import * as React from "react";
import { Collapsible as BaseCollapsible } from "@base-ui/react/collapsible";
import { cn } from "../../lib/utils";

export const Collapsible = BaseCollapsible.Root;
export const CollapsibleTrigger = BaseCollapsible.Trigger;

export const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseCollapsible.Panel>
>(({ className, children, ...props }, ref) => (
  <BaseCollapsible.Panel
    ref={ref}
    className={cn(
      "h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-enter ease-out-expo data-starting-style:h-0 data-ending-style:h-0",
      className
    )}
    {...props}
  >
    {children}
  </BaseCollapsible.Panel>
));
CollapsibleContent.displayName = "CollapsibleContent";
