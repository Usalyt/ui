import React from "react";
import { ChartContainer, ChartLegend } from "tu-ui";

export function ChartDemo() {
  return (
    <ChartContainer title="Sales Performance" description="Monthly breakdown" className="max-w-md">
      <ChartLegend
        items={[
          { label: "Direct", color: "oklch(0.6 0.18 145)" },
          { label: "Referral", color: "oklch(0.5 0.2 250)" },
        ]}
      />
    </ChartContainer>
  );
}
