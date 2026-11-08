import React from "react";
import { AuthForm } from "@usalyt/ui";

export function AuthFormDemo() {
  return (
    <AuthForm
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 800));
        console.log("Submitted:", values);
      }}
    />
  );
}
