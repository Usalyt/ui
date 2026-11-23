import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Rating } from "./rating";

const meta: Meta<typeof Rating> = {
  title: "Primitives/Rating",
  component: Rating,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-xs text-muted-foreground mb-1">Interactive Rating:</p>
        <Rating defaultValue={3} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">ReadOnly Score:</p>
        <Rating defaultValue={4} readOnly />
      </div>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const [value, setValue] = React.useState(2);
    return (
      <div className="flex flex-col gap-2">
        <Rating value={value} onChange={setValue} />
        <p className="text-xs text-muted-foreground">Controlled value: {value}</p>
      </div>
    );
  }
};
