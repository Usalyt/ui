import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Textarea } from "./textarea";
import { Label } from "../label";

const meta: Meta<typeof Textarea> = {
  title: "Primitives/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  argTypes: {
    resize: {
      control: "select",
      options: ["none", "vertical", "horizontal", "both"],
    },
    disabled: { control: "boolean" },
    rows: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: "Type your message here...",
    rows: 4,
  },
};

export const WithLabelAndCharacterLimit: Story = {
  render: (args) => {
    const [text, setText] = React.useState("");
    const maxChars = 200;

    return (
      <div className="w-full max-w-md space-y-2">
        <Label htmlFor="bio" className="text-sm font-semibold">
          Biography
        </Label>
        <Textarea
          id="bio"
          rows={4}
          maxLength={maxChars}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Tell us about yourself..."
          {...args}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Brief description for your public profile.</span>
          <span>
            {text.length}/{maxChars}
          </span>
        </div>
      </div>
    );
  },
};

export const InvalidState: Story = {
  render: (args) => (
    <div className="w-full max-w-md space-y-2">
      <Label htmlFor="invalid-textarea" className="text-sm font-semibold text-destructive">
        Feedback Notes
      </Label>
      <Textarea
        id="invalid-textarea"
        aria-invalid="true"
        rows={4}
        defaultValue="Short"
        {...args}
      />
      <p className="text-xs text-destructive">
        Feedback must be at least 20 characters long.
      </p>
    </div>
  ),
};

export const DisabledState: Story = {
  render: (args) => (
    <div className="w-full max-w-md space-y-2">
      <Label htmlFor="disabled-textarea" className="text-sm font-semibold text-muted-foreground">
        Archived Note
      </Label>
      <Textarea
        id="disabled-textarea"
        disabled
        rows={4}
        value="This record has been archived and cannot be modified."
        {...args}
      />
    </div>
  ),
};

export const NoResize: Story = {
  args: {
    resize: "none",
    placeholder: "Fixed height textarea (resize disabled)...",
    rows: 4,
  },
};
