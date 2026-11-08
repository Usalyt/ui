import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AspectRatio } from "./aspect-ratio";

const meta: Meta<typeof AspectRatio> = {
  title: "Primitives/AspectRatio",
  component: AspectRatio,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[400px]">
      <AspectRatio ratio={16 / 9} className="bg-muted rounded-md flex items-center justify-center border border-border">
        <span className="text-sm font-medium text-muted-foreground">16 / 9 Ratio</span>
      </AspectRatio>
    </div>
  ),
};
