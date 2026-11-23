import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverClose,
} from "./popover";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";
import { Filter, SlidersHorizontal } from "lucide-react";

const meta: Meta<typeof Popover> = {
  title: "Primitives/Popover",
  component: Popover,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium leading-none text-sm">Popover Title</h4>
          <p className="text-xs text-muted-foreground">
            This is a floating popup overlay powered by Base UI.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const FilterPopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-3.5 w-3.5" /> Filter Results
          </Button>
        }
      />
      <PopoverContent align="start" className="w-80 space-y-3">
        <div className="flex items-center justify-between border-b pb-2">
          <h4 className="font-semibold text-sm">Filter Dataset</h4>
          <PopoverClose
            render={
              <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                Clear
              </Button>
            }
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs">Category</Label>
          <Input placeholder="Search category..." inputSize="sm" />
        </div>
        <div className="flex justify-end pt-2">
          <PopoverClose render={<Button size="sm">Apply Filters</Button>} />
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const FormPopover: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="secondary" size="sm" className="gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Dimensions
          </Button>
        }
      />
      <PopoverContent className="w-80 space-y-4">
        <div className="space-y-1">
          <h4 className="font-medium text-sm">Dimensions</h4>
          <p className="text-xs text-muted-foreground">
            Set the width and max height for the canvas layer.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor="popover-width" className="text-xs">
              Width
            </Label>
            <Input id="popover-width" defaultValue="100%" inputSize="sm" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="popover-height" className="text-xs">
              Height
            </Label>
            <Input id="popover-height" defaultValue="300px" inputSize="sm" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};