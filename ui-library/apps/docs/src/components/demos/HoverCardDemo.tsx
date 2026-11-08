import React from "react";
import { HoverCard, HoverCardTrigger, HoverCardContent, Avatar, AvatarImage, AvatarFallback } from "tu-ui";

export function HoverCardDemo() {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <span className="text-sm font-semibold underline cursor-pointer">@nextjs</span>;
  }

  return (
    <HoverCard>
      <HoverCardTrigger render={<span className="text-sm font-semibold underline cursor-pointer">@nextjs</span>} />
      <HoverCardContent className="w-80 p-4 space-y-2">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1 text-xs">
            <h4 className="font-semibold text-sm">Next.js</h4>
            <p className="text-muted-foreground">The React Framework for the Web – created and maintained by @vercel.</p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
