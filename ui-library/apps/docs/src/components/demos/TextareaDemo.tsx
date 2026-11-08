import React from "react";
import { Textarea } from "@usalyt/ui";

export function TextareaDemo() {
  return (
    <div className="w-full max-w-xs">
      <Textarea placeholder="Type your message here." rows={4} />
    </div>
  );
}
