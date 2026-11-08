import React from "react";
import { Switch, Label } from "tu-ui";

export function SwitchDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center space-x-2">
        <Switch id="switch-on" defaultChecked />
        <Label htmlFor="switch-on">Airplane Mode (Active)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="switch-off" />
        <Label htmlFor="switch-off">Notifications (Inactive)</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="switch-disabled" disabled />
        <Label htmlFor="switch-disabled">Bluetooth (Disabled)</Label>
      </div>
    </div>
  );
}
