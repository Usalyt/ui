import React from "react";
import { Alert, AlertTitle, AlertDescription } from "@usalyt/ui";

export function AlertDemo() {
  return (
    <div className="flex flex-col gap-4 w-full max-w-lg">
      <Alert variant="default">
        <AlertTitle>Default Alert</AlertTitle>
        <AlertDescription>This is a standard default alert notification.</AlertDescription>
      </Alert>
      <Alert variant="destructive">
        <AlertTitle>Error Encountered</AlertTitle>
        <AlertDescription>Your session has expired. Please log in again.</AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Storage Limit Warning</AlertTitle>
        <AlertDescription>You are approaching your project storage quota limit.</AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Deployment Successful</AlertTitle>
        <AlertDescription>Your project has been deployed to production.</AlertDescription>
      </Alert>
    </div>
  );
}
