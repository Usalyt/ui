import React from "react";
import { ToggleGroup, ToggleGroupItem } from "@usalyt/ui";

export function ToggleGroupDemo() {
  return (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <span className="font-bold text-sm">B</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <span className="italic text-sm">I</span>
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <span className="underline text-sm">U</span>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
