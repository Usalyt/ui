import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./sheet";
import { Button } from "../button";

describe("Sheet Component", () => {
  it("renders trigger button and opens right-side sheet on click", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button>Open Sheet</Button>} />
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>Navigation Menu</SheetTitle>
            <SheetDescription>Main navigation options.</SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /open sheet/i }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Navigation Menu")).toBeInTheDocument();
    expect(screen.getByText("Main navigation options.")).toBeInTheDocument();
  });

  it("applies left side placement styling when side='left'", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button>Open Left Sheet</Button>} />
        <SheetContent side="left">
          <SheetTitle>Left Panel</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole("button", { name: /open left sheet/i }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveClass("left-0");
    expect(dialog).toHaveClass("border-r");
  });

  it("applies bottom side placement styling when side='bottom'", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button>Open Bottom Sheet</Button>} />
        <SheetContent side="bottom">
          <SheetTitle>Bottom Panel</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(
      screen.getByRole("button", { name: /open bottom sheet/i })
    );
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveClass("bottom-0");
    expect(dialog).toHaveClass("border-t");
  });

  it("renders SheetFooter with action buttons", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button>Open Footer Sheet</Button>} />
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Confirm Action</SheetTitle>
          </SheetHeader>
          <SheetFooter>
            <Button variant="outline">Cancel</Button>
            <Button variant="default">Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    await user.click(
      screen.getByRole("button", { name: /open footer sheet/i })
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("closes sheet when close button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button>Open Sheet</Button>} />
        <SheetContent>
          <SheetTitle>Dismissable Sheet</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole("button", { name: /open sheet/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    const closeButton = screen.getByRole("button", { name: "Close" });
    await user.click(closeButton);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("Sheet overlay spacing and containment", () => {
  it("gives footer actions a base gap while keeping the desktop row", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button>Open Spacing Sheet</Button>} />
        <SheetContent>
          <SheetTitle>Spacing Sheet</SheetTitle>
          <SheetFooter>
            <SheetClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Save</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole("button", { name: /open spacing sheet/i }));
    const dialog = await screen.findByRole("dialog");
    const footer = dialog.querySelector(".flex-col-reverse");

    expect(footer).not.toBeNull();
    expect(footer).toHaveClass("gap-2");
    expect(footer).toHaveClass("sm:flex-row");
    expect(footer).not.toHaveClass("sm:space-x-2");
  });

  it("keeps a right panel full height with bounded content scrolling", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button>Open Scroll Sheet</Button>} />
        <SheetContent side="right">
          <SheetTitle>Scroll Sheet</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole("button", { name: /open scroll sheet/i }));
    const dialog = await screen.findByRole("dialog");

    expect(dialog).toHaveClass("h-full");
    expect(dialog).toHaveClass("overflow-y-auto");
    expect(dialog).toHaveClass("overscroll-contain");
    expect(dialog).not.toHaveClass("max-h-[calc(100dvh-2rem)]");
  });

  it("bounds a bottom panel relative to the viewport while preserving caller padding", async () => {
    const user = userEvent.setup();
    render(
      <Sheet>
        <SheetTrigger render={<Button>Open Bounded Sheet</Button>} />
        <SheetContent side="bottom" className="p-0">
          <SheetTitle>Bounded Sheet</SheetTitle>
        </SheetContent>
      </Sheet>
    );

    await user.click(screen.getByRole("button", { name: /open bounded sheet/i }));
    const dialog = await screen.findByRole("dialog");

    expect(dialog).toHaveClass("max-h-[calc(100dvh-2rem)]");
    expect(dialog).toHaveClass("overflow-y-auto");
    expect(dialog).toHaveClass("overscroll-contain");
    expect(dialog).toHaveClass("p-0");
  });
});
