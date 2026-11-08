import React from "react";
import { Toaster, toast, Button } from "@usalyt/ui";

export function SonnerDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <Toaster position="bottom-right" />
      <Button
        variant="outline"
        onClick={() =>
          toast("Finding archived", {
            description: "It moved out of the open evaluation. You can restore it.",
            action: {
              label: "Undo",
              onClick: () =>
                toast("Finding restored", {
                  description: "It is back in the open evaluation.",
                }),
            },
          })
        }
      >
        Show a toast
      </Button>
      <p className="text-xs text-muted-foreground">
        Render <code className="font-mono">&lt;Toaster /&gt;</code> once near the
        root, then trigger <code className="font-mono">toast()</code> from
        anywhere.
      </p>
    </div>
  );
}
