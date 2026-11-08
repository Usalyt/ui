import React, { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "./select";

describe("Select Primitive Component", () => {
  it("renders trigger button and opens option list on click", async () => {
    const user = userEvent.setup();
    render(
      <Select defaultValue="apple">
        <SelectTrigger aria-label="Fruit">
          <SelectValue placeholder="Choose a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole("combobox", { name: /fruit/i });
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);
    expect(await screen.findByRole("option", { name: "Banana" })).toBeInTheDocument();
  });

  it("selects option and triggers onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select onValueChange={onValueChange}>
        <SelectTrigger aria-label="Color">
          <SelectValue placeholder="Select color" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="red">Red</SelectItem>
          <SelectItem value="blue">Blue</SelectItem>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole("combobox", { name: /color/i });
    await user.click(trigger);

    const blueItem = await screen.findByRole("option", { name: "Blue" });
    await user.click(blueItem);

    expect(onValueChange).toHaveBeenCalled();
  });

  it("renders grouped options with SelectGroup and SelectLabel", async () => {
    const user = userEvent.setup();
    render(
      <Select defaultValue="cat">
        <SelectTrigger aria-label="Pet">
          <SelectValue placeholder="Select pet" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Mammals</SelectLabel>
            <SelectItem value="dog">Dog</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );

    const trigger = screen.getByRole("combobox", { name: /pet/i });
    await user.click(trigger);

    // The portal pre-renders its grouped content while closed, so text presence
    // alone is not an open-state oracle. Wait for the visible listbox/group.
    const listbox = await screen.findByRole("listbox");
    expect(listbox).toBeVisible();
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    const mammals = within(listbox).getByRole("group", { name: "Mammals" });
    expect(mammals).toBeVisible();
    expect(within(mammals).getByText("Mammals")).toBeVisible();

    const dog = within(mammals).getByRole("option", { name: "Dog" });
    expect(dog).toBeVisible();
    expect(dog).toHaveAttribute("aria-selected", "false");

    const cat = within(mammals).getByRole("option", { name: "Cat" });
    expect(cat).toBeVisible();
    expect(cat).toHaveAttribute("aria-selected", "true");
  });

  it("disables option when disabled prop is set", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger aria-label="Plan">
          <SelectValue placeholder="Select plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free</SelectItem>
          <SelectItem disabled value="enterprise">
            Enterprise (Locked)
          </SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox"));
    const disabledOption = await screen.findByRole("option", {
      name: /enterprise/i,
    });
    expect(disabledOption).toHaveAttribute("aria-disabled", "true");
  });

  it("forwards ref to SelectTrigger DOM button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Select>
        <SelectTrigger ref={ref} aria-label="Ref Select">
          <SelectValue placeholder="Ref" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="opt1">Opt 1</SelectItem>
        </SelectContent>
      </Select>
    );

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("tracks the trigger width via the Base UI --anchor-width variable", async () => {
    const user = userEvent.setup();
    render(
      <Select>
        <SelectTrigger aria-label="Width">
          <SelectValue placeholder="Width" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="a">Alpha</SelectItem>
          <SelectItem value="b">Beta</SelectItem>
        </SelectContent>
      </Select>
    );

    await user.click(screen.getByRole("combobox", { name: /width/i }));
    const popup = await screen.findByRole("listbox");
    const className = popup.className;
    // The popup rides the positioner's --anchor-width CSS variable (same
    // mechanism as Combobox), so the option list is as wide as the trigger.
    expect(className).toContain("w-[var(--anchor-width)]");
    // min-w stays as a floor for the anchor-width var to lift.
    expect(className).toContain("min-w-[8rem]");
  });
});
