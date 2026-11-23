import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollArea, ScrollBar } from "./scroll-area";

describe("ScrollArea Primitive Component", () => {
  it("renders scroll area container with children", () => {
    render(
      <ScrollArea className="h-40 w-40">
        <div>Scrollable Content Paragraph</div>
      </ScrollArea>
    );

    expect(screen.getByText("Scrollable Content Paragraph")).toBeInTheDocument();
  });

  it("renders vertical scrollbar", () => {
    const { container } = render(
      <ScrollArea className="h-40 w-40">
        <ScrollBar orientation="vertical" data-testid="v-scrollbar" />
      </ScrollArea>
    );

    const vScroll = screen.getByTestId("v-scrollbar");
    expect(vScroll).toBeInTheDocument();
    expect(vScroll).toHaveClass("h-full");
  });

  it("renders horizontal scrollbar", () => {
    render(
      <ScrollArea className="h-40 w-40">
        <ScrollBar orientation="horizontal" data-testid="h-scrollbar" />
      </ScrollArea>
    );

    const hScroll = screen.getByTestId("h-scrollbar");
    expect(hScroll).toBeInTheDocument();
    expect(hScroll).toHaveClass("w-full");
  });

  it("forwards ref to ScrollArea root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ScrollArea ref={ref} className="h-40 w-40">
        <div>Ref Content</div>
      </ScrollArea>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveClass("relative");
  });
});
