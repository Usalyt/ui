import React, { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox, type ComboboxProps } from "./combobox";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
  { value: "angular", label: "Angular", disabled: true },
];

describe("Combobox Primitive Component", () => {
  it("renders trigger button with placeholder and combobox role", () => {
    render(<Combobox options={options} placeholder="Select framework" />);
    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeInTheDocument();
    expect(combobox).toHaveTextContent("Select framework");
  });

  it("opens popover and filters options when typing search string", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox options={options} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    expect(
      screen.getByPlaceholderText("Search options...")
    ).toBeInTheDocument();

    await user.type(screen.getByPlaceholderText("Search options..."), "vue");
    expect(screen.getByText("Vue")).toBeInTheDocument();
    expect(screen.queryByText("React")).not.toBeInTheDocument();

    await user.click(screen.getByText("Vue"));
    expect(onChange).toHaveBeenCalledWith("vue");
  });

  it("does NOT select option when option is disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Combobox options={options} onChange={onChange} />);

    await user.click(screen.getByRole("combobox"));
    const disabledOpt = screen.getByText("Angular");
    expect(disabledOpt.parentElement).toHaveAttribute("aria-disabled", "true");

    await user.click(disabledOpt);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("disables trigger button when disabled prop is set", () => {
    render(<Combobox disabled options={options} placeholder="Disabled choice" />);
    const combobox = screen.getByRole("combobox");
    expect(combobox).toBeDisabled();
  });

  it("renders selected option label on trigger when value is provided", () => {
    render(<Combobox options={options} value="svelte" />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Svelte");
  });

  it("forwards ref to trigger button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Combobox ref={ref} options={options} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toHaveAttribute("role", "combobox");
  });
});

// ---------------------------------------------------------------------------
// Redesign contract (OpenSpec change refactor-sdd-tdd-full-coverage, task 14):
// the popup must be a real ARIA combobox/listbox with a managed highlight
// driven from the search input (aria-activedescendant), full arrow/home/end
// navigation, Enter selection and Escape dismissal with focus restoration.
// ---------------------------------------------------------------------------

describe("Combobox keyboard operation", () => {
  const openCombobox = async (props: Partial<ComboboxProps> = {}) => {
    const user = userEvent.setup();
    render(<Combobox options={options} {...props} />);
    const trigger = screen.getByRole("combobox");
    await user.click(trigger);
    const search = screen.getByPlaceholderText("Search options...");
    await user.click(search);
    return { user, trigger, search };
  };

  const optionId = (name: string) =>
    screen.getByRole("option", { name }).id;

  it("ArrowDown highlights the first option and points aria-activedescendant at it", async () => {
    const { user, search } = await openCombobox();
    expect(search).not.toHaveAttribute("aria-activedescendant");

    await user.keyboard("{ArrowDown}");

    const first = screen.getByRole("option", { name: "React" });
    expect(first).toHaveAttribute("data-highlighted", "true");
    expect(search).toHaveAttribute("aria-activedescendant", first.id);
  });

  it("ArrowDown/ArrowUp/Home/End move the highlight, skipping disabled options", async () => {
    const { user, search } = await openCombobox();
    const activeId = () => search.getAttribute("aria-activedescendant");

    await user.keyboard("{ArrowDown}");
    expect(activeId()).toBe(optionId("React"));
    await user.keyboard("{ArrowDown}");
    expect(activeId()).toBe(optionId("Vue"));
    await user.keyboard("{ArrowDown}");
    expect(activeId()).toBe(optionId("Svelte"));
    // Angular is disabled: wrapping forward must skip it.
    await user.keyboard("{ArrowDown}");
    expect(activeId()).toBe(optionId("React"));
    // Wrapping backwards from the first enabled option must skip it too.
    await user.keyboard("{ArrowUp}");
    expect(activeId()).toBe(optionId("Svelte"));
    await user.keyboard("{Home}");
    expect(activeId()).toBe(optionId("React"));
    await user.keyboard("{End}");
    expect(activeId()).toBe(optionId("Svelte"));
  });

  it("Enter selects the highlighted option, closes the popup and restores focus to the trigger", async () => {
    const onChange = vi.fn();
    const { user, trigger } = await openCombobox({ onChange });

    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");

    expect(onChange).toHaveBeenCalledWith("vue");
    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it("Escape closes the popup and restores focus to the trigger", async () => {
    const { user, trigger, search } = await openCombobox();

    await user.type(search, "vue");
    await user.keyboard("{Escape}");

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
