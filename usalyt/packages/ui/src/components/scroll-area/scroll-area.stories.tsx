import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ScrollArea, ScrollBar } from "./scroll-area";

const meta: Meta<typeof ScrollArea> = {
  title: "Primitives/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-80 rounded-md border p-4">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold leading-none">Tags</h4>
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} className="text-xs border-b pb-2">
            v1.2.0-beta.{25 - i} — Release build artifact summary.
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const HorizontalOverflow: Story = {
  render: () => (
    <ScrollArea className="w-96 whitespace-nowrap rounded-md border p-4">
      <div className="flex w-max space-x-4 p-4">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-40 h-24 shrink-0 rounded-lg border bg-card p-4 flex flex-col justify-between"
          >
            <span className="text-xs font-semibold">Card #{i + 1}</span>
            <span className="text-[10px] text-muted-foreground">
              Horizontal scroll item
            </span>
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
