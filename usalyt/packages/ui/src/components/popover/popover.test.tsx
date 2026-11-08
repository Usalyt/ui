import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "./popover";
import { Button } from "../button";

describe("Popover Primitive Component", () => {
  it("renders trigger button and opens popover content on click", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger render={<Button>Open Popover</Button>} />
        <PopoverContent>
          <div>Popover Body Information</div>
        </PopoverContent>
      </Popover>
    );

    const trigger = screen.getByRole("button", { name: /open popover/i });
    expect(trigger).toBeInTheDocument();
    expect(screen.queryByText("Popover Body Information")).not.toBeInTheDocument();

    await user.click(trigger);
    expect(
      await screen.findByText("Popover Body Information")
    ).toBeInTheDocument();
  });

  it("closes popover when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger render={<Button>Keyboard Popover</Button>} />
        <PopoverContent>
          <div>Keyboard Content</div>
        </PopoverContent>
      </Popover>
    );

    await user.click(
      screen.getByRole("button", { name: /keyboard popover/i })
    );
    expect(await screen.findByText("Keyboard Content")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByText("Keyboard Content")).not.toBeInTheDocument();
  });

  it("closes popover when PopoverClose element is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger render={<Button>Open Popover</Button>} />
        <PopoverContent>
          <div>Content to close</div>
          <PopoverClose render={<Button size="sm">Close Popover</Button>} />
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole("button", { name: /open popover/i }));
    expect(await screen.findByText("Content to close")).toBeInTheDocument();

    const closeBtn = screen.getByRole("button", { name: /close popover/i });
    await user.click(closeBtn);

    expect(screen.queryByText("Content to close")).not.toBeInTheDocument();
  });

  it("merges custom className without overriding default classes", async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger render={<Button>Custom Class Popover</Button>} />
        <PopoverContent className="my-custom-popover w-96">
          <div>Custom Class Content</div>
        </PopoverContent>
      </Popover>
    );

    await user.click(
      screen.getByRole("button", { name: /custom class popover/i })
    );
    const content = await screen.findByText("Custom Class Content");
    expect(content.parentElement).toHaveClass("my-custom-popover");
    expect(content.parentElement).toHaveClass("w-96");
  });

  it("forwards ref to PopoverContent popup element", async () => {
    const ref = createRef<HTMLDivElement>();
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger render={<Button>Ref Popover</Button>} />
        <PopoverContent ref={ref}>
          <div>Ref Content</div>
        </PopoverContent>
      </Popover>
    );

    await user.click(screen.getByRole("button", { name: /ref popover/i }));
    await screen.findByText("Ref Content");
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
