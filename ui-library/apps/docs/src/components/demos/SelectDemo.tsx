import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "tu-ui";

export function SelectDemo() {
  return (
    <div className="flex flex-wrap gap-6 items-center justify-center">
      <div className="w-56 space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Standard Select</span>
        <Select defaultValue="apple">
          <SelectTrigger>
            <SelectValue placeholder="Select a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
            <SelectItem value="blueberry">Blueberry</SelectItem>
            <SelectItem value="grapes">Grapes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-56 space-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">Pre-selected Value</span>
        <Select defaultValue="banana">
          <SelectTrigger>
            <SelectValue placeholder="Select fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="banana">Banana</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
