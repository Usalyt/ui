import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ColorSwatch } from "./color-swatch";

const meta: Meta<typeof ColorSwatch> = {
  title: "Primitives/ColorSwatch",
  component: ColorSwatch,
  tags: ["autodocs"],
  args: {
    color: "#e4f222",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Palette: Story = {
  render: () => (
    <div className="grid gap-3 text-foreground">
      <ColorSwatch color="#08090a" />
      <ColorSwatch color="#e4f222" />
      <ColorSwatch color="#02b8cc" />
      <ColorSwatch color="#ffffff" />
    </div>
  ),
};
