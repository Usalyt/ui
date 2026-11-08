import React from "react";
import { ScrollArea, ScrollBar } from "tu-ui";

export function ScrollAreaDemo() {
  return (
    <ScrollArea className="h-40 w-60 rounded-md border p-4">
      <div className="space-y-2">
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} className="text-sm">
            Scrollable Item {i + 1}
          </div>
        ))}
      </div>
      <ScrollBar />
    </ScrollArea>
  );
}
