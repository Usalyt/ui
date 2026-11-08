import React from "react";
import { Separator } from "@usalyt/ui";

export function SeparatorDemo() {
  return (
    <div className="w-full max-w-xs space-y-3">
      <div>
        <p className="text-sm font-medium leading-none">Radix UI</p>
        <p className="text-xs text-muted-foreground">An open-source UI component library.</p>
      </div>
      <Separator />
      <div className="flex h-5 items-center space-x-4 text-xs">
        <div>Blog</div>
        <Separator orientation="vertical" />
        <div>Docs</div>
        <Separator orientation="vertical" />
        <div>Source</div>
      </div>
    </div>
  );
}
