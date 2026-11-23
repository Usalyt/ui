import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { DatePicker } from "./date-picker";
import { Label } from "../label";

const meta: Meta<typeof DatePicker> = {
  title: "Primitives/DatePicker",
  component: DatePicker,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>();
    return (
      <div className="w-full max-w-xs space-y-2">
        <Label>Select Deadline Date</Label>
        <DatePicker value={date} onChange={setDate} placeholder="Pick a date..." />
        <p className="text-xs text-muted-foreground font-mono">
          Selected: {date ? date.toDateString() : "None"}
        </p>
      </div>
    );
  },
};

export const WithPreselectedValue: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date(2026, 6, 15));
    return (
      <div className="w-full max-w-xs space-y-2">
        <Label>Evaluation Date</Label>
        <DatePicker value={date} onChange={setDate} />
      </div>
    );
  },
};

export const DisabledDatePicker: Story = {
  render: () => (
    <div className="w-full max-w-xs space-y-2">
      <Label>Locked Field</Label>
      <DatePicker disabled placeholder="Disabled date picker" />
    </div>
  ),
};
