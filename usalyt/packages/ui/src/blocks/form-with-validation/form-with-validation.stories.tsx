import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormWithValidation } from "./form-with-validation";

const meta: Meta<typeof FormWithValidation> = {
  title: "Blocks/FormWithValidation",
  component: FormWithValidation,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md p-4">
      <FormWithValidation
        onSubmit={(vals) => alert(JSON.stringify(vals, null, 2))}
      />
    </div>
  ),
};

export const AsyncPending: Story = {
  render: () => (
    <div className="w-full max-w-md p-4">
      <FormWithValidation
        onSubmit={() => new Promise<void>(() => {
          // Stays pending so Storybook can show the disabled action state.
        })}
      />
    </div>
  )
};

export const SubmissionError: Story = {
  render: () => (
    <div className="w-full max-w-md p-4">
      <FormWithValidation
        onSubmit={async () => {
          throw new Error(
            "Profile update failed. Please try again. If the problem persists, contact your administrator."
          );
        }}
      />
    </div>
  )
};
