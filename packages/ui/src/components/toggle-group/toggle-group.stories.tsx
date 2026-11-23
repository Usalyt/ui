import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Bold,
  Italic,
  Underline,
} from "lucide-react";

const meta: Meta<typeof ToggleGroup> = {
  title: "Primitives/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <ToggleGroup aria-label="Text formatting" {...args}>
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const AlignmentToolbar: Story = {
  render: () => {
    const [alignment, setAlignment] = React.useState<any>(["center"]);
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Alignment Selection</h4>
        <ToggleGroup
          value={alignment}
          onValueChange={setAlignment}
          variant="outline"
          aria-label="Text alignment options"
        >
          <ToggleGroupItem value="left" aria-label="Align Left">
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" aria-label="Align Center">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" aria-label="Align Right">
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="justify" aria-label="Align Justify">
            <AlignJustify className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    );
  },
};

export const MultiSelectFormatting: Story = {
  render: () => {
    const [styles, setStyles] = React.useState<any>(["bold", "italic"]);
    return (
      <div className="space-y-2">
        <h4 className="text-sm font-semibold">Multi-Select Format Options</h4>
        <ToggleGroup
          value={styles}
          onValueChange={setStyles}
          variant="outline"
          aria-label="Font styles"
        >
          <ToggleGroupItem value="bold" aria-label="Bold">
            <Bold className="h-4 w-4" />
            <span className="text-xs">Bold</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <Italic className="h-4 w-4" />
            <span className="text-xs">Italic</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <Underline className="h-4 w-4" />
            <span className="text-xs">Underline</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    );
  },
};

export const DisabledItem: Story = {
  render: () => (
    <ToggleGroup variant="outline" aria-label="Font options">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic className="h-4 w-4" />
      </ToggleGroupItem>
      <ToggleGroupItem disabled value="strikethrough" aria-label="Strikethrough">
        <span className="line-through text-xs">S</span>
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};
