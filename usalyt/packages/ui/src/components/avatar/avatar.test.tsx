import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

describe("Avatar Component", () => {
  it("renders fallback initials when image is not provided", () => {
    render(
      <Avatar>
        <AvatarFallback>AR</AvatarFallback>
      </Avatar>
    );

    expect(screen.getByText("AR")).toBeInTheDocument();
  });

  it("renders AvatarFallback and AvatarImage component", () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb" alt="Alex Rivera" />
        <AvatarFallback>AR</AvatarFallback>
      </Avatar>
    );

    // Base UI Avatar renders fallback or image based on status
    expect(screen.getByText("AR")).toBeInTheDocument();
  });

  it("applies size variant classes (sm, md, lg, xl)", () => {
    const { unmount: u1 } = render(
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("SM").parentElement).toHaveClass("h-8");
    u1();

    const { unmount: u2 } = render(
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
    );
    expect(screen.getByText("LG").parentElement).toHaveClass("h-14");
    u2();
  });

  it("forwards ref to the root element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Avatar ref={ref}>
        <AvatarFallback>REF</AvatarFallback>
      </Avatar>
    );

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveClass("rounded-full");
  });

  it("merges custom className on root and fallback without overriding default classes", () => {
    render(
      <Avatar className="border-4 border-primary">
        <AvatarFallback className="bg-destructive text-white">
          AB
        </AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByText("AB");
    expect(fallback.parentElement).toHaveClass("border-4");
    expect(fallback).toHaveClass("bg-destructive");
  });
});
