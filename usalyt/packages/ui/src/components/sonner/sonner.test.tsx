import React from "react";
import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Toaster } from "./sonner";

describe("Sonner Toaster Primitive Component", () => {
  it("renders toaster container", () => {
    render(<Toaster />);
    const toaster =
      document.querySelector('[data-sonner-toaster]') ||
      document.querySelector("section[aria-label]") ||
      document.body.querySelector(".toaster");
    expect(toaster).toBeInTheDocument();
  });
});
