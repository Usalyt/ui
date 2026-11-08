import React from "react";
import { AppShellLayout } from "tu-ui";
import { Calendar, ClipboardList, LayoutDashboard, Settings, Users } from "lucide-react";

const recentEvaluations = [
  { id: "1", name: "Checkout flow audit", meta: "12 findings · updated 2h ago" },
  { id: "2", name: "Onboarding heuristics", meta: "7 findings · updated yesterday" },
  { id: "3", name: "Settings page review", meta: "3 findings · updated 3 days ago" },
];

export function AppShellLayoutDemo() {
  return (
    <div className="w-full">
      <div className="relative h-[600px] overflow-hidden rounded-lg border border-border [transform:translateZ(0)]">
        <AppShellLayout
          brandName="UX Check Platform"
          navItems={[
            { title: "Overview", href: "#", icon: <LayoutDashboard className="h-4 w-4" />, isActive: true },
            { title: "Evaluations", href: "#", icon: <ClipboardList className="h-4 w-4" /> },
            { title: "Calendar", href: "#", icon: <Calendar className="h-4 w-4" /> },
            { title: "Team Members", href: "#", icon: <Users className="h-4 w-4" /> },
            { title: "Settings", href: "#", icon: <Settings className="h-4 w-4" /> },
          ]}
          breadcrumbs={[
            { label: "Home", href: "#" },
            { label: "Projects", href: "#" },
            { label: "Checkout Flow Audit" },
          ]}
          user={{ name: "Alex Doe", email: "alex@uxcheck.io" }}
        >
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="text-xl font-bold text-foreground">Project Dashboard</h2>
            <p className="text-sm text-muted-foreground">
              Welcome to the collaborative heuristic evaluation workspace.
            </p>
            <div className="divide-y divide-border rounded-lg border border-border bg-card">
              {recentEvaluations.map((evaluation) => (
                <div key={evaluation.id} className="flex items-center justify-between gap-4 px-4 py-3">
                  <span className="text-sm font-medium text-foreground">{evaluation.name}</span>
                  <span className="font-mono text-xs text-muted-foreground">{evaluation.meta}</span>
                </div>
              ))}
            </div>
          </div>
        </AppShellLayout>
      </div>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Use the trigger in the header to collapse or reveal the sidebar.
      </p>
    </div>
  );
}
