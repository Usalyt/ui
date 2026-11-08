import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "./select";
import { Label } from "../label";

const meta: Meta<typeof Select> = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [val, setVal] = React.useState("system");
    return (
      <div className="w-full max-w-xs space-y-2">
        <Label>Theme Preference</Label>
        <Select value={val} onValueChange={(v) => setVal(v ?? "")}>
          <SelectTrigger aria-label="Theme">
            <SelectValue placeholder="Select theme..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light Mode</SelectItem>
            <SelectItem value="dark">Dark Mode</SelectItem>
            <SelectItem value="system">System Preference</SelectItem>
          </SelectContent>
        </Select>
      </div>
    );
  },
};

export const GroupedOptions: Story = {
  render: () => (
    <div className="w-full max-w-xs space-y-2">
      <Label>Timezone Selection</Label>
      <Select defaultValue="est">
        <SelectTrigger aria-label="Timezone">
          <SelectValue placeholder="Select timezone" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>North America</SelectLabel>
            <SelectItem value="est">Eastern Standard Time (EST)</SelectItem>
            <SelectItem value="cst">Central Standard Time (CST)</SelectItem>
            <SelectItem value="pst">Pacific Standard Time (PST)</SelectItem>
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>Europe & Asia</SelectLabel>
            <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
            <SelectItem value="cet">Central European Time (CET)</SelectItem>
            <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const DisabledOption: Story = {
  render: () => (
    <div className="w-full max-w-xs space-y-2">
      <Label>Subscription Plan</Label>
      <Select defaultValue="pro">
        <SelectTrigger aria-label="Plan">
          <SelectValue placeholder="Select plan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="free">Free Starter ($0)</SelectItem>
          <SelectItem value="pro">Pro Plan ($29/mo)</SelectItem>
          <SelectItem disabled value="enterprise">
            Enterprise Tier (Contact Sales)
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};
