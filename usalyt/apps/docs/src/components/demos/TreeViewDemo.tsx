import React from "react";
import { TreeView, TreeItem, TreeItemTrigger, TreeItemContent } from "@usalyt/ui";
import { Folder, File } from "lucide-react";

const files = ["button.tsx", "input.tsx", "tooltip.tsx"];

export function TreeViewDemo() {
  return (
    <div className="w-full max-w-xs rounded-lg border border-border bg-card p-2">
      <TreeView>
        <TreeItem defaultExpanded>
          <TreeItemTrigger>
            <span className="flex items-center gap-2 text-sm text-foreground">
              <Folder className="h-4 w-4 text-muted-foreground" />src
            </span>
          </TreeItemTrigger>
          <TreeItemContent>
            <TreeItem defaultExpanded>
              <TreeItemTrigger>
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <Folder className="h-4 w-4 text-muted-foreground" />components
                </span>
              </TreeItemTrigger>
              <TreeItemContent>
                {files.map((file) => (
                  <TreeItem key={file}>
                    <span className="flex items-center gap-2 pl-8 py-1 text-xs text-muted-foreground">
                      <File className="h-4 w-4" />
                      {file}
                    </span>
                  </TreeItem>
                ))}
              </TreeItemContent>
            </TreeItem>

            <TreeItem>
              <TreeItemTrigger>
                <span className="flex items-center gap-2 text-sm text-foreground">
                  <Folder className="h-4 w-4 text-muted-foreground" />lib
                </span>
              </TreeItemTrigger>
              <TreeItemContent>
                <TreeItem>
                  <span className="flex items-center gap-2 pl-8 py-1 text-xs text-muted-foreground">
                    <File className="h-4 w-4" />
                    utils.ts
                  </span>
                </TreeItem>
              </TreeItemContent>
            </TreeItem>
          </TreeItemContent>
        </TreeItem>

        <TreeItem>
          <span className="flex items-center gap-2 pl-8 py-1 text-xs text-muted-foreground">
            <File className="h-4 w-4" />
            package.json
          </span>
        </TreeItem>
      </TreeView>
    </div>
  );
}
