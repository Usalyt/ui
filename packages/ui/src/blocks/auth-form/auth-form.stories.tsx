import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AuthForm } from "./auth-form";

const meta: Meta<typeof AuthForm> = {
  title: "Blocks/AuthForm",
  component: AuthForm,
  tags: ["autodocs"]
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: (data) => console.log("Submitted:", data)
  }
};

export const AsyncPending: Story = {
  args: {
    onSubmit: () => new Promise<void>(() => {
      // Stays pending so Storybook can show the disabled action state.
    })
  }
};

export const SubmissionError: Story = {
  args: {
    onSubmit: async () => {
      throw new Error(
        "Invalid credentials. Please try again. If the problem persists, contact your administrator."
      );
    }
  }
};
