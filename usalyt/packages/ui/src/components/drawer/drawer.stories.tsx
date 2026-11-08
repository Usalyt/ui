import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "./drawer";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";

const meta: Meta<typeof Drawer> = {
  title: "Primitives/Drawer",
  component: Drawer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BottomDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open Bottom Drawer</Button>} />
      <DrawerContent side="bottom">
        <DrawerHeader>
          <DrawerTitle>Bottom Action Drawer</DrawerTitle>
          <DrawerDescription>
            Quick options for mobile and responsive layouts.
          </DrawerDescription>
        </DrawerHeader>
        <div className="py-4 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            Share Link
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            Copy URL
          </Button>
          <Button variant="ghost" className="w-full justify-start text-destructive">
            Delete Item
          </Button>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const Default: Story = BottomDrawer;

export const RightDrawer: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open Right Drawer</Button>} />
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Notification Center</DrawerTitle>
          <DrawerDescription>
            Recent updates and system alerts.
          </DrawerDescription>
        </DrawerHeader>
        <div className="py-4 space-y-3">
          <div className="p-3 border rounded-lg bg-accent/40 text-xs">
            <p className="font-semibold">Deployment Complete</p>
            <p className="text-muted-foreground">Version 2.4 deployed to production.</p>
          </div>
          <div className="p-3 border rounded-lg bg-accent/40 text-xs">
            <p className="font-semibold">New Team Member</p>
            <p className="text-muted-foreground">Alex joined the workspace.</p>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  ),
};

export const WithFormInputs: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button>New Project</Button>} />
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Create New Project</DrawerTitle>
          <DrawerDescription>
            Enter details for your new project workspace.
          </DrawerDescription>
        </DrawerHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="drawer-proj-name">Project Name</Label>
            <Input id="drawer-proj-name" placeholder="My Awesome Project" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="drawer-proj-slug">URL Slug</Label>
            <Input id="drawer-proj-slug" placeholder="my-awesome-project" />
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Cancel</Button>} />
          <DrawerClose render={<Button>Create Project</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
const longRows = Array.from({ length: 18 }, (_, index) => (
  <div key={index} className="rounded-md border border-border p-3 text-xs">
    <p className="font-semibold">Notification {index + 1}</p>
    <p className="text-muted-foreground">
      A long list item used to verify bounded panel scrolling.
    </p>
  </div>
));

export const LongContentRight: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open Long Right Drawer</Button>} />
      <DrawerContent side="right">
        <DrawerHeader>
          <DrawerTitle>Notification history</DrawerTitle>
          <DrawerDescription>Scrollable right-side panel content.</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-3 py-4">{longRows}</div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Dismiss</Button>} />
          <DrawerClose render={<Button>Mark all read</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const LongContentBottom: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger render={<Button variant="outline">Open Long Bottom Drawer</Button>} />
      <DrawerContent side="bottom">
        <DrawerHeader>
          <DrawerTitle>Quick actions</DrawerTitle>
          <DrawerDescription>Scrollable bottom panel content.</DrawerDescription>
        </DrawerHeader>
        <div className="space-y-3 py-4">{longRows}</div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline">Dismiss</Button>} />
          <DrawerClose render={<Button>Continue</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};
