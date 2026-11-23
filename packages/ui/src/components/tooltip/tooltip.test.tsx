import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";
import { Button } from "../button";

describe("Tooltip Primitive Component", () => {
  it("renders trigger element and tooltip content on hover", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button>Hover Me</Button>} />
          <TooltipContent>Tooltip Information</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByRole("button", { name: /hover me/i });
    expect(trigger).toBeInTheDocument();
    await user.hover(trigger);
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent("Tooltip Information");
  });

  it("opens tooltip when trigger receives keyboard focus", async () => {
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button>Focus Me</Button>} />
          <TooltipContent>Focus Info</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByRole("button", { name: /focus me/i });
    trigger.focus();
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toBeInTheDocument();
  });

  it("closes tooltip when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button>Escape Test</Button>} />
          <TooltipContent>Escape Info</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    const trigger = screen.getByRole("button", { name: /escape test/i });
    await user.hover(trigger);
    expect(await screen.findByRole("tooltip")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("tooltip")).not.toBeInTheDocument();
  });

  it("merges custom className without dropping base styling", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button>Custom Class</Button>} />
          <TooltipContent className="my-custom-tooltip font-bold">
            Class Info
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(screen.getByRole("button", { name: /custom class/i }));
    const tooltip = await screen.findByRole("tooltip");
    expect(tooltip).toHaveClass("my-custom-tooltip");
    expect(tooltip).toHaveClass("font-bold");
  });

  it("forwards ref to TooltipContent popup element", async () => {
    const ref = createRef<HTMLDivElement>();
    const user = userEvent.setup();
    render(
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={<Button>Ref Test</Button>} />
          <TooltipContent ref={ref}>Ref Content</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );

    await user.hover(screen.getByRole("button", { name: /ref test/i }));
    await screen.findByRole("tooltip");
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
