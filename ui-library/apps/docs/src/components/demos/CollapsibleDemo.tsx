"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "tu-ui";

export function CollapsibleDemo() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full max-w-sm rounded-lg border border-border bg-card overflow-hidden"
    >
      <CollapsibleTrigger className="group flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
        <span className="text-sm font-w510 text-card-foreground">
          @peduarte starred 3 repositories
        </span>
        <ChevronDown
          className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-enter ease-out-expo group-data-panel-open:rotate-180"
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pb-3">
        <div className="border-t border-border pt-2">
          <div className="rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            @radix-ui/primitives
          </div>
          <div className="rounded-md px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
            @base-ui/react
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
