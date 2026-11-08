import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Label } from "../label";

const meta: Meta<typeof RadioGroup> = {
  title: "Primitives/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = React.useState("comfortable");
    return (
      <RadioGroup
        value={selected}
        onValueChange={(val) => setSelected(val as string)}
        aria-label="Display Density"
      >
        <div className="flex items-center gap-2.5">
          <RadioGroupItem value="default" id="r-default" />
          <Label htmlFor="r-default" className="cursor-pointer">
            Default Density
          </Label>
        </div>
        <div className="flex items-center gap-2.5">
          <RadioGroupItem value="comfortable" id="r-comfortable" />
          <Label htmlFor="r-comfortable" className="cursor-pointer">
            Comfortable Density
          </Label>
        </div>
        <div className="flex items-center gap-2.5">
          <RadioGroupItem value="compact" id="r-compact" />
          <Label htmlFor="r-compact" className="cursor-pointer">
            Compact Density
          </Label>
        </div>
      </RadioGroup>
    );
  },
};

export const CardStyle: Story = {
  render: () => {
    const [plan, setPlan] = React.useState("pro");

    const cardClass = (value: string) =>
      plan === value
        ? "border-primary bg-primary/5"
        : "border-border bg-card hover:border-fog";

    return (
      <div className="flex w-full max-w-md flex-col gap-3">
        <h4 className="text-body-sm font-w510 text-foreground">
          Subscription Plan
        </h4>
        <RadioGroup
          value={plan}
          onValueChange={(val) => setPlan(val as string)}
          className="gap-3"
        >
          <div
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${cardClass(
              "starter"
            )}`}
          >
            <RadioGroupItem value="starter" id="card-starter" />
            <div>
              <Label
                htmlFor="card-starter"
                className="cursor-pointer font-w510"
              >
                Free Starter
              </Label>
              <p className="text-caption text-muted-foreground">
                Up to 3 team members and 1GB storage.
              </p>
            </div>
          </div>
          <div
            className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors ${cardClass(
              "pro"
            )}`}
          >
            <RadioGroupItem value="pro" id="card-pro" />
            <div>
              <Label htmlFor="card-pro" className="cursor-pointer font-w510">
                Pro Tier ($29/mo)
              </Label>
              <p className="text-caption text-muted-foreground">
                Unlimited members, 100GB storage and priority support.
              </p>
            </div>
          </div>
        </RadioGroup>
      </div>
    );
  },
};

export const DisabledOption: Story = {
  render: () => (
    <RadioGroup defaultValue="opt-1" aria-label="Feature Availability">
      <div className="flex items-center gap-2.5">
        <RadioGroupItem value="opt-1" id="d-opt1" />
        <Label htmlFor="d-opt1" className="cursor-pointer">
          Standard Shipping (Free)
        </Label>
      </div>
      <div className="flex items-center gap-2.5">
        <RadioGroupItem value="opt-2" id="d-opt2" disabled />
        <Label htmlFor="d-opt2" className="cursor-not-allowed opacity-60">
          Same Day Express (Unavailable in your area)
        </Label>
      </div>
    </RadioGroup>
  ),
};
