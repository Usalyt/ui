import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { CopyButton } from "./copy-button";

describe("CopyButton Primitive Component", () => {
  let writeTextSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeTextSpy = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: {
        writeText: writeTextSpy,
      },
      writable: true,
      configurable: true,
    });
  });

  it("renders copy button and copies text on click", async () => {
    const handleCopy = vi.fn();
    render(<CopyButton value="test-code" onCopy={handleCopy} />);

    const button = screen.getByRole("button", { name: /copy to clipboard/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(writeTextSpy).toHaveBeenCalledWith("test-code");
    await waitFor(() => {
      expect(handleCopy).toHaveBeenCalled();
    });
  });
});
