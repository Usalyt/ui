"use client";

import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../button";
import { Calendar } from "../calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const DatePicker = React.forwardRef<
  HTMLButtonElement,
  DatePickerProps
>(
  (
    {
      value,
      onChange,
      placeholder = "Pick a date",
      disabled = false,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);

    const formattedDate = value
      ? value.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : null;

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              ref={ref}
              variant="outline"
              disabled={disabled}
              aria-expanded={open}
              aria-label={formattedDate ?? placeholder}
              className={cn(
                "w-full justify-between font-normal text-xs h-9",
                className
              )}
            >
              <span className={cn(!value && "text-muted-foreground")}>
                {formattedDate ?? placeholder}
              </span>
              <CalendarIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          }
        />
        <PopoverContent className="w-auto p-0 border-0 bg-transparent shadow-none">
          <Calendar
            selected={value}
            onSelect={(date) => {
              onChange?.(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    );
  }
);

DatePicker.displayName = "DatePicker";
