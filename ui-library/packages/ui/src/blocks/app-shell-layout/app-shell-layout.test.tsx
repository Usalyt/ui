import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AppShellLayout, type NavItem } from "./app-shell-layout";

const navItems: NavItem[] = [
  { title: "Evaluations", href: "/evaluations", isActive: true },
  { title: "Calendar", href: "/calendar" },
];

describe("AppShellLayout Block", () => {
  it("renders sidebar with brand name, nav items and user profile", () => {
    render(
      <AppShellLayout
        brandName="UX Check Pro"
        navItems={navItems}
        user={{ name: "Elena R.", email: "elena@uxcheck.io" }}
      >
        <div>Main Dashboard Content</div>
      </AppShellLayout>
    );

    expect(screen.getByText("UX Check Pro")).toBeInTheDocument();
    expect(screen.getByText("Evaluations")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Elena R.")).toBeInTheDocument();
    expect(screen.getByText("Main Dashboard Content")).toBeInTheDocument();
  });

  it("calls onSearchClick and onNotificationsClick callbacks", async () => {
    const user = userEvent.setup();
    const handleSearch = vi.fn();
    const handleNotifications = vi.fn();

    render(
      <AppShellLayout
        onSearchClick={handleSearch}
        onNotificationsClick={handleNotifications}
      />
    );

    const searchBtn = screen.getByRole("button", { name: /search/i });
    await user.click(searchBtn);
    expect(handleSearch).toHaveBeenCalledOnce();

    const notifBtn = screen.getByRole("button", { name: /notifications/i });
    await user.click(notifBtn);
    expect(handleNotifications).toHaveBeenCalledOnce();
  });
});
