import React from "react";
import { Rating } from "tu-ui";

export function RatingDemo() {
  const [value, setValue] = React.useState(0);

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm text-foreground">Rate the setup experience</p>
      <Rating value={value} onChange={setValue} max={5} />
      <p className="font-mono text-xs text-muted-foreground" role="status">
        {value === 0 ? "No rating yet — arrow keys work too" : `${value} of 5 stars`}
      </p>
    </div>
  );
}
