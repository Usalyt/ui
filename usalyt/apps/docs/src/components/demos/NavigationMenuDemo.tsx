import React from "react";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@usalyt/ui";

export function NavigationMenuDemo() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2 text-xs font-medium text-muted-foreground p-2 border rounded-md">
        <span>Getting Started</span>
        <span>•</span>
        <span>Components</span>
      </div>
    );
  }

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex gap-2">
        <NavigationMenuItem>
          <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium border rounded-md">Getting Started</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 w-64 bg-popover border rounded-md shadow-lg mt-1">
            <NavigationMenuLink href="/getting-started/introduction" className="block p-2 hover:bg-accent rounded text-sm">
              Introduction
            </NavigationMenuLink>
            <NavigationMenuLink href="/getting-started/installation" className="block p-2 hover:bg-accent rounded text-sm">
              Installation
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="px-3 py-2 text-sm font-medium border rounded-md">Components</NavigationMenuTrigger>
          <NavigationMenuContent className="p-4 w-64 bg-popover border rounded-md shadow-lg mt-1">
            <NavigationMenuLink href="/components/button" className="block p-2 hover:bg-accent rounded text-sm">
              Button
            </NavigationMenuLink>
            <NavigationMenuLink href="/components/dialog" className="block p-2 hover:bg-accent rounded text-sm">
              Dialog
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
