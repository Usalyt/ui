import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Combobox } from "./combobox";
import { Label } from "../label";

const meta: Meta<typeof Combobox> = {
  title: "Primitives/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
    placeholder: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const frameworkOptions = [
  { value: "next", label: "Next.js 15" },
  { value: "react", label: "React 19" },
  { value: "vue", label: "Vue 3" },
  { value: "svelte", label: "Svelte 5" },
  { value: "angular", label: "Angular (Legacy)", disabled: true },
];

export const Default: Story = {
  render: (args) => {
    const [val, setVal] = React.useState<string>("");
    return (
      <div className="w-full max-w-xs space-y-2">
        <Label htmlFor="framework-select">Select Framework</Label>
        <Combobox
          placeholder="Select framework..."
          {...args}
          options={frameworkOptions}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

export const WithSelectedValue: Story = {
  render: () => {
    const [val, setVal] = React.useState<string>("next");
    return (
      <div className="w-full max-w-xs space-y-2">
        <Label>Pre-selected Framework</Label>
        <Combobox
          options={frameworkOptions}
          value={val}
          onChange={setVal}
        />
      </div>
    );
  },
};

export const DisabledCombobox: Story = {
  render: () => (
    <div className="w-full max-w-xs space-y-2">
      <Label>Disabled Selector</Label>
      <Combobox
        disabled
        options={frameworkOptions}
        placeholder="Locked selector"
      />
    </div>
  ),
};