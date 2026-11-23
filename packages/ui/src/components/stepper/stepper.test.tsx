import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Stepper,
  Step,
  StepIndicator,
  StepTitle,
  StepDescription,
  StepSeparator,
} from "./stepper";

describe("Stepper Primitive Component", () => {
  it("renders horizontal stepper with active and completed steps", () => {
    render(
      <Stepper orientation="horizontal">
        <Step status="completed">
          <StepIndicator status="completed" stepNumber={1} />
          <div>
            <StepTitle>Step 1</StepTitle>
            <StepDescription>Completed details</StepDescription>
          </div>
        </Step>
        <StepSeparator />
        <Step status="active">
          <StepIndicator status="active" stepNumber={2} />
          <div>
            <StepTitle>Step 2</StepTitle>
            <StepDescription>Active details</StepDescription>
          </div>
        </Step>
        <StepSeparator />
        <Step status="inactive">
          <StepIndicator status="inactive" stepNumber={3} />
          <div>
            <StepTitle>Step 3</StepTitle>
            <StepDescription>Pending details</StepDescription>
          </div>
        </Step>
      </Stepper>
    );

    expect(screen.getByText("Step 1")).toBeInTheDocument();
    expect(screen.getByText("Step 2")).toBeInTheDocument();
    expect(screen.getByText("Step 3")).toBeInTheDocument();

    const activeStep = screen.getByText("Step 2").closest('[aria-current="step"]');
    expect(activeStep).toBeInTheDocument();
  });
});
