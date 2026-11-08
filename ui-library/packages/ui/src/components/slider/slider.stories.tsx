import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "./slider";
import { Label } from "../label";

const meta: Meta<typeof Slider> = {
  title: "Primitives/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [val, setVal] = React.useState<number | readonly number[]>(50);
    return (
      <div className="w-full max-w-sm space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Volume Control</Label>
          <span className="text-xs font-mono font-bold">
            {Array.isArray(val) ? val[0] : val}%
          </span>
        </div>
        <Slider
          value={val}
          onValueChange={setVal}
          min={0}
          max={100}
          step={1}
          aria-label="Volume Control"
          {...args}
        />
      </div>
    );
  },
};

export const WithLabelAndValue: Story = {
  render: () => {
    const [brightness, setBrightness] = React.useState<
      number | readonly number[]
    >(75);
    return (
      <div className="w-full max-w-sm space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-semibold">Display Brightness</Label>
          <span className="text-xs font-mono font-bold">
            {Array.isArray(brightness) ? brightness[0] : brightness}%
          </span>
        </div>
        <Slider
          value={brightness}
          onValueChange={setBrightness}
          min={0}
          max={100}
          step={5}
          aria-label="Display Brightness"
        />
      </div>
    );
  },
};

export const DisabledState: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-3">
      <div className="flex items-center justify-between text-muted-foreground">
        <Label className="text-sm font-semibold">Disabled Setting</Label>
        <span className="text-xs font-mono">30%</span>
      </div>
      <Slider disabled defaultValue={30} aria-label="Disabled Setting" />
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-64 items-center gap-4">
      <Slider
        orientation="vertical"
        defaultValue={40}
        aria-label="Vertical volume"
        className="h-full"
      />
    </div>
  ),
};
