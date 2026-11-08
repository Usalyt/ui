import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "./alert-dialog";
import { Button } from "../button";
import { AlertTriangle, Trash2, LogOut } from "lucide-react";

const meta: Meta<typeof AlertDialog> = {
  title: "Primitives/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline">Discard Draft</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Discard Unsaved Changes?</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes in your draft. If you leave now, all your edits will be permanently lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="outline">Keep Editing</Button>} />
          <AlertDialogAction render={<Button variant="destructive">Discard Changes</Button>} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const DestructiveConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="destructive" className="gap-2">
            <Trash2 className="h-4 w-4" /> Delete Repository
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive mb-1">
            <AlertTriangle className="h-5 w-5" />
            <AlertDialogTitle className="text-destructive">
              Delete Production Repository?
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the repository, all branches, tags, issues, and releases.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel render={<Button variant="outline">Cancel</Button>} />
          <AlertDialogAction render={<Button variant="destructive">Yes, Delete Repository</Button>} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const LogoutConfirmation: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button variant="secondary" size="sm" className="gap-2">
            <LogOut className="h-4 w-4" /> Sign Out
          </Button>
        }
      />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out of your session?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to enter your OAuth credentials again to resume active collaboration.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="outline">Cancel</Button>} />
          <AlertDialogAction render={<Button variant="default">Sign Out</Button>} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const LongContent: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline">Open Long Alert</Button>} />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Archive this workspace?</AlertDialogTitle>
          <AlertDialogDescription>
            Review the retained records before confirming this irreversible action.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-3 text-sm text-foreground leading-relaxed">
          {Array.from({ length: 18 }, (_, index) => (
            <p key={index}>
              Record group {index + 1}: evaluations, findings, screenshots and
              collaboration history retained for audit purposes.
            </p>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel render={<Button variant="outline">Cancel</Button>} />
          <AlertDialogAction render={<Button variant="destructive">Archive</Button>} />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
