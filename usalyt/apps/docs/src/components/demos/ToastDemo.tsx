import React from "react";
import { Button } from "@usalyt/ui";

export function ToastDemo() {
  const [show, setShow] = React.useState(false);

  return (
    <div className="flex flex-col items-center gap-4">
      <Button variant="outline" onClick={() => setShow(!show)}>
        {show ? "Hide Toast Notification" : "Trigger Toast Notification"}
      </Button>

      {show && (
        <div className="flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-lg w-80 animate-in fade-in slide-in-from-bottom-2">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">Event Created</h4>
            <p className="text-xs text-muted-foreground">Friday, January 10, 2025 at 3:00 PM</p>
          </div>
          <Button size="sm" variant="ghost" onClick={() => setShow(false)}>
            Undo
          </Button>
        </div>
      )}
    </div>
  );
}
