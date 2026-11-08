import React from "react";
import { FileInput } from "@usalyt/ui";

export function FileInputDemo() {
  return (
    <div className="w-full max-w-xs">
      <FileInput
        label="Upload evaluation evidence"
        helperText="PNG, JPG or PDF up to 10MB"
      />
    </div>
  );
}
