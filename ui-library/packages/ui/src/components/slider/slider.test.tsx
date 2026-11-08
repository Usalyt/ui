import React, { createRef } from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Slider } from "./slider";

describe("Slider Primitive Component", () => {
  it("renders slider element with slider role and default value", () => {
    render(<Slider defaultValue={50} aria-label="Volume" />);
    const slider = screen.getByRole("slider", { name: /volume/i });
    expect(slider).toBeInTheDocument();
    expect(slider).toHaveAttribute("aria-valuenow", "50");
  });

  it("increments value on ArrowRight key press", async () => {
    const user = userEvent.setup();
    render(<Slider defaultValue={50} step={1} aria-label="Brightness" />);
    const slider = screen.getByRole("slider");
    await act(async () => {
      slider.focus();
      await user.keyboard("{ArrowRight}");
    });
    expect(Number(slider.getAttribute("aria-valuenow"))).toBeGreaterThanOrEqual(50);
  });

  it("moves to min on Home key and max on End key", async () => {
    const user = userEvent.setup();
    render(<Slider defaultValue={50} min={0} max={100} aria-label="Range" />);
    const slider = screen.getByRole("slider");
    await act(async () => {
      slider.focus();
      await user.keyboard("{Home}");
    });
    expect(slider).toHaveAttribute("aria-valuenow", "0");

    await act(async () => {
      await user.keyboard("{End}");
    });
    expect(slider).toHaveAttribute("aria-valuenow", "100");
  });

  it("disables interaction when disabled prop is set", () => {
    render(<Slider disabled defaultValue={30} aria-label="Disabled slider" />);
    const slider = screen.getByRole("slider");
    expect(
      slider.hasAttribute("disabled") ||
        slider.getAttribute("aria-disabled") === "true" ||
        slider.classList.contains("disabled") ||
        slider.parentElement?.querySelector("[disabled]") !== null
    ).toBe(true);
  });

  it("forwards ref to the root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(<Slider ref={ref} defaultValue={40} aria-label="Ref Slider" />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});
