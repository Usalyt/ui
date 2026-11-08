import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent, Button } from "tu-ui";

export function TooltipDemo() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline">Hover me</Button>;
  }

  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent>
        <p className="text-xs">Add to library</p>
      </TooltipContent>
    </Tooltip>
  );
}
