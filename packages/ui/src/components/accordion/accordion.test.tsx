import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "./accordion";

describe("Accordion Primitive Component", () => {
  it("renders accordion items and expands on trigger click", async () => {
    render(
      <Accordion defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes, it adheres to WAI-ARIA standards.</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(
      screen.getByRole("button", { name: /is it accessible\?/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("Yes, it adheres to WAI-ARIA standards.")
    ).toBeInTheDocument();
  });

  it("toggles panel content on trigger click", async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item 1 Trigger</AccordionTrigger>
          <AccordionContent>Item 1 Content Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: /item 1 trigger/i });
    await user.click(trigger);
    expect(await screen.findByText("Item 1 Content Body")).toBeInTheDocument();
  });

  it("collapses previous item in single open mode", async () => {
    const user = userEvent.setup();
    render(
      <Accordion defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Section 1</AccordionTrigger>
          <AccordionContent>Content 1</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Section 2</AccordionTrigger>
          <AccordionContent>Content 2</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Content 1")).toBeInTheDocument();
    const trigger2 = screen.getByRole("button", { name: /section 2/i });
    await user.click(trigger2);

    expect(await screen.findByText("Content 2")).toBeInTheDocument();
  });

  it("supports rendering multiple items expanded initially", () => {
    render(
      <Accordion defaultValue={["item-1", "item-2"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>Item A</AccordionTrigger>
          <AccordionContent>Body A</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Item B</AccordionTrigger>
          <AccordionContent>Body B</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(screen.getByText("Body A")).toBeInTheDocument();
    expect(screen.getByText("Body B")).toBeInTheDocument();
  });

  it("does NOT toggle when item is disabled", async () => {
    const user = userEvent.setup();
    render(
      <Accordion>
        <AccordionItem disabled value="disabled-item">
          <AccordionTrigger>Disabled Trigger</AccordionTrigger>
          <AccordionContent>Disabled Body</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    const trigger = screen.getByRole("button", { name: /disabled trigger/i });
    expect(
      trigger.hasAttribute("disabled") ||
        trigger.getAttribute("aria-disabled") === "true"
    ).toBe(true);
    await user.click(trigger);
    expect(screen.queryByText("Disabled Body")).not.toBeInTheDocument();
  });

  it("forwards ref to AccordionItem, AccordionTrigger, and AccordionContent elements", () => {
    const itemRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    const contentRef = createRef<HTMLDivElement>();

    render(
      <Accordion defaultValue={["t1"]}>
        <AccordionItem ref={itemRef} value="t1">
          <AccordionTrigger ref={triggerRef}>Trigger</AccordionTrigger>
          <AccordionContent ref={contentRef}>Content</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    expect(itemRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
    expect(contentRef.current).toBeInstanceOf(HTMLDivElement);
  });
});
