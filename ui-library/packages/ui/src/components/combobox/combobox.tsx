"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Filterable single-select. The trigger stays the ARIA combobox
 * (DESIGN.md selector surface); the popup input owns a managed highlight —
 * ArrowDown/ArrowUp/Home/End move an active index while focus stays in the
 * input, `aria-activedescendant` always points at the highlighted option,
 * Enter commits and Escape dismisses with focus restored to the trigger.
 */
export const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onChange,
      placeholder = "Select option...",
      searchPlaceholder = "Search options...",
      disabled = false,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [activeIndex, setActiveIndex] = React.useState(-1);

    const triggerRef = React.useRef<HTMLButtonElement | null>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    const listboxId = React.useId();
    const optionId = (index: number) => `${listboxId}-option-${index}`;

    const setTriggerRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        triggerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref]
    );

    const filteredOptions = options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase())
    );

    const selectedOption = options.find((o) => o.value === value);

    React.useEffect(() => {
      if (open) inputRef.current?.focus();
    }, [open]);

    // Keep the highlighted row visible while arrowing through a long list.
    React.useEffect(() => {
      if (!open || activeIndex < 0) return;
      const node = document.getElementById(optionId(activeIndex));
      node?.scrollIntoView?.({ block: "nearest" });
    }, [open, activeIndex]);

    const closeCombobox = (restoreFocus: boolean) => {
      setOpen(false);
      setSearch("");
      setActiveIndex(-1);
      if (restoreFocus) triggerRef.current?.focus();
    };

    const moveActive = (delta: 1 | -1) => {
      setActiveIndex((current) => {
        const count = filteredOptions.length;
        if (count === 0) return -1;
        let next = current;
        for (let step = 0; step < count; step++) {
          next = (next + delta + count) % count;
          if (!filteredOptions[next].disabled) return next;
        }
        return current;
      });
    };

    const moveActiveToEdge = (edge: "first" | "last") => {
      setActiveIndex(() => {
        const enabled = filteredOptions
          .map((option, index) => (option.disabled ? -1 : index))
          .filter((index) => index >= 0);
        if (enabled.length === 0) return -1;
        return edge === "first" ? enabled[0] : enabled[enabled.length - 1];
      });
    };

    const selectOption = (option: ComboboxOption) => {
      if (option.disabled) return;
      onChange?.(option.value);
      closeCombobox(true);
    };

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          moveActive(1);
          break;
        case "ArrowUp":
          event.preventDefault();
          moveActive(-1);
          break;
        case "Home":
          event.preventDefault();
          moveActiveToEdge("first");
          break;
        case "End":
          event.preventDefault();
          moveActiveToEdge("last");
          break;
        case "Enter": {
          event.preventDefault();
          const option = filteredOptions[activeIndex];
          if (option) selectOption(option);
          break;
        }
        case "Escape":
          event.preventDefault();
          closeCombobox(true);
          break;
        default:
          break;
      }
    };

    const activeOption =
      activeIndex >= 0 ? filteredOptions[activeIndex] : undefined;

    return (
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (next) setOpen(true);
          else closeCombobox(false);
        }}
      >
        <PopoverTrigger
          render={
            <button
              ref={setTriggerRef}
              type="button"
              role="combobox"
              disabled={disabled}
              aria-expanded={open}
              aria-haspopup="listbox"
              aria-controls={open ? listboxId : undefined}
              aria-label={selectedOption ? selectedOption.label : placeholder}
              className={cn(
                "flex h-9 w-full items-center justify-between rounded-md border border-input bg-field px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring disabled:cursor-not-allowed disabled:opacity-50",
                className
              )}
            >
              <span className="line-clamp-1 text-left">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-fog" />
            </button>
          }
        />
        <PopoverContent
          align="start"
          className="w-[var(--anchor-width)] rounded-lg border border-border bg-popover p-1 text-popover-foreground shadow-(--shadow-xl) data-open:animate-overlay-in data-closed:animate-overlay-out"
        >
          <span
            className="sr-only"
            role="status"
            aria-live="polite"
            aria-atomic="true"
          >
            {filteredOptions.length === 0
              ? "No options found."
              : `${filteredOptions.length} ${
                  filteredOptions.length === 1 ? "option" : "options"
                } available.`}
          </span>

          <div className="flex items-center gap-2 border-b border-border px-2.5">
            <Search className="h-3.5 w-3.5 shrink-0 text-fog" aria-hidden="true" />
            <input
              ref={inputRef}
              type="text"
              role="combobox"
              aria-expanded={open}
              aria-controls={listboxId}
              aria-autocomplete="list"
              aria-activedescendant={
                activeOption ? optionId(activeIndex) : undefined
              }
              placeholder={searchPlaceholder}
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setActiveIndex(-1);
              }}
              onKeyDown={handleInputKeyDown}
              className="h-9 flex-1 bg-transparent text-caption text-foreground outline-none placeholder:text-fog"
            />
          </div>

          <div
            id={listboxId}
            role="listbox"
            aria-label={placeholder}
            className="max-h-64 overflow-y-auto p-1"
          >
            {filteredOptions.length === 0 ? (
              <div className="py-6 text-center text-caption text-muted-foreground">
                No options found.
              </div>
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = value === option.value;
                const isHighlighted = index === activeIndex;
                return (
                  <div
                    key={option.value}
                    id={optionId(index)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    data-highlighted={isHighlighted ? "true" : undefined}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectOption(option)}
                    className={cn(
                      "flex h-8 cursor-pointer select-none items-center gap-2 rounded-md px-2.5 text-caption text-muted-foreground transition-colors data-[highlighted]:bg-accent data-[highlighted]:text-foreground",
                      option.disabled
                        ? "cursor-not-allowed opacity-50"
                        : "hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <span className="flex-1 truncate">{option.label}</span>
                    {isSelected && (
                      <Check
                        className="h-3.5 w-3.5 shrink-0 text-foreground"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    );
  }
);

Combobox.displayName = "Combobox";
