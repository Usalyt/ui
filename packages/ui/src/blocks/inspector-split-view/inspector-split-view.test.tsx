import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { InspectorSplitView, type DOMNodeItem } from "./inspector-split-view";

const sampleNodes: DOMNodeItem[] = [
  {
    id: "node-1",
    tag: "main",
    selector: "main.content-area",
    classes: "content-area p-4",
    children: [
      {
        id: "node-2",
        tag: "button",
        selector: "button.submit-btn",
        classes: "submit-btn rounded",
        role: "button",
      },
    ],
  },
];

describe("InspectorSplitView Block", () => {
  it("renders tree nodes and updates details on node click", async () => {
    const user = userEvent.setup();
    const handleSelect = vi.fn();
    const handleAudit = vi.fn();

    render(
      <InspectorSplitView
        nodes={sampleNodes}
        onSelectNode={handleSelect}
        onAuditElement={handleAudit}
      />
    );

    expect(screen.getByText(/dom hierarchy/i)).toBeInTheDocument();
    expect(screen.getByText("<main>")).toBeInTheDocument();

    const buttonNode = screen.getByText("<button>");
    await user.click(buttonNode);

    expect(handleSelect).toHaveBeenCalledWith(sampleNodes[0].children![0]);
    expect(screen.getByText("button.submit-btn")).toBeInTheDocument();

    const auditBtn = screen.getByRole("button", { name: /audit element/i });
    await user.click(auditBtn);
    expect(handleAudit).toHaveBeenCalledWith(sampleNodes[0].children![0]);
  });

  it("derives details from the current nodes prop without stale objects", () => {
    const { rerender } = render(<InspectorSplitView nodes={sampleNodes} />);

    expect(screen.getByText("main.content-area")).toBeInTheDocument();

    const updatedNodes: DOMNodeItem[] = [
      {
        ...sampleNodes[0],
        selector: "main.updated-area",
        classes: "updated-area",
      },
    ];
    rerender(<InspectorSplitView nodes={updatedNodes} />);

    expect(screen.getByText("main.updated-area")).toBeInTheDocument();
    expect(screen.queryByText("main.content-area")).not.toBeInTheDocument();
  });

  it("follows controlled selectedNodeId changes", () => {
    const { rerender } = render(
      <InspectorSplitView nodes={sampleNodes} selectedNodeId="node-2" />
    );

    expect(screen.getByText("button.submit-btn")).toBeInTheDocument();

    rerender(
      <InspectorSplitView nodes={sampleNodes} selectedNodeId="node-1" />
    );

    expect(screen.getByText("main.content-area")).toBeInTheDocument();
  });

  it("selects the first node when nodes arrive after mount", () => {
    const { rerender } = render(<InspectorSplitView nodes={[]} />);

    expect(
      screen.getByText(/select an element from the dom tree/i)
    ).toBeInTheDocument();

    rerender(<InspectorSplitView nodes={sampleNodes} />);

    expect(screen.getByText("main.content-area")).toBeInTheDocument();
  });
});
