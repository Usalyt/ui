import React from "react";
import { FormWithValidation } from "tu-ui";

export function FormWithValidationDemo() {
  return (
    <FormWithValidation
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        console.log("Saved:", values);
      }}
    />
  );
}
