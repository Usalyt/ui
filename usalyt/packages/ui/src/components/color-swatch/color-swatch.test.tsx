import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ColorSwatch } from "./color-swatch";
import { ColorSwatch as PublicColorSwatch } from "../../index";

function getChip(root: HTMLElement): HTMLElement {
  const chip = root.querySelector<HTMLElement>('[aria-hidden="true"]');
  if (!chip) {
    throw new Error("ColorSwatch chip not found");
  }
  return chip;
}

describe("ColorSwatch Primitive Component", () => {
  it("paints the supplied color and preserves the visible hex string", () => {
    const { container } = render(<ColorSwatch color="#e4f222" />);
    const root = container.firstElementChild as HTMLElement;

    expect(screen.getByText("#e4f222")).toBeInTheDocument();
    expect(getChip(root)).toHaveStyle({
      backgroundColor: "rgb(228, 242, 34)",
    });
  });

  it("accepts any valid CSS color string and keeps it verbatim", () => {
    const { container } = render(
      <ColorSwatch color="rgb(2, 184, 204)" />
    );
    const root = container.firstElementChild as HTMLElement;

    expect(screen.getByText("rgb(2, 184, 204)")).toBeInTheDocument();
    expect(getChip(root)).toHaveStyle({
      backgroundColor: "rgb(2, 184, 204)",
    });
  });

  it("forwards a typed ref and native attributes to the root span", () => {
    const ref = createRef<HTMLSpanElement>();
    render(
      <ColorSwatch
        ref={ref}
        color="#27a644"
        className="custom-swatch"
        data-token="pulse-green"
        title="Pulse green token"
      />
    );

    const root = ref.current;
    expect(root).toBeInstanceOf(HTMLSpanElement);
    expect(root).toHaveAttribute("data-token", "pulse-green");
    expect(root).toHaveAttribute("title", "Pulse green token");
    expect(root).toHaveClass("custom-swatch");
  });

  it("stays display-only: no role, tab stop, pointer affordance or handler", () => {
    const { container } = render(<ColorSwatch color="#ffffff" />);
    const root = container.firstElementChild as HTMLElement;

    expect(root).not.toHaveAttribute("role");
    expect(root).not.toHaveAttribute("tabindex");
    expect(root).not.toHaveAttribute("onclick");
    expect(root.className).not.toContain("cursor-pointer");
    expect(screen.getByText("#ffffff")).not.toHaveAttribute("aria-hidden");
    expect(getChip(root)).toHaveAttribute("aria-hidden", "true");
  });

  it("keeps the value nonwrapping and in the readable theme foreground", () => {
    const { container } = render(<ColorSwatch color="#8b5cf6" />);
    const root = container.firstElementChild as HTMLElement;
    const value = screen.getByText("#8b5cf6");

    expect(value).toHaveClass("whitespace-nowrap");
    expect(value).toHaveClass("text-foreground");
    expect(getChip(root).className).toContain("border-border");
  });

  it("is exported from the package root with the same implementation", () => {
    expect(PublicColorSwatch).toBe(ColorSwatch);

    const { container } = render(<PublicColorSwatch color="#6366f1" />);
    expect(container.firstElementChild?.tagName).toBe("SPAN");
    expect(screen.getByText("#6366f1")).toBeInTheDocument();
  });
});
