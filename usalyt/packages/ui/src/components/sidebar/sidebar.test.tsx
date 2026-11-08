import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
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

describe("Sidebar Primitive Component", () => {
  it("renders desktop sidebar with menu items and inset content", () => {
    render(
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <span>Usalyt Check</span>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>Evaluations</SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <span>User Profile</span>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
          <main>Main Content</main>
        </SidebarInset>
      </SidebarProvider>
    );

    expect(screen.getByText("Usalyt Check")).toBeInTheDocument();
    expect(screen.getByText("Navigation")).toBeInTheDocument();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /toggle sidebar/i })).toBeInTheDocument();
  });

  it("toggles sidebar on trigger button click", async () => {
    const user = userEvent.setup();
    render(
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarContent>Sidebar Content</SidebarContent>
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger />
        </SidebarInset>
      </SidebarProvider>
    );

    const trigger = screen.getByRole("button", { name: /toggle sidebar/i });
    await user.click(trigger);
    const wrapper = document.querySelector('[data-state]');
    expect(wrapper).toHaveAttribute("data-state", "collapsed");
  });

  it("pins the icon-rail contract on menu buttons", () => {
    render(
      <SidebarProvider defaultOpen>
        <Sidebar collapsible="icon">
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton isActive aria-label="Evaluations">
                    <span>Evaluations</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      </SidebarProvider>
    );

    const button = screen.getByRole("button", { name: "Evaluations" });
    expect(button).toHaveAttribute("data-active", "true");
    expect(button.className).toContain("group-data-[collapsible=icon]:size-8");
    expect(button.className).toContain(
      "group-data-[collapsible=icon]:justify-center"
    );
    expect(button.className).toContain(
      "group-data-[collapsible=icon]:[&>span:last-child]:hidden"
    );
    expect(button.className).toContain("[&>span:last-child]:truncate");
  });
});
