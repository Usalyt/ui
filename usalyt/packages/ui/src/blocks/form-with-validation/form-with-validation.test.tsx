import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormWithValidation } from "./form-with-validation";

describe("FormWithValidation Block Component", () => {
  it("renders profile form with title and input fields", () => {
    render(<FormWithValidation />);

    expect(screen.getByText("User Profile Settings")).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/work email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("nielsen@example.com")).toBeInTheDocument();
    expect(screen.getByLabelText(/organization/i)).toBeInTheDocument();
  });

  it("triggers validation errors when submitted empty", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FormWithValidation onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /save profile/i }));

    expect(
      await screen.findByText("Full name must be at least 2 characters.")
    ).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("submits form data when inputs are valid", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<FormWithValidation onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText(/full name/i), "Jacob Nielsen");
    await user.type(screen.getByLabelText(/work email/i), "nielsen@example.com");
    await user.type(screen.getByLabelText(/organization/i), "NN/g Institute");

    await user.click(screen.getByRole("button", { name: /save profile/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        fullName: "Jacob Nielsen",
        email: "nielsen@example.com",
        organization: "NN/g Institute",
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

    render(<FormWithValidation onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/full name/i), "Jacob Nielsen");
    await user.type(screen.getByLabelText(/work email/i), "nielsen@example.com");
    await user.type(screen.getByLabelText(/organization/i), "NN/g Institute");
    await user.click(screen.getByRole("button", { name: /save profile/i }));

    const submitButton = await screen.findByRole("button", {
      name: /save profile/i,
    });
    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(submitButton).toBeDisabled();
    expect(submitButton).toHaveAttribute("aria-busy", "true");

    resolveSubmit();
    await waitFor(() => expect(submitButton).not.toBeDisabled());
  });

  it("shows feedback when an async submission rejects", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockRejectedValue(new Error("Profile update failed"));

    render(<FormWithValidation onSubmit={onSubmit} />);
    await user.type(screen.getByLabelText(/full name/i), "Jacob Nielsen");
    await user.type(screen.getByLabelText(/work email/i), "nielsen@example.com");
    await user.type(screen.getByLabelText(/organization/i), "NN/g Institute");
    await user.click(screen.getByRole("button", { name: /save profile/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Profile update failed"
    );
    expect(
      screen.getByRole("button", { name: /save profile/i })
    ).not.toBeDisabled();
  });
});
