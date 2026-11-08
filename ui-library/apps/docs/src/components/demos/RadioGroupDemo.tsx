import React from "react";
import { RadioGroup, RadioGroupItem, Label } from "@usalyt/ui";

export function RadioGroupDemo() {
  return (
    <RadioGroup defaultValue="option-one" className="space-y-2">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-one" id="option-one" />
        <Label htmlFor="option-one">Default Option</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="option-two" id="option-two" />
        <Label htmlFor="option-two">Comfortable</Label>
      </div>
    </RadioGroup>
  );
}
