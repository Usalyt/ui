import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  TreeView,
  TreeItem,
  TreeItemTrigger,
  TreeItemContent,
} from "./tree-view";
import { Folder, File } from "lucide-react";

const meta: Meta<typeof TreeView> = {
  title: "Primitives/TreeView",
  component: TreeView,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-64 rounded-md border border-border p-3">
      <TreeView>
        <TreeItem defaultExpanded>
          <TreeItemTrigger>
            <Folder className="h-4 w-4 text-signal-teal-foreground" />
            <span>src</span>
          </TreeItemTrigger>
          <TreeItemContent>
            <TreeItem defaultExpanded>
              <TreeItemTrigger>
                <Folder className="h-4 w-4 text-signal-teal-foreground" />
                <span>components</span>
              </TreeItemTrigger>
              <TreeItemContent>
                <TreeItem>
                  <TreeItemTrigger>
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span>button.tsx</span>
                  </TreeItemTrigger>
                </TreeItem>
                <TreeItem>
                  <TreeItemTrigger>
                    <File className="h-4 w-4 text-muted-foreground" />
                    <span>dialog.tsx</span>
                  </TreeItemTrigger>
                </TreeItem>
              </TreeItemContent>
            </TreeItem>
            <TreeItem>
              <TreeItemTrigger>
                <File className="h-4 w-4 text-muted-foreground" />
                <span>index.ts</span>
              </TreeItemTrigger>
            </TreeItem>
          </TreeItemContent>
        </TreeItem>
      </TreeView>
    </div>
  ),
};
