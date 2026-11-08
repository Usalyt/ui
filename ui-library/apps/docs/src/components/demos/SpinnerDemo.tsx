import React from "react";
import { Spinner, Button } from "@usalyt/ui";

export function SpinnerDemo() {
  return (
    <div className="flex flex-col gap-6 items-center">
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <Spinner size="sm" />
          <span className="text-xs text-muted-foreground">Small</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="md" />
          <span className="text-xs text-muted-foreground">Medium</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Spinner size="lg" />
          <span className="text-xs text-muted-foreground">Large</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button disabled className="gap-2">
          <Spinner size="sm" />
          <span>Processing...</span>
        </Button>
      </div>
    </div>
  );
}
