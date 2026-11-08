import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./dialog";
import { Button } from "../button";
import { Input } from "../input";
import { Label } from "../label";

const meta: Meta<typeof Dialog> = {
  title: "Primitives/Dialog",
  component: Dialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const StandardModal: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open Terms</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Please review our updated terms of service before continuing.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 text-sm text-foreground leading-relaxed max-h-48 overflow-y-auto">
          By accessing or using our platform, you agree to be bound by these
          Terms of Service and all applicable laws and regulations. If you do
          not agree with any of these terms, you are prohibited from using or
          accessing this site.
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="default">I Understand</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Default: Story = StandardModal;

export const EditProfileFormModal: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="default">Edit Profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile Information</DialogTitle>
          <DialogDescription>
            Make changes to your profile details here. Click save when finished.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="dialog-name">Full Name</Label>
            <Input id="dialog-name" defaultValue="Sarah Connor" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dialog-email">Email Address</Label>
            <Input id="dialog-email" type="email" defaultValue="sarah@resistance.org" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose render={<Button variant="default">Save Changes</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const CustomCloseButton: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="destructive">Delete Project</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            project repository and remove all data from our servers.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-4">
          <DialogClose render={<Button variant="outline">Keep Project</Button>} />
          <DialogClose render={<Button variant="destructive">Confirm Delete</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open Long Dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Release notes</DialogTitle>
          <DialogDescription>
            Long dialog content used to verify short-viewport containment.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-foreground leading-relaxed">
          {Array.from({ length: 18 }, (_, index) => (
            <p key={index}>
              Paragraph {index + 1}: This release includes layout, spacing and
              accessibility corrections across the component library. Review
              each section before continuing to the next step.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <DialogClose render={<Button>Continue</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
