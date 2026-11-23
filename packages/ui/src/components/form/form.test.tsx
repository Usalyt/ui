import React, { createRef } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "./form";
import { Input } from "../input";
import { Button } from "../button";

const schema = z.object({
  email: z.string().email("Email inválido"),
});

function TestForm({
  onSubmit,
}: {
  onSubmit: (data: z.infer<typeof schema>) => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input placeholder="user@example.com" {...field} />
              </FormControl>
              <FormDescription>We never share your email.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

describe("Form Primitive Component", () => {
  it("renders form elements cleanly with label and description", () => {
    render(<TestForm onSubmit={vi.fn()} />);
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByText("We never share your email.")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /submit/i })
    ).toBeInTheDocument();
  });

  it("shows validation error message on invalid submit", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText("Email inválido")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("sets aria-invalid='true' on input control when field has error", async () => {
    const user = userEvent.setup();
    render(<TestForm onSubmit={vi.fn()} />);

    const input = screen.getByLabelText(/email address/i);
    expect(input).toHaveAttribute("aria-invalid", "false");

    await user.click(screen.getByRole("button", { name: /submit/i }));
    await screen.findByText("Email inválido");

    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("links aria-describedby to FormDescription and FormMessage ids", async () => {
    const user = userEvent.setup();
    render(<TestForm onSubmit={vi.fn()} />);

    const input = screen.getByLabelText(/email address/i);
    const describedBy = input.getAttribute("aria-describedby") || "";
    expect(describedBy).toContain("description");

    await user.click(screen.getByRole("button", { name: /submit/i }));
    await screen.findByText("Email inválido");

    const updatedDescribedBy = input.getAttribute("aria-describedby") || "";
    expect(updatedDescribedBy).toContain("message");
  });

  it("calls onSubmit with valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<TestForm onSubmit={onSubmit} />);

    await user.type(
      screen.getByLabelText(/email address/i),
      "user@example.com"
    );
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ email: "user@example.com" }),
        expect.anything()
      );
    });
  });

  it("clears validation error when valid input is typed", async () => {
    const user = userEvent.setup();
    render(<TestForm onSubmit={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /submit/i }));
    expect(await screen.findByText("Email inválido")).toBeInTheDocument();

    await user.type(
      screen.getByLabelText(/email address/i),
      "valid@domain.com"
    );
    await user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() => {
      expect(screen.queryByText("Email inválido")).not.toBeInTheDocument();
    });
  });

  it("forwards ref to FormItem DOM element", () => {
    const itemRef = createRef<HTMLDivElement>();
    render(
      <Form
        {...({
          getFieldState: () => ({ error: undefined }),
          formState: {},
          control: {},
        } as any)}
      >
        <FormItem ref={itemRef} className="custom-item">
          <div>Item content</div>
        </FormItem>
      </Form>
    );

    expect(itemRef.current).toBeInstanceOf(HTMLDivElement);
    expect(itemRef.current).toHaveClass("custom-item");
  });
});

function FocusableForm({
  controlRef,
  onChildRef,
}: {
  controlRef?: React.Ref<HTMLElement>;
  onChildRef?: (node: HTMLInputElement | null) => void;
}) {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(vi.fn())} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Focus email</FormLabel>
              <FormControl ref={controlRef}>
                <Input
                  {...field}
                  ref={(node) => {
                    field.ref(node);
                    onChildRef?.(node);
                  }}
                  placeholder="user@example.com"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
        <Button type="button" onClick={() => form.setFocus("email")}>
          Focus programmatically
        </Button>
      </form>
    </Form>
  );
}

describe("FormControl ref composition", () => {
  it("focuses the invalid control after a failed submit", async () => {
    const user = userEvent.setup();
    render(<FocusableForm />);

    const input = screen.getByLabelText(/focus email/i);
    await user.click(screen.getByRole("button", { name: /^submit$/i }));

    expect(await screen.findByText("Email inválido")).toBeInTheDocument();
    await waitFor(() => expect(input).toHaveFocus());
  });

  it("focuses a field programmatically through form.setFocus", async () => {
    const user = userEvent.setup();
    render(<FocusableForm />);

    const input = screen.getByLabelText(/focus email/i);
    input.blur();

    await user.click(
      screen.getByRole("button", { name: /focus programmatically/i })
    );

    expect(input).toHaveFocus();
  });

  it("preserves the child ref while composing the FormControl ref", () => {
    const controlRef = createRef<HTMLElement>();
    const onChildRef = vi.fn();
    render(
      <FocusableForm controlRef={controlRef} onChildRef={onChildRef} />
    );

    const input = screen.getByLabelText(/focus email/i);
    expect(input).toBeInstanceOf(HTMLInputElement);
    expect(onChildRef).toHaveBeenCalledWith(input);
    expect(controlRef.current).toBe(input);
  });
});
