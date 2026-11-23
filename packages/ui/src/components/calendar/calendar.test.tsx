import React, { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Calendar } from "./calendar";

describe("Calendar Component", () => {
  it("renders month grid and handles day selection", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const testDate = new Date(2026, 6, 15); // July 15, 2026

    render(<Calendar selected={testDate} onSelect={onSelect} />);

    expect(screen.getByText("July 2026")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: testDate.toDateString() })
    ).toBeInTheDocument();

    const day10 = new Date(2026, 6, 10);
    await user.click(
      screen.getByRole("button", { name: day10.toDateString() })
    );
    expect(onSelect).toHaveBeenCalledWith(day10);
  });

  it("navigates months when clicking navigation buttons", async () => {
    const user = userEvent.setup();
    const testDate = new Date(2026, 6, 15);

    render(<Calendar selected={testDate} />);

    await user.click(screen.getByRole("button", { name: /next month/i }));
    expect(screen.getByText("August 2026")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /previous month/i }));
    expect(screen.getByText("July 2026")).toBeInTheDocument();
  });

  it("disables day selection when out of minDate bounds", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    const testDate = new Date(2026, 6, 15);
    const minDate = new Date(2026, 6, 10);

    render(<Calendar selected={testDate} minDate={minDate} onSelect={onSelect} />);

    const earlyDay = new Date(2026, 6, 5);
    const earlyBtn = screen.getByRole("button", { name: earlyDay.toDateString() });
    expect(earlyBtn).toBeDisabled();

    await user.click(earlyBtn);
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("highlights selected date with aria-pressed='true'", () => {
    const selected = new Date(2026, 6, 20);
    render(<Calendar selected={selected} />);

    const btn = screen.getByRole("button", { name: selected.toDateString() });
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("merges custom className without dropping base styling", () => {
    const testDate = new Date(2026, 6, 15);
    render(<Calendar selected={testDate} className="my-custom-calendar shadow-2xl" />);

    const region = screen.getByRole("region", { name: /calendar/i });
    expect(region).toHaveClass("my-custom-calendar");
    expect(region).toHaveClass("shadow-2xl");
  });

  it("forwards ref to root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Calendar ref={ref} selected={new Date(2026, 6, 1)} />);

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "region");
  });
});
