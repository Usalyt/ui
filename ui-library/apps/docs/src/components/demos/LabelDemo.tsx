import React from "react";
import { Label, Checkbox } from "tu-ui";

export function LabelDemo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms-label" />
      <Label htmlFor="terms-label">Accept terms and conditions</Label>
    </div>
  );
}
