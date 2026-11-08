import React from "react";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@usalyt/ui";

export function ResizableDemo() {
  return (
    <div className="w-full max-w-md space-y-2">
      <ResizablePanelGroup
        direction="horizontal"
        className="h-[240px] rounded-lg border border-border bg-card"
      >
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="flex h-full flex-col gap-1 p-4">
            <span className="text-sm font-medium text-foreground">Navigation</span>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Drag the handles to rebalance the panes.
            </p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize first two panels" />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full flex-col gap-1 border-l border-border p-4">
            <span className="text-sm font-medium text-foreground">Preview</span>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Panels keep their declared minimum sizes while you drag.
            </p>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle aria-label="Resize last two panels" />
        <ResizablePanel defaultSize={25} minSize={20}>
          <div className="flex h-full flex-col gap-1 border-l border-border p-4">
            <span className="text-sm font-medium text-foreground">Inspector</span>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Constraints stay token-based in both themes.
            </p>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
      <p className="text-center text-xs text-muted-foreground">
        Keyboard focus works on the handles too.
      </p>
    </div>
  );
}
