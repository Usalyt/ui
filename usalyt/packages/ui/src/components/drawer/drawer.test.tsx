import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "./drawer";
import { Button } from "../button";

describe("Drawer Primitive Component", () => {
  it("renders trigger button and opens drawer panel on click", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger render={<Button>Open Drawer</Button>} />
        <DrawerContent side="right">
          <DrawerHeader>
            <DrawerTitle>Navigation Menu</DrawerTitle>
            <DrawerDescription>Sidebar navigation items</DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    );

    const trigger = screen.getByRole("button", { name: /open drawer/i });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Navigation Menu")).toBeInTheDocument();
    expect(screen.getByText("Sidebar navigation items")).toBeInTheDocument();
  });

  it("applies side placement classes (bottom, left, right)", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger render={<Button>Open Bottom Drawer</Button>} />
        <DrawerContent side="bottom">
          <DrawerTitle>Bottom Drawer</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );

    await user.click(
      screen.getByRole("button", { name: /open bottom drawer/i })
    );
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveClass("bottom-0");
  });

  it("renders DrawerFooter with action buttons inside drawer", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger render={<Button>Open Action Drawer</Button>} />
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Action Menu</DrawerTitle>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline">Cancel</Button>} />
            <Button variant="default">Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    await user.click(
      screen.getByRole("button", { name: /open action drawer/i })
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("closes drawer when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger render={<Button>Open Keyboard Drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Keyboard Drawer</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );

    await user.click(
      screen.getByRole("button", { name: /open keyboard drawer/i })
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("forwards ref to DrawerContent popup element", async () => {
    const ref = createRef<HTMLDivElement>();
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger render={<Button>Open Ref Drawer</Button>} />
        <DrawerContent ref={ref}>
          <DrawerTitle>Ref Drawer</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );

    await user.click(
      screen.getByRole("button", { name: /open ref drawer/i })
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("Drawer overlay spacing and containment", () => {
  it("gives footer actions a base gap while keeping the desktop row", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger render={<Button>Open Spacing Drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Spacing Drawer</DrawerTitle>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Create</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );

    await user.click(screen.getByRole("button", { name: /open spacing drawer/i }));
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
      <Drawer>
        <DrawerTrigger render={<Button>Open Scroll Drawer</Button>} />
        <DrawerContent side="right">
          <DrawerTitle>Scroll Drawer</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );

    await user.click(screen.getByRole("button", { name: /open scroll drawer/i }));
    const dialog = await screen.findByRole("dialog");

    expect(dialog).toHaveClass("h-full");
    expect(dialog).toHaveClass("overflow-y-auto");
    expect(dialog).toHaveClass("overscroll-contain");
    expect(dialog).not.toHaveClass("max-h-[calc(100dvh-2rem)]");
  });

  it("bounds a bottom panel relative to the viewport", async () => {
    const user = userEvent.setup();
    render(
      <Drawer>
        <DrawerTrigger render={<Button>Open Bounded Drawer</Button>} />
        <DrawerContent side="bottom">
          <DrawerTitle>Bounded Drawer</DrawerTitle>
        </DrawerContent>
      </Drawer>
    );

    await user.click(screen.getByRole("button", { name: /open bounded drawer/i }));
    const dialog = await screen.findByRole("dialog");

    expect(dialog).toHaveClass("max-h-[calc(100dvh-2rem)]");
    expect(dialog).toHaveClass("overflow-y-auto");
    expect(dialog).toHaveClass("overscroll-contain");
  });
});
