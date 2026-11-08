import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog";
import { Button } from "../button";

describe("AlertDialog Primitive Component", () => {
  it("renders trigger button and opens alert dialog on click", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger render={<Button>Delete Account</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel render={<Button variant="outline">Cancel</Button>} />
            <AlertDialogAction
              render={<Button variant="destructive">Delete</Button>}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    const trigger = screen.getByRole("button", { name: /delete account/i });
    expect(trigger).toBeInTheDocument();
    await user.click(trigger);
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();
    expect(screen.getByText("Are you absolutely sure?")).toBeInTheDocument();
  });

  it("closes dialog when Cancel action is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger render={<Button>Open Dialog</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Test</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel render={<Button>Cancel</Button>} />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByRole("button", { name: /open dialog/i }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();

    const cancelBtn = screen.getByRole("button", { name: "Cancel" });
    await user.click(cancelBtn);

    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes dialog and triggers callback when Action is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    render(
      <AlertDialog>
        <AlertDialogTrigger render={<Button>Confirm Action</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Proceed</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={onConfirm}
              render={<Button>Proceed</Button>}
            />
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByRole("button", { name: /confirm action/i }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();

    const proceedBtn = screen.getByRole("button", { name: "Proceed" });
    await user.click(proceedBtn);

    expect(onConfirm).toHaveBeenCalled();
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("closes dialog when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger render={<Button>Escape Test</Button>} />
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Escape Dialog Title</AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByRole("button", { name: /escape test/i }));
    expect(await screen.findByRole("alertdialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument();
  });

  it("forwards ref to AlertDialogContent popup element", async () => {
    const ref = createRef<HTMLDivElement>();
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger render={<Button>Ref Dialog</Button>} />
        <AlertDialogContent ref={ref}>
          <AlertDialogHeader>
            <AlertDialogTitle>Ref Dialog Title</AlertDialogTitle>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByRole("button", { name: /ref dialog/i }));
    await screen.findByRole("alertdialog");
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe("AlertDialog overlay spacing and containment", () => {
  it("gives footer actions a base gap while keeping the desktop row", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger render={<Button>Open Spacing Alert</Button>} />
        <AlertDialogContent>
          <AlertDialogTitle>Spacing Alert</AlertDialogTitle>
          <AlertDialogFooter>
            <AlertDialogCancel render={<Button variant="outline">Cancel</Button>} />
            <Button>Confirm</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByRole("button", { name: /open spacing alert/i }));
    const dialog = await screen.findByRole("alertdialog");
    const footer = dialog.querySelector(".flex-col-reverse");

    expect(footer).not.toBeNull();
    expect(footer).toHaveClass("gap-2");
    expect(footer).toHaveClass("sm:flex-row");
    expect(footer).not.toHaveClass("sm:space-x-2");
  });

  it("bounds the centered popup and scrolls its content", async () => {
    const user = userEvent.setup();
    render(
      <AlertDialog>
        <AlertDialogTrigger render={<Button>Open Bounded Alert</Button>} />
        <AlertDialogContent>
          <AlertDialogTitle>Bounded Alert</AlertDialogTitle>
        </AlertDialogContent>
      </AlertDialog>
    );

    await user.click(screen.getByRole("button", { name: /open bounded alert/i }));
    const dialog = await screen.findByRole("alertdialog");

    expect(dialog).toHaveClass("max-h-[calc(100dvh-2rem)]");
    expect(dialog).toHaveClass("overflow-y-auto");
    expect(dialog).toHaveClass("overscroll-contain");
  });
});
