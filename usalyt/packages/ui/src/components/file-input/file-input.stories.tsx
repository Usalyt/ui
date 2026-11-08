import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileInput } from "./file-input";

const meta: Meta<typeof FileInput> = {
  title: "Primitives/FileInput",
  component: FileInput,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <FileInput label="Upload Report (PDF/DOCX)" />
    </div>
  ),
};

export const WithHelperText: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <FileInput
        label="Upload Screenshot"
        helperText="Max file size: 5MB. Formats: PNG, JPG, WebP"
      />
    </div>
  ),
};

export const ErrorState: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <FileInput
        label="Upload Heuristic Result"
        error="File size exceeds maximum limit of 10MB."
      />
    </div>
  ),
};

export const DisabledFileInput: Story = {
  render: () => (
    <div className="w-full max-w-sm">
      <FileInput disabled label="Upload disabled during sync" />
    </div>
  ),
};
