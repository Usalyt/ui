import React from "react";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@usalyt/ui";
import { BarChart3, FileText, Download, ShieldCheck, Settings } from "lucide-react";

const items = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "findings", label: "Findings", icon: FileText },
  { id: "export", label: "Export", icon: Download },
];

export function SidebarDemo() {
  const [active, setActive] = React.useState("findings");

  return (
    <div className="w-full max-w-2xl space-y-2">
      <div className="relative h-[360px] overflow-hidden rounded-lg border border-border [transform:translateZ(0)]">
        <SidebarProvider>
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <div className="flex h-8 items-center gap-2 px-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                  <ShieldCheck className="h-3.5 w-3.5 text-foreground" />
                </span>
                <span className="text-sm font-medium text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  Usalyt Check
                </span>
              </div>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Evaluation</SidebarGroupLabel>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={active === item.id}
                        onClick={() => setActive(item.id)}
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className="min-h-[360px]">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-3">
              <SidebarTrigger />
              <span className="text-sm font-medium text-foreground">
                Checkout flow evaluation
              </span>
            </header>
            <div className="flex flex-1 flex-col items-center justify-center gap-1 p-6 text-center">
              <p className="text-sm font-medium text-foreground">
                No findings yet
              </p>
              <p className="text-xs text-muted-foreground">
                Heuristic results appear here once the evaluation starts.
              </p>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        Press <span className="font-mono">⌘B</span> / <span className="font-mono">Ctrl+B</span>{" "}
        or use the trigger to collapse the sidebar to an icon rail.
      </p>
    </div>
  );
}
