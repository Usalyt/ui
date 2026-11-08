import React, { createRef } from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
  ToastPositioner,
  useToastManager,
} from "./toast";

const dummyToast = { id: "test-1" } as any;

function ToastViewportList() {
  const { toasts, add } = useToastManager();
  const seeded = React.useRef(false);
  React.useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    add({
      title: "Viewport Toast",
      description: "Renders inside the fixed viewport.",
    });
  }, [add]);

  return toasts.map((toast) => (
    <Toast key={toast.id} toast={toast}>
      <ToastTitle>{toast.title}</ToastTitle>
      <ToastDescription>{toast.description}</ToastDescription>
    </Toast>
  ));
}

describe("Toast Primitive Component", () => {
  it("mounts toasts inside a fixed-position viewport region", () => {
    render(
      <ToastProvider timeout={0}>
        <ToastViewport>
          <ToastViewportList />
        </ToastViewport>
      </ToastProvider>
    );

    // Base UI v1.6.0 Viewport renders a region landmark labelled "Notifications".
    const viewport = screen.getByRole("region", { name: "Notifications" });
    expect(viewport.className).toContain("fixed");
    const toast = within(viewport).getByRole("status");
    expect(toast).toHaveTextContent("Viewport Toast");
    // The toast content must live inside the viewport, not beside it.
    expect(viewport).toContainElement(toast);
  });

  it("exports the complete fixed surface parts (viewport and positioner)", () => {
    expect(ToastViewport).toBeDefined();
    expect(ToastPositioner).toBeDefined();
  });

  it("renders toast title and description when open", () => {
    render(
      <ToastProvider>
        <Toast toast={dummyToast}>
          <div>
            <ToastTitle>Event Created</ToastTitle>
            <ToastDescription>Your event has been scheduled.</ToastDescription>
          </div>
        </Toast>
      </ToastProvider>
    );

    expect(screen.getByText("Event Created")).toBeInTheDocument();
    expect(
      screen.getByText("Your event has been scheduled.")
    ).toBeInTheDocument();
  });

  it("renders success variant styling", () => {
    render(
      <ToastProvider>
        <Toast toast={dummyToast} variant="success">
          <ToastTitle>Saved Successfully</ToastTitle>
        </Toast>
      </ToastProvider>
    );

    const title = screen.getByText("Saved Successfully");
    expect(title.closest(".border-pulse-green\\/40")).toBeInTheDocument();
  });

  it("renders destructive variant styling", () => {
    render(
      <ToastProvider>
        <Toast toast={dummyToast} variant="destructive">
          <ToastTitle>Connection Failed</ToastTitle>
        </Toast>
      </ToastProvider>
    );

    const title = screen.getByText("Connection Failed");
    expect(title.closest(".border-coral-red\\/40")).toBeInTheDocument();
  });

  it("renders close button", () => {
    const { container } = render(
      <ToastProvider>
        <Toast toast={dummyToast}>
          <ToastTitle>Dismissable Toast</ToastTitle>
          <ToastClose />
        </Toast>
      </ToastProvider>
    );

    const closeBtn = container.querySelector("button");
    expect(closeBtn).toBeInTheDocument();
  });

  it("forwards ref to Toast root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ToastProvider>
        <Toast ref={ref} toast={dummyToast}>
          <ToastTitle>Ref Toast</ToastTitle>
        </Toast>
      </ToastProvider>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("renders role='status' and aria-live='polite' for default variant", () => {
    render(
      <ToastProvider>
        <Toast toast={dummyToast}>
          <ToastTitle>Default Toast</ToastTitle>
        </Toast>
      </ToastProvider>
    );

    const toastRoot = screen.getByRole("status");
    expect(toastRoot).toBeInTheDocument();
    expect(toastRoot).toHaveAttribute("aria-live", "polite");
  });

  it("renders role='alert' and aria-live='assertive' for destructive variant", () => {
    render(
      <ToastProvider>
        <Toast toast={dummyToast} variant="destructive">
          <ToastTitle>Error Toast</ToastTitle>
        </Toast>
      </ToastProvider>
    );

    const toastRoot = screen.getByRole("alert");
    expect(toastRoot).toBeInTheDocument();
    expect(toastRoot).toHaveAttribute("aria-live", "assertive");
  });
});
