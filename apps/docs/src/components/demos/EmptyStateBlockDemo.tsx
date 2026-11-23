import React from "react";
import { EmptyStateBlock } from "@usalyt/ui";
import { ClipboardCheck } from "lucide-react";

export function EmptyStateBlockDemo() {
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  return (
    <div className="w-full space-y-2">
      <EmptyStateBlock
        icon={<ClipboardCheck className="h-6 w-6 text-primary" />}
        title="No heuristic evaluations yet"
        description="Inspect elements on the page or launch the extension to log your first findings."
        actionLabel="Launch Extension"
        secondaryActionLabel="View Docs"
        onAction={() => setLastAction("Extension launch requested")}
        onSecondaryAction={() => setLastAction("Opening the evaluation guide")}
      />
      {lastAction && (
        <p className="text-center text-xs text-muted-foreground" role="status">
          {lastAction}
        </p>
      )}
    </div>
  );
}
