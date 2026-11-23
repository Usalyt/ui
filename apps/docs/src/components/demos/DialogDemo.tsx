import React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from "@usalyt/ui";

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button>Open Dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modal Dialog Title</DialogTitle>
          <DialogDescription>
            This is an accessible modal dialog built with Base UI primitive.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
