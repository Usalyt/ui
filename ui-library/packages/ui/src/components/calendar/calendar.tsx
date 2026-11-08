"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../button";

export interface CalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  selected?: Date | null;
  onSelect?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ selected, onSelect, minDate, maxDate, className, ...props }, ref) => {
    const [currentDate, setCurrentDate] = React.useState(
      selected ?? new Date()
    );

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const handlePrevMonth = () => {
      setCurrentDate(new Date(year, month - 1, 1));
    };

    const handleNextMonth = () => {
      setCurrentDate(new Date(year, month + 1, 1));
    };

    const isSameDay = (d1: Date | null | undefined, d2: Date) => {
      if (!d1) return false;
      return (
        d1.getFullYear() === d2.getFullYear() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate()
      );
    };

    const isDisabled = (date: Date) => {
      if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0)))
        return true;
      if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999)))
        return true;
      return false;
    };

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return (
      <div
        ref={ref}
        role="region"
        aria-label="Calendar"
        className={cn(
          "w-64 p-3 bg-background border border-border rounded-xl text-foreground backdrop-blur-md",
          className
        )}
        {...props}
      >
        {/* Header with Month Navigation */}
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-semibold">
            {MONTH_NAMES[month]} {year}
          </span>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePrevMonth}
              aria-label="Previous month"
              className="h-7 w-7 p-0 hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              aria-label="Next month"
              className="h-7 w-7 p-0 hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1 mb-2 text-center">
          {DAY_NAMES.map((d) => (
            <span key={d} className="text-label font-medium text-muted-foreground">
              {d}
            </span>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1 text-center" role="group" aria-label="Calendar days">
          {days.map((date, idx) => {
            if (!date) {
              return <div key={`empty-${idx}`} className="h-7 w-7" />;
            }

            const isSelected = isSameDay(selected, date);
            const disabled = isDisabled(date);

            return (
              <button
                key={date.toISOString()}
                type="button"
                disabled={disabled}
                onClick={() => !disabled && onSelect?.(date)}
                aria-label={date.toDateString()}
                aria-pressed={isSelected}
                aria-disabled={disabled}
                className={cn(
                  "h-7 w-7 rounded-md text-xs font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-40 disabled:cursor-not-allowed",
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold shadow-subtle-3"
                    : "hover:bg-accent hover:text-accent-foreground text-foreground"
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

Calendar.displayName = "Calendar";
