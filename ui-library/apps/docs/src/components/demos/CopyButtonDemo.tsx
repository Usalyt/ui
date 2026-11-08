import React from "react";
import { CopyButton } from "tu-ui";

export function CopyButtonDemo() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <div className="flex items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2">
        <code className="font-mono text-sm text-foreground">
          pnpm dlx tu-ui add carousel
        </code>
        <CopyButton value="pnpm dlx tu-ui add carousel" />
      </div>
      <p className="text-xs text-muted-foreground">
        Copies the command to the clipboard; the icon flips to a check for two
        seconds.
      </p>
    </div>
  );
}
