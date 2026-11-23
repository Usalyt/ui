import React from "react";
import { Checkbox, Label } from "@usalyt/ui";

export function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="terms-checked" defaultChecked />
        <Label htmlFor="terms-checked">Checked Option</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms-unchecked" />
        <Label htmlFor="terms-unchecked">Unchecked Option</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="terms-disabled" disabled />
        <Label htmlFor="terms-disabled">Disabled Option</Label>
      </div>
    </div>
  );
}
