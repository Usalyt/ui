"use client";

import * as React from "react";
import { Bell, Search } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from "../../components/sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { Button } from "../../components/button";

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

export interface AppShellLayoutProps
  extends React.HTMLAttributes<HTMLDivElement> {
  brandName?: string;
  brandLogo?: React.ReactNode;
  navItems?: NavItem[];
  breadcrumbs?: Array<{ label: string; href?: string }>;
  user?: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
  onSearchClick?: () => void;
  onNotificationsClick?: () => void;
  children?: React.ReactNode;
}

export function AppShellLayout({
  brandName = "Usalyt",
  brandLogo,
  navItems = [],
  breadcrumbs = [{ label: "Dashboard", href: "/" }, { label: "Overview" }],
  user = { name: "Alex Evaluator", email: "alex@example.com" },
  onSearchClick,
  onNotificationsClick,
  children,
  className,
  ...props
}: AppShellLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div
        className={cn("flex min-h-screen w-full bg-background text-foreground", className)}
        {...props}
      >
        <Sidebar className="border-r border-border bg-surface-raised">
          <SidebarHeader className="border-b border-border px-4 py-3 bg-surface-raised">
            <div className="flex items-center gap-2 font-bold text-foreground">
              {brandLogo}
              <span className="text-base tracking-tight">{brandName}</span>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3 bg-surface-raised">
            <nav
              className="flex flex-col gap-1"
              aria-label="Sidebar Navigation"
            >
              {navItems.map((item, idx) => (
                <a
                  key={idx}
                  href={item.href}
                  aria-current={item.isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium tracking-tight-linear transition-colors",
                    item.isActive
                      ? "bg-muted text-foreground border border-border"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              ))}
            </nav>
          </SidebarContent>

          <SidebarFooter className="border-t border-border p-3 bg-surface-raised">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-border">
                {user.avatarUrl && (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                )}
                <AvatarFallback className="bg-muted text-foreground text-xs">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col truncate">
                <span className="text-xs font-semibold text-foreground truncate">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user.email}
                </span>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-1 flex-col overflow-hidden bg-background">
          <header className="flex h-14 items-center justify-between border-b border-border px-4 bg-surface-raised/80 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              {breadcrumbs.length > 0 && (
                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbs.map((crumb, index) => {
                      const isLast = index === breadcrumbs.length - 1;
                      return (
                        <React.Fragment key={index}>
                          <BreadcrumbItem>
                            {isLast ? (
                              <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                            ) : (
                              <BreadcrumbLink href={crumb.href}>
                                {crumb.label}
                              </BreadcrumbLink>
                            )}
                          </BreadcrumbItem>
                          {!isLast && <BreadcrumbSeparator />}
                        </React.Fragment>
                      );
                    })}
                  </BreadcrumbList>
                </Breadcrumb>
              )}
            </div>

            <div className="flex items-center gap-2">
              {onSearchClick && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSearchClick}
                  className="gap-2 text-xs text-muted-foreground h-8 border-border hover:border-ring"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>Search...</span>
                </Button>
              )}
              {onNotificationsClick && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onNotificationsClick}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  aria-label="Notifications"
                >
                  <Bell className="h-4 w-4" />
                </Button>
              )}
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-6 bg-background">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
