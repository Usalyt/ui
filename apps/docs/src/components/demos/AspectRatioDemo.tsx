import React from "react";
import { AspectRatio } from "@usalyt/ui";
import { Play } from "lucide-react";

export function AspectRatioDemo() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <AspectRatio
        ratio={16 / 9}
        className="rounded-lg border border-border bg-muted/40"
      >
        <div className="flex h-full w-full flex-col items-center justify-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
            <Play className="h-4 w-4 text-muted-foreground" />
          </span>
          <p className="text-xs text-muted-foreground">
            16 / 9 placeholder — space is reserved before media loads
          </p>
        </div>
      </AspectRatio>

      <div className="flex items-start gap-3">
        <AspectRatio
          ratio={1}
          className="w-20 rounded-md border border-border bg-muted/40"
        >
          <span className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
            1:1
          </span>
        </AspectRatio>
        <AspectRatio
          ratio={4 / 3}
          className="w-28 rounded-md border border-border bg-muted/40"
        >
          <span className="flex h-full items-center justify-center font-mono text-xs text-muted-foreground">
            4:3
          </span>
        </AspectRatio>
        <p className="pt-1 text-xs leading-relaxed text-muted-foreground">
          The <code className="font-mono">ratio</code> prop accepts any number,
          so thumbnails keep their proportions too.
        </p>
      </div>
    </div>
  );
}
