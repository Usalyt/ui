import React, { createRef } from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { AlertTriangle, CheckCircle2, Info, XCircle } from "lucide-react";

describe("Alert Component", () => {
  it("renders default variant with role='alert' and content", () => {
    render(
      <Alert>
        <Info data-testid="alert-icon" className="h-4 w-4" />
        <AlertTitle>Notice</AlertTitle>
        <AlertDescription>This is a system notice.</AlertDescription>
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass("bg-secondary/70");
    expect(screen.getByText("Notice")).toBeInTheDocument();
    expect(screen.getByText("This is a system notice.")).toBeInTheDocument();
    expect(screen.getByTestId("alert-icon")).toBeInTheDocument();
  });

  it("renders destructive variant with proper semantic styling", () => {
    render(
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>Action failed.</AlertDescription>
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("border-coral-red/40");
    expect(alert).toHaveClass("text-coral-red-foreground");
  });

  it("renders success variant with proper semantic styling", () => {
    render(
      <Alert variant="success">
        <CheckCircle2 className="h-4 w-4" />
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Changes saved.</AlertDescription>
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("border-pulse-green/40");
    expect(alert).toHaveClass("bg-pulse-green/10");
  });

  it("renders warning variant with proper semantic styling", () => {
    render(
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>High storage usage.</AlertDescription>
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("border-signal-teal/40");
    expect(alert).toHaveClass("bg-signal-teal/10");
  });

  it("forwards ref to the root div element", () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Alert ref={ref}>
        <AlertTitle>Ref Test</AlertTitle>
      </Alert>
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute("role", "alert");
  });

  it("merges custom className without overriding base styles", () => {
    render(
      <Alert className="my-custom-class shadow-lg">
        <AlertTitle>Custom Class</AlertTitle>
      </Alert>
    );

    const alert = screen.getByRole("alert");
    expect(alert).toHaveClass("my-custom-class");
    expect(alert).toHaveClass("shadow-lg");
    expect(alert).toHaveClass("rounded-xl");
  });

  it("renders inline action elements seamlessly inside alert", () => {
    render(
      <Alert variant="success">
        <AlertTitle>Update Available</AlertTitle>
        <AlertDescription>A new version is available.</AlertDescription>
        <button type="button">Upgrade</button>
      </Alert>
    );

    const button = screen.getByRole("button", { name: "Upgrade" });
    expect(button).toBeInTheDocument();
  });
});
