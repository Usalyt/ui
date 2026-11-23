import React from "react";
import { Badge } from "@usalyt/ui";

export function BadgeDemo() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant="default">Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant="pulse-green">Pulse Green</Badge>
        <Badge variant="coral-red">Coral Red</Badge>
        <Badge variant="signal-teal">Signal Teal</Badge>
        <Badge variant="iris-violet">Iris Violet</Badge>
        <Badge variant="lavender">Lavender</Badge>
        <Badge variant="acid-lime">Acid Lime</Badge>
      </div>
    </div>
  );
}
