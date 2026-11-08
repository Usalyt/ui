import React from "react";
import { Input, Label } from "tu-ui";

export function InputDemo() {
  return (
    <div className="flex flex-col gap-5 w-full max-w-sm">
      <div className="space-y-1.5">
        <Label htmlFor="email-input">Email address</Label>
        <Input id="email-input" type="email" placeholder="name@example.com" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password-input">Password</Label>
        <Input id="password-input" type="password" placeholder="Enter password" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="disabled-input">Disabled input</Label>
        <Input id="disabled-input" disabled placeholder="Disabled field" />
      </div>
    </div>
  );
}
