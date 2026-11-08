import React from "react";
import { Button } from "@usalyt/ui";

export function ButtonDemo() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-xl">
      <div className="space-y-2">
        <p className="text-label font-semibold text-muted-foreground uppercase tracking-wider">Variants</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button variant="default">CTA (Acid Lime)</Button>
          <Button variant="pill">Pill</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-label font-semibold text-muted-foreground uppercase tracking-wider">Sizes</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-label font-semibold text-muted-foreground uppercase tracking-wider">States</p>
        <div className="flex flex-wrap gap-3 items-center">
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>Outline Disabled</Button>
        </div>
      </div>
    </div>
  );
}
