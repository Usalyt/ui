import React from "react";
import { Slider } from "@usalyt/ui";

export function SliderDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-sm">
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">Default Slider (50%)</span>
        <Slider defaultValue={[50]} max={100} step={1} />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">Step Slider (Step 20)</span>
        <Slider defaultValue={[40]} max={100} step={20} />
      </div>
    </div>
  );
}
