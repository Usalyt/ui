import React from "react";
import { DashboardHeader } from "@usalyt/ui";

export function DashboardHeaderDemo() {
  return (
    <DashboardHeader
      userName="Alex Rivera"
      notificationCount={2}
      onNotificationsClick={() => console.log("Open notifications")}
      onProfileSettings={() => console.log("Profile settings")}
      onTeamManagement={() => console.log("Team management")}
      onLogout={() => console.log("Log out")}
    />
  );
}
