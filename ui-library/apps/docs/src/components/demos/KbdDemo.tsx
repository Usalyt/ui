import React from "react";
import { Kbd } from "tu-ui";

const shortcuts = [
  { keys: ["⌘", "S"], label: "Save" },
  { keys: ["⌘", "F"], label: "Find" },
  { keys: ["⌘", "Z"], label: "Undo" },
  { keys: ["⌘", "B"], label: "Toggle navigation" },
];

export function KbdDemo() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-background px-3 py-2">
        <span className="text-sm text-muted-foreground">Search components…</span>
        <Kbd size="md">⌘K</Kbd>
      </div>

      <ul className="space-y-1.5">
        {shortcuts.map((shortcut) => (
          <li
            key={shortcut.label}
            className="flex items-center justify-between gap-4 text-sm text-foreground"
          >
            <span>{shortcut.label}</span>
            <span className="flex items-center gap-1.5">
              {shortcut.keys.map((key) => (
                <Kbd key={key} size="md">
                  {key}
                </Kbd>
              ))}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
