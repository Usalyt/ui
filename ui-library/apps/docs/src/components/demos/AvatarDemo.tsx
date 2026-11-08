import React from "react";
import { Avatar, AvatarImage, AvatarFallback } from "tu-ui";

export function AvatarDemo() {
  return (
    <div className="flex flex-wrap gap-6 items-center">
      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">With Image</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Initials Fallback</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Avatar>
          <AvatarFallback>UX</AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground">Custom Fallback</span>
      </div>
    </div>
  );
}
