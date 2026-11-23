import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";
import { Button } from "../button";
import { Info, HelpCircle, Plus, Settings } from "lucide-react";

const meta: Meta<typeof Tooltip> = {
  title: "Primitives/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover or Focus Me</Button>} />
        <TooltipContent>
          Base UI Tooltip with automatic positioning and ARIA binding.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const TopPlacement: Story = {
  render: () => (
    <TooltipProvider>
      <div className="py-8 flex justify-center">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="secondary" size="sm" className="gap-2">
                <HelpCircle className="h-4 w-4" /> Help Info
              </Button>
            }
          />
          <TooltipContent className="bg-popover text-popover-foreground border">
            Clicking this button opens the contextual help documentation.
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};

export const IconOnlyTrigger: Story = {
  render: () => (
    <TooltipProvider>
      <div className="flex gap-2">
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Add new project">
                <Plus className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContent>Add Project</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger
            render={
              <Button variant="ghost" size="icon" aria-label="Settings">
                <Settings className="h-4 w-4" />
              </Button>
            }
          />
          <TooltipContent>Manage Settings</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  ),
};