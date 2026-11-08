import React from "react";
import { NumberField } from "@usalyt/ui";

export function NumberFieldDemo() {
  return (
    <div className="w-full max-w-xs">
      <NumberField defaultValue={10} min={0} max={100} />
    </div>
  );
}
