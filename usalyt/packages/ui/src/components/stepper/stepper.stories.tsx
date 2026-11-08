import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Stepper,
  Step,
  StepIndicator,
  StepTitle,
  StepDescription,
  StepSeparator,
} from "./stepper";

const meta: Meta<typeof Stepper> = {
  title: "Primitives/Stepper",
  component: Stepper,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-xl">
      <Stepper orientation="horizontal">
        <Step status="completed">
          <StepIndicator status="completed" stepNumber={1} />
          <div>
            <StepTitle>Step 1</StepTitle>
            <StepDescription>Scope</StepDescription>
          </div>
        </Step>
        <StepSeparator />
        <Step status="active">
          <StepIndicator status="active" stepNumber={2} />
          <div>
            <StepTitle>Step 2</StepTitle>
            <StepDescription>Evaluation</StepDescription>
          </div>
        </Step>
        <StepSeparator />
        <Step status="inactive">
          <StepIndicator status="inactive" stepNumber={3} />
          <div>
            <StepTitle>Step 3</StepTitle>
            <StepDescription>Report</StepDescription>
          </div>
        </Step>
      </Stepper>
    </div>
  ),
};
