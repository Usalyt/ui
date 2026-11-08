"use client";

import * as React from "react";
import { Layers, Play } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "../../components/resizable";
import {
  TreeView,
  TreeItem,
  TreeItemTrigger,
  TreeItemContent,
} from "../../components/tree-view";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { CopyButton } from "../../components/copy-button";

export interface DOMNodeItem {
  id: string;
  tag: string;
  selector: string;
  classes?: string;
  role?: string;
  children?: DOMNodeItem[];
}

export interface InspectorSplitViewProps
  extends React.HTMLAttributes<HTMLDivElement> {
  nodes?: DOMNodeItem[];
  selectedNodeId?: string;
  defaultSelectedNodeId?: string;
  onSelectNode?: (node: DOMNodeItem) => void;
  onAuditElement?: (node: DOMNodeItem) => void;
}

export function InspectorSplitView({
  nodes = [],
  selectedNodeId,
  defaultSelectedNodeId,
  onSelectNode,
  onAuditElement,
  className,
  ...props
}: InspectorSplitViewProps) {
  const isControlled = selectedNodeId !== undefined;
  const [internalSelectedId, setInternalSelectedId] = React.useState<
    string | null
  >(defaultSelectedNodeId ?? null);

  const currentId = isControlled ? selectedNodeId : internalSelectedId;
  const matchedNode = currentId ? findNodeById(nodes, currentId) : null;
  const selected = matchedNode ?? (!isControlled ? nodes[0] ?? null : null);

  const handleNodeClick = (node: DOMNodeItem) => {
    if (!isControlled) {
      setInternalSelectedId(node.id);
    }
    onSelectNode?.(node);
  };

  function renderTree(item: DOMNodeItem) {
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selected?.id === item.id;

    return (
      <TreeItem key={item.id} defaultExpanded>
        <TreeItemTrigger
          onClick={() => handleNodeClick(item)}
          className={cn(
            "min-w-0",
            isSelected && "bg-accent text-accent-foreground font-medium"
          )}
        >
          <span className="font-mono text-xs text-primary font-semibold">
            &lt;{item.tag}&gt;
          </span>
          <span className="font-mono text-xs text-muted-foreground truncate">
            {item.classes ? `.${item.classes.replace(/\s+/g, ".")}` : ""}
          </span>
        </TreeItemTrigger>
        {hasChildren && (
          <TreeItemContent>{item.children!.map(renderTree)}</TreeItemContent>
        )}
      </TreeItem>
    );
  }

  return (
    <div
      className={cn(
        "min-w-0 w-full max-w-full overflow-hidden rounded-lg border border-border bg-background shadow-xs h-[500px]",
        className
      )}
      {...props}
    >
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={40} minSize={25}>
          <div className="flex h-full min-w-0 flex-col border-r border-border/60">
            <div className="flex items-center gap-2 border-b border-border/60 p-3">
              <Layers className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                DOM Hierarchy
              </span>
            </div>
            <div className="min-w-0 flex-1 overflow-y-auto p-3">
              <TreeView>{nodes.map(renderTree)}</TreeView>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={60} minSize={30}>
          <div className="flex h-full min-w-0 flex-col overflow-y-auto bg-muted/10 p-4">
            {selected ? (
              <div className="flex min-w-0 flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Badge variant="outline" className="font-mono uppercase">
                      {selected.tag}
                    </Badge>
                    {selected.role && (
                      <Badge variant="secondary">role="{selected.role}"</Badge>
                    )}
                  </div>
                  {onAuditElement && (
                    <Button
                      size="sm"
                      onClick={() => onAuditElement(selected)}
                      className="gap-1 text-xs"
                    >
                      <Play className="h-3 w-3" />
                      <span>Audit Element</span>
                    </Button>
                  )}
                </div>

                <div className="min-w-0 space-y-3">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground">
                      Target Selector
                    </span>
                    <div className="mt-1 flex min-w-0 items-center justify-between gap-2 rounded-md border border-border bg-background p-2 font-mono text-xs">
                      <span className="min-w-0 truncate text-primary">
                        {selected.selector}
                      </span>
                      <CopyButton
                        value={selected.selector}
                        className="h-6 w-6 shrink-0"
                      />
                    </div>
                  </div>

                  {selected.classes && (
                    <div>
                      <span className="text-xs font-medium text-muted-foreground">
                        Class List
                      </span>
                      <div className="mt-1 rounded-md border border-border bg-background p-2 font-mono text-xs text-muted-foreground break-all">
                        {selected.classes}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Select an element from the DOM tree to inspect.
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

function findNodeById(nodes: DOMNodeItem[], id: string): DOMNodeItem | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNodeById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}
