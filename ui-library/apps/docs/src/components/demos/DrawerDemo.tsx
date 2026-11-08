import React from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose, Button } from "tu-ui";

export function DrawerDemo() {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-center">
      <Drawer>
        <DrawerTrigger render={<Button variant="outline">Open Bottom Drawer</Button>} />
        <DrawerContent>
          <DrawerTitle>Bottom Drawer</DrawerTitle>
          <DrawerDescription>This is a mobile-ready slide-over drawer panel from the bottom.</DrawerDescription>
          <div className="mt-4 flex justify-end">
            <DrawerClose render={<Button variant="secondary">Close</Button>} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
