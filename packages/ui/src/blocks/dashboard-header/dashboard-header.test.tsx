import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DashboardHeader } from "./dashboard-header";

describe("DashboardHeader Block", () => {
  it("renders title and search input and hides actions without handlers", () => {
    render(<DashboardHeader title="Analytics Overview" userName="Test User" />);

    expect(screen.getByText("Analytics Overview")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search dashboard...")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /notifications/i })
    ).not.toBeInTheDocument();
  });

  it("handles search queries", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<DashboardHeader onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText("Search dashboard..."), "reports");
    expect(onSearch).toHaveBeenCalled();
  });

  it("wires notification, action slot and user menu handlers additively", async () => {
    const user = userEvent.setup();
    const onNotificationsClick = vi.fn();
    const onProfileSettings = vi.fn();
    const onTeamManagement = vi.fn();
    const onLogout = vi.fn();

    render(
      <DashboardHeader
        userName="Test User"
        onNotificationsClick={onNotificationsClick}
        onProfileSettings={onProfileSettings}
        onTeamManagement={onTeamManagement}
        onLogout={onLogout}
        actions={<button type="button">Custom action</button>}
      />
    );

    await user.click(
      screen.getByRole("button", { name: /custom action/i })
    );
    expect(
      screen.getByRole("button", { name: /custom action/i })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /notifications/i }));
    expect(onNotificationsClick).toHaveBeenCalledOnce();

    await user.click(
      screen.getByRole("button", { name: /user menu for test user/i })
    );
    await user.click(
      await screen.findByRole("menuitem", { name: /profile settings/i })
    );
    expect(onProfileSettings).toHaveBeenCalledOnce();

    await user.click(
      screen.getByRole("button", { name: /user menu for test user/i })
    );
    await user.click(
      await screen.findByRole("menuitem", { name: /team management/i })
    );
    expect(onTeamManagement).toHaveBeenCalledOnce();

    await user.click(
      screen.getByRole("button", { name: /user menu for test user/i })
    );
    await user.click(await screen.findByRole("menuitem", { name: /log out/i }));
    expect(onLogout).toHaveBeenCalledOnce();
  });
});
