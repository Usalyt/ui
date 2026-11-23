import React from "react";
import { Toggle } from "@usalyt/ui";

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bold">
      <span className="font-bold text-sm">B</span>
    </Toggle>
  );
}
