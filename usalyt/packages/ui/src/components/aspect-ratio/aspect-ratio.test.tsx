import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AspectRatio } from "./aspect-ratio";

describe("AspectRatio Primitive Component", () => {
  it("renders with default ratio of 16/9", () => {
    const { container } = render(
      <AspectRatio>
        <img src="/test.jpg" alt="Test Preview" />
      </AspectRatio>
    );

    const el = container.firstElementChild as HTMLElement;
    expect(el).toBeInTheDocument();
    expect(el.style.aspectRatio).toContain("1.7777777777777777");
    expect(screen.getByAltText("Test Preview")).toBeInTheDocument();
  });

  it("renders with custom ratio 4/3", () => {
    const { container } = render(
      <AspectRatio ratio={4 / 3}>
        <div>Custom Content</div>
      </AspectRatio>
    );

    const el = container.firstElementChild as HTMLElement;
    expect(el.style.aspectRatio).toContain("1.3333333333333333");
    expect(screen.getByText("Custom Content")).toBeInTheDocument();
  });

  it("renders with asChild properly merging styles", () => {
    render(
      <AspectRatio ratio={1} asChild>
        <section data-testid="custom-child">Child Section</section>
      </AspectRatio>
    );

    const child = screen.getByTestId("custom-child");
    expect(child).toBeInTheDocument();
    expect(child.style.aspectRatio).toContain("1");
  });
});
