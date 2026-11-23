import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClipboardCheck, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "../avatar";
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "./sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Primitives/Sidebar",
  component: Sidebar,
  parameters: {
    // The rail is a fixed, full-height navigation surface: without the
    // fullscreen layout the preview centers the wrapper and SidebarInset
    // collapses to a sliver instead of filling the remaining width.
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="flex items-center gap-2.5 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent text-label font-w510 text-foreground">
              U
            </span>
            <span className="truncate text-body-sm font-w510 text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Usalyt Check
            </span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive
                  aria-label="Evaluations"
                  title="Evaluations"
                >
                  <ClipboardCheck />
                  <span>Evaluations</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton aria-label="Settings" title="Settings">
                  <Settings />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="flex items-center gap-2.5 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
            <Avatar className="h-7 w-7 shrink-0 border border-sidebar-border">
              <AvatarFallback className="bg-sidebar-accent text-label font-w510 text-sidebar-accent-foreground">
                AE
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
              <span className="truncate text-label font-w510 text-sidebar-foreground">
                Alex Evaluator
              </span>
              <span className="truncate font-mono text-micro text-muted-foreground">
                v1.0.0
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="p-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <span className="text-label text-muted-foreground">
            Main App Content Area
          </span>
        </div>
      </SidebarInset>
    </SidebarProvider>
  ),
};
