import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthForm } from "./auth-form";

describe("AuthForm Block", () => {
  it("renders inputs and submit button", () => {
    render(<AuthForm onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign in/i })).toBeInTheDocument();
  });

  it("submits valid credentials cleanly", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<AuthForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/email address/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "secret123"
      });
    });
  });

  it("awaits async submissions and exposes a pending state", async () => {
    const user = userEvent.setup();
    let resolveSubmit!: () => void;
    const onSubmit = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSubmit = resolve;
        })
    );

    render(<AuthForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/email address/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    const submitButton = await screen.findByRole("button", {
      name: /sign in/i
    });
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");

    resolveSubmit();
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });

  it("shows and clears feedback when an async submission rejects", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error("Invalid credentials"));

    render(<AuthForm onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/email address/i), "user@example.com");
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Invalid credentials"
    );
    expect(screen.getByRole("button", { name: /sign in/i })).not.toBeDisabled();
  });
});
