import React from "react";
import { ColorSwatch } from "tu-ui";

const tokens = [
  { token: "--color-acid-lime", color: "#e4f222" },
  { token: "--color-pulse-green", color: "#27a644" },
  { token: "--color-signal-teal", color: "#02b8cc" },
  { token: "--color-paper", color: "#ffffff" },
  { token: "--color-void", color: "#08090a" },
];

export function ColorSwatchDemo() {
  return (
    <ul className="w-full max-w-sm space-y-2">
      {tokens.map(({ token, color }) => (
        <li
          key={token}
          className="flex items-center justify-between gap-4 rounded-md border border-border bg-card px-3 py-2"
        >
          <span className="min-w-0 truncate font-mono text-xs text-muted-foreground">
            {token}
          </span>
          <ColorSwatch color={color} />
        </li>
      ))}
    </ul>
  );
}
