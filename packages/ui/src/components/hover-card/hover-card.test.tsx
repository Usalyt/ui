import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./hover-card";

describe("HoverCard Primitive Component", () => {
  it("renders trigger element", () => {
    render(
      <HoverCard>
        <HoverCardTrigger>Hover over @username</HoverCardTrigger>
        <HoverCardContent>User Profile Card</HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByText("Hover over @username")).toBeInTheDocument();
  });

  it("renders card content when open prop is true", () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>@antigravity</HoverCardTrigger>
        <HoverCardContent>
          <div>User Bio Preview</div>
        </HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByText("User Bio Preview")).toBeInTheDocument();
  });

  it("merges custom className on HoverCardContent popup", () => {
    render(
      <HoverCard open>
        <HoverCardTrigger>@dev</HoverCardTrigger>
        <HoverCardContent className="my-custom-hover-card p-6">
          <div>Custom Content</div>
        </HoverCardContent>
      </HoverCard>
    );

    expect(screen.getByText("Custom Content").parentElement).toHaveClass(
      "my-custom-hover-card"
    );
  });

  it("forwards ref to HoverCardContent popup element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <HoverCard open>
        <HoverCardTrigger>Ref Test</HoverCardTrigger>
        <HoverCardContent ref={ref}>
          <div>Ref Body</div>
        </HoverCardContent>
      </HoverCard>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
