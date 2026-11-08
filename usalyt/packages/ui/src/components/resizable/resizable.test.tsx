import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./resizable";

describe("Resizable Primitive Component", () => {
  it("renders panel group with panels and handle", () => {
    const { container } = render(
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={50}>
          <div>Panel One</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={50}>
          <div>Panel Two</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    );

    expect(screen.getByText("Panel One")).toBeInTheDocument();
    expect(screen.getByText("Panel Two")).toBeInTheDocument();
    const handle = container.querySelector('[data-panel-resize-handle-id]');
    expect(handle).toBeInTheDocument();
  });

  it("renders vertical panel group direction", () => {
    const { container } = render(
      <ResizablePanelGroup direction="vertical">
        <ResizablePanel defaultSize={30}>Top</ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={70}>Bottom</ResizablePanel>
      </ResizablePanelGroup>
    );

    const group = container.querySelector('[data-panel-group-direction="vertical"]');
    expect(group).toBeInTheDocument();
  });
});
