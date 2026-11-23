import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Calendar } from "./calendar";

const meta: Meta<typeof Calendar> = {
  title: "Primitives/Calendar",
  component: Calendar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [date, setDate] = React.useState<Date | null>(new Date());
    return (
      <div className="space-y-3">
        <Calendar selected={date} onSelect={setDate} />
        <p className="text-xs text-muted-foreground font-mono">
          Selected Date: {date ? date.toDateString() : "None"}
        </p>
      </div>
    );
  },
};

export const PreselectedDate: Story = {
  render: () => {
    const fixedDate = new Date(2026, 11, 25);
    const [date, setDate] = React.useState<Date | null>(fixedDate);
    return (
      <div className="space-y-3">
        <Calendar selected={date} onSelect={setDate} />
        <p className="text-xs text-muted-foreground font-mono">
          Christmas 2026 Selected
        </p>
      </div>
    );
  },
};

export const MinMaxConstrained: Story = {
  render: () => {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), 5);
    const maxDate = new Date(today.getFullYear(), today.getMonth(), 25);
    const [date, setDate] = React.useState<Date | null>(today);

    return (
      <div className="space-y-3">
        <Calendar
          selected={date}
          onSelect={setDate}
          minDate={minDate}
          maxDate={maxDate}
        />
        <p className="text-xs text-muted-foreground font-mono">
          Only days between 5th and 25th of this month are selectable.
        </p>
      </div>
    );
  },
};
