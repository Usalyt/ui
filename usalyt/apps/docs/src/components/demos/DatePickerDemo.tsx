import React from "react";
import { DatePicker } from "@usalyt/ui";

export function DatePickerDemo() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <div className="w-64">
      <DatePicker date={date} onSelect={setDate} />
    </div>
  );
}
