import React from "react";

export interface PropItem {
  name: string;
  type: string;
  defaultValue?: string;
  description: string;
}

interface PropsTableProps {
  props: PropItem[];
}

/**
 * Props table for component doc pages.
 *
 * Token-sourced styling only (no hardcoded palette values) so every cell pair
 * clears WCAG 2 AA in both themes: prop names in foreground mono, types in the
 * signal-teal ink token, defaults in muted fog, descriptions in muted body-sm.
 */
export function PropsTable({ props }: PropsTableProps) {
  if (!props || props.length === 0) {
    return null;
  }

  return (
    <div className="not-content my-6 overflow-hidden rounded-xl border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="w-[18%] px-4 py-3 text-label font-medium uppercase tracking-wider text-muted-foreground">
                Prop
              </th>
              <th className="w-[28%] px-4 py-3 text-label font-medium uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th className="w-[14%] px-4 py-3 text-label font-medium uppercase tracking-wider text-muted-foreground">
                Default
              </th>
              <th className="w-[40%] px-4 py-3 text-label font-medium uppercase tracking-wider text-muted-foreground">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {props.map((p, idx) => (
              <tr
                key={p.name}
                className={idx === props.length - 1 ? "" : "border-b border-border"}
              >
                <td className="px-4 py-3 align-top font-mono text-body-sm text-foreground">
                  <code>{p.name}</code>
                </td>
                <td className="break-words px-4 py-3 align-top font-mono text-body-sm text-signal-teal-foreground">
                  <code>{p.type}</code>
                </td>
                <td className="px-4 py-3 align-top font-mono text-body-sm text-muted-foreground">
                  <code>{p.defaultValue || "—"}</code>
                </td>
                <td className="px-4 py-3 align-top text-body-sm text-muted-foreground">
                  {p.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
