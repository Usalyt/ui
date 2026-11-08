import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Rating } from "./rating";

describe("Rating Primitive Component", () => {
  it("renders 5 star radio items with default value", () => {
    render(<Rating defaultValue={3} max={5} />);
    const radiogroup = screen.getByRole("radiogroup", { name: "Rating" });
    expect(radiogroup).toBeInTheDocument();
    expect(radiogroup).toHaveAttribute("data-valuenow", "3");

    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);
  });

  it("updates value on click and triggers onChange", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Rating defaultValue={2} onChange={handleChange} />);

    const fourStar = screen.getByRole("radio", { name: "4 of 5 stars" });
    await user.click(fourStar);

    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it("disables interaction in readOnly mode", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Rating defaultValue={3} readOnly onChange={handleChange} />);

    const fourStar = screen.getByRole("radio", { name: "4 of 5 stars" });
    await user.click(fourStar);

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("keeps updating uncontrolled state when onChange is provided", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Rating defaultValue={2} onChange={handleChange} />);

    const radiogroup = screen.getByRole("radiogroup", { name: "Rating" });
    await user.click(screen.getByRole("radio", { name: "4 of 5 stars" }));

    expect(handleChange).toHaveBeenCalledWith(4);
    expect(radiogroup).toHaveAttribute("data-valuenow", "4");
  });

  it("uses a roving tabindex so only one radio is tabbable", () => {
    const { unmount } = render(<Rating defaultValue={3} />);

    let radios = screen.getAllByRole("radio");
    expect(radios[0]).toHaveAttribute("tabindex", "-1");
    expect(radios[1]).toHaveAttribute("tabindex", "-1");
    expect(radios[2]).toHaveAttribute("tabindex", "0");
    expect(radios[3]).toHaveAttribute("tabindex", "-1");
    expect(radios[4]).toHaveAttribute("tabindex", "-1");

    unmount();
    render(<Rating />);
    radios = screen.getAllByRole("radio");
    expect(radios[0]).toHaveAttribute("tabindex", "0");
    expect(radios[1]).toHaveAttribute("tabindex", "-1");
  });

  it("moves focus and selection with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Rating defaultValue={3} />);

    const radiogroup = screen.getByRole("radiogroup", { name: "Rating" });
    await user.tab();

    const threeStar = screen.getByRole("radio", { name: "3 of 5 stars" });
    expect(threeStar).toHaveFocus();

    await user.keyboard("{ArrowRight}");

    const fourStar = screen.getByRole("radio", { name: "4 of 5 stars" });
    expect(fourStar).toHaveFocus();
    expect(fourStar).toHaveAttribute("aria-checked", "true");
    expect(radiogroup).toHaveAttribute("data-valuenow", "4");
  });

  it("preserves controlled value behavior", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    const { rerender } = render(
      <Rating value={2} onChange={handleChange} />
    );

    const radiogroup = screen.getByRole("radiogroup", { name: "Rating" });
    await user.click(screen.getByRole("radio", { name: "4 of 5 stars" }));

    expect(handleChange).toHaveBeenCalledWith(4);
    expect(radiogroup).toHaveAttribute("data-valuenow", "2");

    rerender(<Rating value={4} onChange={handleChange} />);
    expect(radiogroup).toHaveAttribute("data-valuenow", "4");
  });
});
