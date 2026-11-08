import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Switch } from "./switch";
import { Label } from "../label";

const meta: Meta<typeof Switch> = {
  title: "Primitives/Switch",
  component: Switch,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);
    return (
      <div className="flex items-center space-x-2">
        <Switch
          id="default-switch"
          checked={checked}
          onCheckedChange={setChecked}
          {...args}
        />
        <Label htmlFor="default-switch" className="cursor-pointer">
          Airplane Mode ({checked ? "On" : "Off"})
        </Label>
      </div>
    );
  },
};

export const Checked: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch id="checked-switch" defaultChecked {...args} />
      <Label htmlFor="checked-switch" className="cursor-pointer">
        Wi-Fi Enabled
      </Label>
    </div>
  ),
};

export const LabeledSettingRow: Story = {
  render: () => {
    const [notifications, setNotifications] = React.useState(true);
    return (
      <div className="w-full max-w-sm p-4 border rounded-xl bg-background flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="push-notif" className="font-semibold cursor-pointer">
            Push Notifications
          </Label>
          <p className="text-xs text-muted-foreground">
            Receive real-time alerts on your device.
          </p>
        </div>
        <Switch
          id="push-notif"
          checked={notifications}
          onCheckedChange={setNotifications}
        />
      </div>
    );
  },
};

export const DisabledState: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="disabled-switch" disabled />
      <Label htmlFor="disabled-switch" className="cursor-not-allowed opacity-70">
        Disabled Setting
      </Label>
    </div>
  ),
};
