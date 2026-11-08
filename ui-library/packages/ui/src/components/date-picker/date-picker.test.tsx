import React, { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePicker } from "./date-picker";

describe("DatePicker Primitive Component", () => {
  it("renders button trigger with formatted date or placeholder", () => {
    const testDate = new Date(2026, 6, 15);
    render(<DatePicker value={testDate} />);

    expect(screen.getByRole("button")).toHaveTextContent("Jul 15, 2026");
  });

  it("renders placeholder text when no value is provided", () => {
    render(<DatePicker placeholder="Select target date" />);
    expect(screen.getByRole("button")).toHaveTextContent("Select target date");
  });

  it("opens popover calendar on click and selects a new date", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const testDate = new Date(2026, 6, 15);

    render(<DatePicker value={testDate} onChange={onChange} />);

    await user.click(screen.getByRole("button"));
    expect(
      screen.getByRole("region", { name: /calendar/i })
    ).toBeInTheDocument();

    const targetDay = new Date(2026, 6, 20);
    await user.click(
      screen.getByRole("button", { name: targetDay.toDateString() })
    );
    expect(onChange).toHaveBeenCalledWith(targetDay);
  });

  it("disables button trigger when disabled prop is true", () => {
    render(<DatePicker disabled placeholder="Locked picker" />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("forwards ref to trigger button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<DatePicker ref={ref} placeholder="Ref test" />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });
});
