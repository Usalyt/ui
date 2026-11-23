import React from "react";
import {
  Stepper,
  Step,
  StepIndicator,
  StepTitle,
  StepDescription,
  StepSeparator,
  Button,
} from "@usalyt/ui";

const steps = [
  { title: "Scope", description: "Pick the flows to evaluate" },
  { title: "Evaluate", description: "Log findings per heuristic" },
  { title: "Review", description: "Consolidate and export" },
];

export function StepperDemo() {
  const [current, setCurrent] = React.useState(0);
  const status = (index: number) =>
    index < current ? "completed" : index === current ? "active" : "inactive";

  return (
    <div className="w-full max-w-md space-y-5">
      <Stepper className="w-full flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        {steps.map((step, i) => (
          <React.Fragment key={step.title}>
            {i > 0 && <StepSeparator className="hidden sm:block" />}
            <Step status={status(i)} className="w-full sm:w-auto">
              <StepIndicator status={status(i)} stepNumber={i + 1} />
              <div className="min-w-0">
                <StepTitle>{step.title}</StepTitle>
                <StepDescription>{step.description}</StepDescription>
              </div>
            </Step>
          </React.Fragment>
        ))}
      </Stepper>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
        >
          Back
        </Button>
        <Button
          size="sm"
          disabled={current === steps.length - 1}
          onClick={() => setCurrent((c) => c + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
