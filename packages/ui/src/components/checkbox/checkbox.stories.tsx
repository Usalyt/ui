import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox";
import { Label } from "../label";

const meta: Meta<typeof Checkbox> = {
  title: "Primitives/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    indeterminate: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = React.useState(false);
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          id="default-terms"
          checked={checked}
          onCheckedChange={setChecked}
          {...args}
        />
        <Label htmlFor="default-terms" className="cursor-pointer">
          Accept terms and conditions
        </Label>
      </div>
    );
  },
};

export const Checked: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="checked-option" defaultChecked {...args} />
      <Label htmlFor="checked-option" className="cursor-pointer">
        Option checked by default
      </Label>
    </div>
  ),
};

export const Indeterminate: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="indeterminate-option" indeterminate {...args} />
      <Label htmlFor="indeterminate-option" className="cursor-pointer">
        Select all items (partially selected)
      </Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Checkbox id="disabled-option" disabled {...args} />
      <Label htmlFor="disabled-option" className="cursor-not-allowed opacity-70">
        Disabled option
      </Label>
    </div>
  ),
};

export const FormIntegration: Story = {
  render: () => {
    const [preferences, setPreferences] = React.useState({
      marketing: true,
      product: false,
      security: true,
    });

    return (
      <div className="w-full max-w-sm space-y-3 p-4 border border-border rounded-xl bg-background">
        <h4 className="text-sm font-semibold">Notification Preferences</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pref-marketing"
              checked={preferences.marketing}
              onCheckedChange={(c) =>
                setPreferences((p) => ({ ...p, marketing: Boolean(c) }))
              }
            />
            <Label htmlFor="pref-marketing">Marketing updates</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pref-product"
              checked={preferences.product}
              onCheckedChange={(c) =>
                setPreferences((p) => ({ ...p, product: Boolean(c) }))
              }
            />
            <Label htmlFor="pref-product">Product announcements</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pref-security"
              checked={preferences.security}
              onCheckedChange={(c) =>
                setPreferences((p) => ({ ...p, security: Boolean(c) }))
              }
            />
            <Label htmlFor="pref-security">Security alerts (Required)</Label>
          </div>
        </div>
      </div>
    );
  },
};
