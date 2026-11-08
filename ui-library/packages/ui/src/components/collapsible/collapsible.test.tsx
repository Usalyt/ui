import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./collapsible";
import { Button } from "../button";

describe("Collapsible Primitive Component", () => {
  it("renders trigger button and expands content on click", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger render={<Button>Toggle Content</Button>} />
        <CollapsibleContent>
          <div>Hidden Detail Content</div>
        </CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole("button", { name: /toggle content/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByText("Hidden Detail Content")).toBeInTheDocument();
  });

  it("toggles state on Space key press when focused", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Collapsible onOpenChange={onOpenChange}>
        <CollapsibleTrigger render={<Button>Keyboard Toggle</Button>} />
        <CollapsibleContent>
          <div>Keyboard Content</div>
        </CollapsibleContent>
      </Collapsible>
    );

    const trigger = screen.getByRole("button", { name: /keyboard toggle/i });
    trigger.focus();
    expect(trigger).toHaveFocus();
    await user.keyboard(" ");
    expect(onOpenChange).toHaveBeenCalled();
  });

  it("renders open initially when defaultOpen is true", () => {
    render(
      <Collapsible defaultOpen>
        <CollapsibleTrigger render={<Button>Open Initially</Button>} />
        <CollapsibleContent>
          <div>Pre-opened Details</div>
        </CollapsibleContent>
      </Collapsible>
    );

    expect(screen.getByText("Pre-opened Details")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /open initially/i })
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("merges custom className on CollapsibleContent", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger render={<Button>Custom Class</Button>} />
        <CollapsibleContent className="my-custom-collapsible bg-muted p-4">
          <div>Custom Body</div>
        </CollapsibleContent>
      </Collapsible>
    );

    await user.click(screen.getByRole("button", { name: /custom class/i }));
    const body = await screen.findByText("Custom Body");
    expect(body.parentElement).toHaveClass("my-custom-collapsible");
  });

  it("forwards ref to CollapsibleContent element", async () => {
    const ref = createRef<HTMLDivElement>();
    const user = userEvent.setup();
    render(
      <Collapsible>
        <CollapsibleTrigger render={<Button>Ref Toggle</Button>} />
        <CollapsibleContent ref={ref}>Ref Content</CollapsibleContent>
      </Collapsible>
    );

    await user.click(screen.getByRole("button", { name: /ref toggle/i }));
    await screen.findByText("Ref Content");
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
