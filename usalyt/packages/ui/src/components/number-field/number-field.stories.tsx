import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberField } from "./number-field";
import { Label } from "../label";

const meta: Meta<typeof NumberField> = {
  title: "Primitives/NumberField",
  component: NumberField,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = React.useState<number | null>(3);
    return (
      <div className="w-full max-w-xs space-y-2">
        <Label id="quantity-label">Quantity</Label>
        <NumberField
          aria-label="Quantity"
          value={val}
          onValueChange={setVal}
          min={1}
          max={20}
        />
      </div>
    );
  },
};

export const MinMaxConstrained: Story = {
  render: () => {
    const [val, setVal] = React.useState<number | null>(5);
    return (
      <div className="w-full max-w-xs space-y-2">
        <Label id="score-label">Evaluation Score (Range 1 - 10)</Label>
        <NumberField
          aria-label="Evaluation Score (Range 1 - 10)"
          value={val}
          onValueChange={setVal}
          min={1}
          max={10}
          step={1}
        />
      </div>
    );
  },
};

export const DisabledNumberField: Story = {
  render: () => (
    <div className="w-full max-w-xs space-y-2">
      <Label id="locked-quantity-label">Locked Quantity</Label>
      <NumberField
        aria-label="Locked Quantity"
        disabled
        defaultValue={5}
      />
    </div>
  ),
};