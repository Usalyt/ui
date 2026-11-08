import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";

describe("Tabs Primitive Component", () => {
  it("renders tabs list and panel content", () => {
    render(
      <Tabs defaultValue="account">
        <TabsList aria-label="Manage Account">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">Account Details</TabsContent>
        <TabsContent value="password">Password Settings</TabsContent>
      </Tabs>
    );

    expect(screen.getByRole("tab", { name: /account/i })).toBeInTheDocument();
    expect(screen.getByText("Account Details")).toBeInTheDocument();
  });

  it("switches active panel when tab trigger is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="tab1">
        <TabsList aria-label="Test Tabs">
          <TabsTrigger value="tab1">Tab 1</TabsTrigger>
          <TabsTrigger value="tab2">Tab 2</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    const tab2 = screen.getByRole("tab", { name: /tab 2/i });
    await user.click(tab2);
    expect(screen.getByText("Content 2")).toBeInTheDocument();
  });

  it("does NOT activate disabled tab trigger on click", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="tab1">
        <TabsList aria-label="Disabled Tab Test">
          <TabsTrigger value="tab1">Active Tab</TabsTrigger>
          <TabsTrigger disabled value="tab2">
            Disabled Tab
          </TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    const disabledTab = screen.getByRole("tab", { name: /disabled tab/i });
    expect(disabledTab).toHaveAttribute("aria-disabled", "true");
    await user.click(disabledTab);
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
  });

  it("navigates triggers with ArrowRight key", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="tab1">
        <TabsList aria-label="Keyboard Nav">
          <TabsTrigger value="tab1">First</TabsTrigger>
          <TabsTrigger value="tab2">Second</TabsTrigger>
        </TabsList>
        <TabsContent value="tab1">Content 1</TabsContent>
        <TabsContent value="tab2">Content 2</TabsContent>
      </Tabs>
    );

    const firstTab = screen.getByRole("tab", { name: /first/i });
    firstTab.focus();
    await user.keyboard("{ArrowRight}");
    const secondTab = screen.getByRole("tab", { name: /second/i });
    expect(secondTab).toBeInTheDocument();
  });

  it("marks the selected trigger with the Base UI emitted data-active attribute and the single selected idiom", async () => {
    const user = userEvent.setup();
    render(
      <Tabs defaultValue="overview">
        <TabsList aria-label="Selected State">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">Overview panel</TabsContent>
        <TabsContent value="settings">Settings panel</TabsContent>
      </Tabs>
    );

    const settings = screen.getByRole("tab", { name: /settings/i });
    await user.click(settings);

    // Base UI v1.6.0 Tabs.Tab emits `data-active` when selected.
    expect(settings).toHaveAttribute("data-active");
    expect(settings).not.toHaveAttribute("data-selected");
    expect(settings).not.toHaveAttribute("data-state");

    // Single underline idiom (owner redesign): hairline list + 2px primary
    // underline on the active trigger. NO background fill, NO shadow.
    const className = settings.className;
    expect(className).toContain("data-active:text-foreground");
    expect(className).toContain("data-active:border-primary");
    expect(className).toContain("border-b-2");
    expect(className).toContain("border-transparent");
    // No competing background fill for the selected state.
    expect(className).not.toContain("data-active:bg-");
    expect(className).not.toContain("data-active:shadow");

    // The list renders the hairline rail (border-b) instead of a pill fill.
    const list = screen.getByRole("tablist");
    expect(list.className).toContain("border-b");
    expect(list.className).not.toContain("bg-muted");
    expect(list.className).not.toContain("rounded-lg");
    // Dead or hedged state selectors must not remain.
    expect(className).not.toContain("data-[selected]");
    expect(className).not.toContain("data-[state=active]");
  });

  it("styles the list as the underline rail with muted triggers and clears default radii", () => {
    render(
      <Tabs defaultValue="one">
        <TabsList aria-label="Contract">
          <TabsTrigger value="one">One</TabsTrigger>
        </TabsList>
        <TabsContent value="one">One panel</TabsContent>
      </Tabs>
    );

    const list = screen.getByRole("tablist");
    expect(list.className).toContain("flex");
    expect(list.className).toContain("flex-wrap");
    expect(list.className).toContain("items-center");
    expect(list.className).toContain("gap-1");
    expect(list.className).toContain("border-b");
    expect(list.className).toContain("border-border");
    // The old segmented-pill surface must not survive the redesign.
    expect(list.className).not.toContain("bg-muted");
    expect(list.className).not.toMatch(/\bp-1\b/);
    expect(list.className).not.toContain("h-9");

    const trigger = screen.getByRole("tab", { name: /one/i });
    expect(trigger.className).not.toContain("rounded-md");
    expect(trigger.className).not.toContain("font-medium");
    expect(trigger.className).toContain("text-[13px]");
    // Hairline rail sits on the list; the trigger carries border-b-2
    // transparent until active (via data-active:border-* variants).
    expect(trigger.className).toContain("border-transparent");
    expect(trigger.className).not.toContain("data-active:bg-");
  });

  it("forwards ref to TabsList and TabsTrigger DOM elements", () => {
    const listRef = createRef<HTMLDivElement>();
    const triggerRef = createRef<HTMLButtonElement>();
    render(
      <Tabs defaultValue="t1">
        <TabsList ref={listRef}>
          <TabsTrigger ref={triggerRef} value="t1">
            Tab
          </TabsTrigger>
        </TabsList>
        <TabsContent value="t1">Content</TabsContent>
      </Tabs>
    );

    expect(listRef.current).toBeInstanceOf(HTMLDivElement);
    expect(triggerRef.current).toBeInstanceOf(HTMLButtonElement);
  });
});
