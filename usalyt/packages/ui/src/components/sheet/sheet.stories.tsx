import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
} from "./sheet";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";

const meta: Meta<typeof Sheet> = {
  title: "Primitives/Sheet",
  component: Sheet,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const RightSideSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open Right Sheet</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Access quick links and account settings.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-3">
          <p className="text-sm">Profile</p>
          <p className="text-sm">Settings</p>
          <p className="text-sm">Notifications</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Default: Story = RightSideSheet;

export const LeftSideSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open Left Sheet</Button>} />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Sidebar Navigation</SheetTitle>
          <SheetDescription>
            Project workspace navigation.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4 space-y-3">
          <p className="text-sm font-medium">Dashboard</p>
          <p className="text-sm font-medium">Analytics</p>
          <p className="text-sm font-medium">Projects</p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const BottomSheet: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open Bottom Sheet</Button>} />
      <SheetContent side="bottom" className="max-h-[80vh]">
        <SheetHeader>
          <SheetTitle>Cookie Preferences</SheetTitle>
          <SheetDescription>
            Manage how we use cookies on this device.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Decline Optional</Button>} />
          <SheetClose render={<Button variant="default">Accept All</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button>Edit Profile</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-1.5">
            <Label htmlFor="sheet-name">Name</Label>
            <Input id="sheet-name" defaultValue="Alex Rivera" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sheet-username">Username</Label>
            <Input id="sheet-username" defaultValue="@arivera" />
          </div>
        </div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <SheetClose render={<Button>Save Changes</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
const longSheetRows = Array.from({ length: 18 }, (_, index) => (
  <div key={index} className="rounded-md border border-border p-3 text-xs">
    <p className="font-semibold">Preference {index + 1}</p>
    <p className="text-muted-foreground">
      A long list item used to verify bounded panel scrolling.
    </p>
  </div>
));

export const LongContentRight: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open Long Right Sheet</Button>} />
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Account settings</SheetTitle>
          <SheetDescription>Scrollable right-side sheet content.</SheetDescription>
        </SheetHeader>
        <div className="space-y-3 py-4">{longSheetRows}</div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Cancel</Button>} />
          <SheetClose render={<Button>Save</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const LongContentBottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Open Long Bottom Sheet</Button>} />
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Cookie preferences</SheetTitle>
          <SheetDescription>Scrollable bottom sheet content.</SheetDescription>
        </SheetHeader>
        <div className="space-y-3 py-4">{longSheetRows}</div>
        <SheetFooter>
          <SheetClose render={<Button variant="outline">Decline</Button>} />
          <SheetClose render={<Button>Accept all</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
