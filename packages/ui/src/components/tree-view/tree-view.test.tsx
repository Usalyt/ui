import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  TreeView,
  TreeItem,
  TreeItemTrigger,
  TreeItemContent,
} from "./tree-view";

describe("TreeView Primitive Component", () => {
  it("renders tree and toggles child group on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <TreeView>
        <TreeItem defaultExpanded={false}>
          <TreeItemTrigger>DOM Root</TreeItemTrigger>
          <TreeItemContent>
            <TreeItem>
              <TreeItemTrigger>body</TreeItemTrigger>
            </TreeItem>
          </TreeItemContent>
        </TreeItem>
      </TreeView>
    );

    expect(screen.getByRole("tree")).toBeInTheDocument();
    expect(screen.getByText("DOM Root")).toBeInTheDocument();
    expect(screen.queryByText("body")).not.toBeInTheDocument();

    await user.click(screen.getByText("DOM Root"));
    expect(screen.getByText("body")).toBeInTheDocument();
    expect(screen.getByRole("group")).toBeInTheDocument();
  });
});
