import React from "react";
import { InspectorSplitView, type DOMNodeItem } from "@usalyt/ui";

const sampleNodes: DOMNodeItem[] = [
  {
    id: "dom-html",
    tag: "html",
    selector: "html",
    children: [
      {
        id: "dom-body",
        tag: "body",
        selector: "body.theme-dark",
        classes: "theme-dark antialiased",
        children: [
          {
            id: "dom-header",
            tag: "header",
            selector: "header.navbar",
            classes: "navbar flex border-b",
            children: [
              {
                id: "dom-nav-btn",
                tag: "button",
                selector: "button.nav-toggle",
                classes: "nav-toggle p-2",
                role: "button",
              },
            ],
          },
          {
            id: "dom-main",
            tag: "main",
            selector: "main.container",
            classes: "container mx-auto py-8",
            children: [
              {
                id: "dom-btn-checkout",
                tag: "button",
                selector: "button#checkout-btn.btn-primary",
                classes: "btn-primary w-full py-3",
                role: "button",
              },
            ],
          },
        ],
      },
    ],
  },
];

export function InspectorSplitViewDemo() {
  const [selectedNodeId, setSelectedNodeId] = React.useState("dom-btn-checkout");
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl space-y-2">
      <div className="relative h-[520px] overflow-hidden [transform:translateZ(0)]">
        <InspectorSplitView
          nodes={sampleNodes}
          selectedNodeId={selectedNodeId}
          onSelectNode={(node) => {
            setSelectedNodeId(node.id);
            setLastAction(`Selected ${node.selector}`);
          }}
          onAuditElement={(node) => setLastAction(`Auditing ${node.selector}…`)}
        />
      </div>
      {lastAction && (
        <p className="text-center text-xs text-muted-foreground" role="status">
          {lastAction}
        </p>
      )}
    </div>
  );
}
