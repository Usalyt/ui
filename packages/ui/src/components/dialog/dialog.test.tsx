import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./dialog";
import { Button } from "../button";

describe("Dialog Primitive Component", () => {
  it("renders trigger button and opens dialog on click", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger render={<Button>Open Dialog</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    const trigger = screen.getByRole("button", { name: /open dialog/i });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  });

  it("renders title and description linked to accessibility semantics", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger render={<Button>Open Modal</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Account Settings</DialogTitle>
            <DialogDescription>
              Manage your security credentials.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /open modal/i }));
    const dialog = await screen.findByRole("dialog");
    expect(dialog).toBeInTheDocument();
    expect(screen.getByText("Account Settings")).toBeInTheDocument();
    expect(
      screen.getByText("Manage your security credentials.")
    ).toBeInTheDocument();
  });

  it("renders DialogFooter with action buttons inside dialog", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger render={<Button>Confirm Action</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button variant="destructive">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /confirm action/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
  });

  it("closes dialog when close X button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger render={<Button>Open Dismissable</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Dismissable Modal</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(
      screen.getByRole("button", { name: /open dismissable/i })
    );
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: "Close" });
    await user.click(closeBtn);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes dialog when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger render={<Button>Open Modal</Button>} />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Keyboard Modal</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /open modal/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("forwards ref to DialogContent popup element", async () => {
    const ref = createRef<HTMLDivElement>();
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger render={<Button>Open Ref Modal</Button>} />
        <DialogContent ref={ref}>
          <DialogTitle>Ref Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /open ref modal/i }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("Dialog overlay spacing and containment", () => {
  it("gives footer actions a base gap while keeping the desktop row", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger render={<Button>Open Spacing Dialog</Button>} />
        <DialogContent>
          <DialogTitle>Spacing Dialog</DialogTitle>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /open spacing dialog/i }));
    const dialog = await screen.findByRole("dialog");
    const footer = dialog.querySelector(".flex-col-reverse");

    expect(footer).not.toBeNull();
    expect(footer).toHaveClass("gap-2");
    expect(footer).toHaveClass("sm:flex-row");
    expect(footer).not.toHaveClass("sm:space-x-2");
  });

  it("bounds the centered popup and scrolls its content", async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <DialogTrigger render={<Button>Open Bounded Dialog</Button>} />
        <DialogContent>
          <DialogTitle>Bounded Dialog</DialogTitle>
        </DialogContent>
      </Dialog>
    );

    await user.click(screen.getByRole("button", { name: /open bounded dialog/i }));
    const dialog = await screen.findByRole("dialog");

    expect(dialog).toHaveClass("max-h-[calc(100dvh-2rem)]");
    expect(dialog).toHaveClass("overflow-y-auto");
    expect(dialog).toHaveClass("overscroll-contain");
  });
});
