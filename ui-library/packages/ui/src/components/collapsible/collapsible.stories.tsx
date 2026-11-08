import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "./collapsible";
import { Button } from "../button";
import { ChevronsUpDown, Eye, EyeOff } from "lucide-react";

const meta: Meta<typeof Collapsible> = {
  title: "Primitives/Collapsible",
  component: Collapsible,
  tags: ["autodocs"],
  argTypes: {
    defaultOpen: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <div className="w-full max-w-sm space-y-2 p-4 border rounded-xl bg-background">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">@tu-ui/collapsible</h4>
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger
              render={
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <ChevronsUpDown className="h-4 w-4" />
                  <span className="sr-only">Toggle details</span>
                </Button>
              }
            />
          </Collapsible>
        </div>
        <div className="rounded-md border px-4 py-3 font-mono text-xs">
          @tu-ui/core (installed)
        </div>
        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleContent className="space-y-2 pt-2">
            <div className="rounded-md border px-4 py-3 font-mono text-xs">
              @tu-ui/primitives (installed)
            </div>
            <div className="rounded-md border px-4 py-3 font-mono text-xs">
              @tu-ui/icons (installed)
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  },
};

export const DefaultOpen: Story = {
  render: () => (
    <div className="w-full max-w-sm p-4 border rounded-xl bg-background space-y-2">
      <Collapsible defaultOpen>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold">API Key Settings</h4>
          <CollapsibleTrigger render={<Button size="sm">Toggle API Key</Button>} />
        </div>
        <CollapsibleContent className="pt-3">
          <div className="p-3 bg-muted rounded-md font-mono text-xs text-foreground">
            pk_live_51M001928391823901823
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
