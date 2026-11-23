import React from "react";
import { Progress } from "@usalyt/ui";

export function ProgressDemo() {
  return (
    <div className="flex flex-col gap-5 w-full max-w-md">
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Uploading assets...</span>
          <span>25%</span>
        </div>
        <Progress value={25} />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Processing export...</span>
          <span>65%</span>
        </div>
        <Progress value={65} />
      </div>

      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Complete</span>
          <span>100%</span>
        </div>
        <Progress value={100} />
      </div>
    </div>
  );
}
