import React from "react";
import fs from "node:fs";
import path from "node:path";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { PaginationDemo } from "../../../../apps/docs/src/components/demos/PaginationDemo";
import { StepperDemo } from "../../../../apps/docs/src/components/demos/StepperDemo";
import { KbdDemo } from "../../../../apps/docs/src/components/demos/KbdDemo";

const docsRoot = path.resolve(process.cwd(), "../../apps/docs");
const popoverDocsPath = path.join(
  docsRoot,
  "src/content/docs/components/popover.mdx"
);
const astroConfigPath = path.join(docsRoot, "astro.config.mjs");

describe("Documentation component usability", () => {
  it("shows aria-current on pages four through six and truthful page text", async () => {
    const user = userEvent.setup();
    render(<PaginationDemo />);

    const next = screen.getByLabelText(/go to next page/i);
    for (const pageNumber of [2, 3, 4, 5, 6]) {
      await user.click(next);
      expect(
        await screen.findByText(`Page ${pageNumber} of 7`)
      ).toBeInTheDocument();

      const activeLinks = screen
        .getAllByRole("link")
        .filter(link => link.getAttribute("aria-current") === "page");

      if (pageNumber >= 4) {
        expect(activeLinks).toHaveLength(1);
        expect(activeLinks[0]).toHaveTextContent(String(pageNumber));
      }
    }
  });

  it("keeps stepper current-step, Next and Back behavior intact", async () => {
    const user = userEvent.setup();
    const { container } = render(<StepperDemo />);

    expect(container.querySelector('[aria-current="step"]')).toHaveTextContent(
      "Scope"
    );
    const next = screen.getByRole("button", { name: "Next" });
    const back = screen.getByRole("button", { name: "Back" });
    expect(back).toBeDisabled();

    await user.click(next);
    expect(container.querySelector('[aria-current="step"]')).toHaveTextContent(
      "Evaluate"
    );
    expect(back).toBeEnabled();

    await user.click(back);
    expect(container.querySelector('[aria-current="step"]')).toHaveTextContent(
      "Scope"
    );
  });

  it("uses readable native kbd chips without fake interaction roles", () => {
    const { container } = render(<KbdDemo />);
    const chips = [...container.querySelectorAll("kbd")];

    expect(chips).toHaveLength(9);
    for (const chip of chips) {
      expect(chip.tagName).toBe("KBD");
      expect(chip).not.toHaveAttribute("role");
      expect(chip.className).toContain("h-6");
      expect(chip.className).toContain("text-xs");
    }
  });

  it("shows a complete public Popover usage example", () => {
    const docs = fs.readFileSync(popoverDocsPath, "utf8");
    const usage = docs.slice(
      docs.indexOf("## Usage"),
      docs.indexOf("## Props")
    );

    expect(usage).toContain("PopoverTrigger");
    expect(usage).toContain("PopoverContent");
    expect(usage).not.toContain("return <Popover />");
  });

  it("does not paint the code-frame active marker as a primary action", () => {
    const config = fs.readFileSync(astroConfigPath, "utf8");
    expect(config).toContain(
      'editorActiveTabIndicatorTopColor: "var(--color-border)"'
    );
    expect(config).not.toContain(
      'editorActiveTabIndicatorTopColor: "var(--color-primary)"'
    );
  });
});
