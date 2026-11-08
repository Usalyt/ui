import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export const Accordion = BaseAccordion.Root;

export const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Item>
>(({ className, ...props }, ref) => (
  <BaseAccordion.Item
    ref={ref}
    className={cn("border-b border-border/70 transition-colors duration-150", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionHeader = BaseAccordion.Header;

export const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Trigger>
>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Header className="flex">
    <BaseAccordion.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-[color,transform] duration-200 ease-out hover:underline active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm [&[data-panel-open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ease-out text-muted-foreground" />
    </BaseAccordion.Trigger>
  </BaseAccordion.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof BaseAccordion.Panel>
>(({ className, children, ...props }, ref) => (
  <BaseAccordion.Panel
    ref={ref}
    className={cn(
      "h-(--accordion-panel-height) overflow-hidden text-sm transition-[height] duration-enter ease-out-expo data-starting-style:h-0 data-ending-style:h-0",
      className
    )}
    {...props}
  >
    <div className="pb-4 pt-0 text-muted-foreground leading-relaxed text-pretty">{children}</div>
  </BaseAccordion.Panel>
));
AccordionContent.displayName = "AccordionContent";
