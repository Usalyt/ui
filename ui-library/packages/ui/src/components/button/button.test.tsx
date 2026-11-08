import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { Mail } from "lucide-react";

describe("Button Primitive Component", () => {
  // ── 1. Role & Default Rendering ─────────────────────────────────────
  it("renders with correct role and accessible text", () => {
    render(<Button>Save Changes</Button>);
    expect(
      screen.getByRole("button", { name: /save changes/i })
    ).toBeInTheDocument();
  });

  // ── 2. Variant CSS Assertions ───────────────────────────────────────
  it("applies default primary variant classes", () => {
    render(<Button variant="default">Primary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary");
    expect(button).toHaveClass("text-primary-foreground");
  });

  it("applies secondary variant classes", () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-secondary");
    expect(button).toHaveClass("text-secondary-foreground");
  });

  it("applies outline variant classes", () => {
    render(<Button variant="outline">Outline</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("border-border");
    expect(button).toHaveClass("bg-background");
  });

  it("applies destructive variant classes", () => {
    render(<Button variant="destructive">Delete Account</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-destructive");
    expect(button).toHaveClass("text-destructive-foreground");
  });

  it("applies ghost variant classes", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("hover:bg-accent");
  });

  it("applies link variant classes", () => {
    render(<Button variant="link">Link Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("text-primary");
    expect(button).toHaveClass("hover:underline");
  });

  it("applies pill variant classes", () => {
    render(<Button variant="pill">Pill CTA</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-paper");
    expect(button).toHaveClass("text-void");
    expect(button).toHaveClass("rounded-full");
  });

  // ── 3. Size CSS Assertions ──────────────────────────────────────────
  it("applies small size classes (sm)", () => {
    render(<Button size="sm">Small</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-8");
    expect(button).toHaveClass("px-3");
    expect(button).toHaveClass("text-xs");
  });

  it("applies medium size classes (md)", () => {
    render(<Button size="md">Medium</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-9");
    expect(button).toHaveClass("px-4");
  });

  it("applies large size classes (lg)", () => {
    render(<Button size="lg">Large</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("h-10");
    expect(button).toHaveClass("px-6");
    expect(button).toHaveClass("text-base");
  });

  it("applies icon-only size classes (icon)", () => {
    render(
      <Button size="icon" aria-label="Send email">
        <Mail data-testid="mail-icon" />
      </Button>
    );
    const button = screen.getByRole("button", { name: /send email/i });
    expect(button).toHaveClass("h-9");
    expect(button).toHaveClass("w-9");
    expect(screen.getByTestId("mail-icon")).toBeInTheDocument();
  });

  // ── 4. Interactive & State Assertions ───────────────────────────────
  it("invokes onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click Me</Button>);
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("does NOT invoke onClick when disabled and has disabled styling", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("disabled:opacity-50");
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders spinner and sets aria-busy when loading={true}", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Submitting
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(screen.getByTestId("button-spinner")).toBeInTheDocument();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  // ── 5. Keyboard Navigation ─────────────────────────────────────────
  it("triggers onClick when Enter key is pressed on focused button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    const button = screen.getByRole("button");
    button.focus();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledOnce();
  });

  it("triggers onClick when Space key is pressed on focused button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Submit</Button>);
    const button = screen.getByRole("button");
    button.focus();
    expect(button).toHaveFocus();
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledOnce();
  });

  // ── 6. Ref & Slot Support ──────────────────────────────────────────
  it("forwards ref to the native button element", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref Button</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("renders as child element when asChild is provided", () => {
    render(
      <Button asChild>
        <a href="/target">Go Target</a>
      </Button>
    );
    expect(
      screen.getByRole("link", { name: /go target/i })
    ).toBeInTheDocument();
  });
});
