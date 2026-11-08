import React from "react";
import { Popover, PopoverTrigger, PopoverContent, Button, Input, Label } from "@usalyt/ui";

export function PopoverDemo() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline">Open Popover</Button>;
  }

  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open Popover</Button>} />
      <PopoverContent className="w-80 p-4 space-y-3">
        <h4 className="font-medium text-sm">Dimensions</h4>
        <div className="grid grid-cols-3 items-center gap-2 text-xs">
          <Label htmlFor="width">Width</Label>
          <Input id="width" defaultValue="100%" className="col-span-2 h-8 text-xs" />
        </div>
      </PopoverContent>
    </Popover>
  );
}
