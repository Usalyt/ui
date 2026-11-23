import React from "react";
import { Calendar } from "@usalyt/ui";

export function CalendarDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="p-2 border rounded-xl shadow-sm bg-background">
      <Calendar mode="single" selected={date} onSelect={setDate} />
    </div>
  );
}
