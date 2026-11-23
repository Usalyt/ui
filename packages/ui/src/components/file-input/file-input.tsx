import * as React from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "../../lib/utils";

export interface FileInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      disabled,
      onChange,
      onFocus,
      onBlur,
      ...props
    },
    ref
  ) => {
    const [fileNames, setFileNames] = React.useState<string[]>([]);
    const [focused, setFocused] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        setFileNames(Array.from(files).map((f) => f.name));
      } else {
        setFileNames([]);
      }
      onChange?.(e);
    };

    return (
      <div className="flex w-full flex-col gap-1.5">
        <label
          data-focused={focused ? "true" : undefined}
          className={cn(
            "relative flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background p-4 text-center transition-colors hover:border-primary/50 hover:bg-accent/50",
            "data-[focused=true]:border-ring data-[focused=true]:ring-2 data-[focused=true]:ring-ring",
            disabled && "cursor-not-allowed opacity-50 hover:border-border hover:bg-background",
            error && "border-destructive hover:border-destructive",
            className
          )}
        >
          <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {fileNames.length > 0
              ? fileNames.join(", ")
              : label || "Click to browse files"}
          </span>
          {helperText && !error && (
            <span className="mt-1 text-xs text-muted-foreground">
              {helperText}
            </span>
          )}
          {error && (
            <span className="mt-1 text-xs text-destructive font-medium">
              {error}
            </span>
          )}
          <input
            type="file"
            ref={ref}
            disabled={disabled}
            className="sr-only"
            onChange={handleChange}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...props}
          />
        </label>
      </div>
    );
  }
);
FileInput.displayName = "FileInput";

export { FileInput };
