"use client";

import * as React from "react";
import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "../../components/breadcrumb";
import { Button } from "../../components/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../../components/dropdown-menu";
import { Input } from "../../components/input";
import { cn } from "../../lib/utils";

export interface DashboardHeaderProps {
  title?: string;
  userName?: string;
  userAvatarUrl?: string;
  onSearch?: (query: string) => void;
  actions?: React.ReactNode;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  onProfileSettings?: () => void;
  onTeamManagement?: () => void;
  onLogout?: () => void;
  className?: string;
}

export function DashboardHeader({
  title = "Dashboard",
  userName = "Alex Rivera",
  userAvatarUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
  onSearch,
  actions,
  notificationCount = 0,
  onNotificationsClick,
  onProfileSettings,
  onTeamManagement,
  onLogout,
  className
}: DashboardHeaderProps) {
  return (
    <header className={cn("flex min-h-16 w-full flex-wrap items-center justify-between gap-2 border-b border-border bg-card px-4 py-2 text-foreground sm:h-16 sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-0", className)}>
      <Breadcrumb className="min-w-0 shrink">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="truncate">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="order-2 flex shrink-0 items-center justify-end gap-2 sm:gap-4">
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}

        {onNotificationsClick && (
          <Button
            variant="ghost"
            size="icon"
            aria-label={
              notificationCount > 0
                ? `Notifications (${notificationCount} unread)`
                : "Notifications"
            }
            onClick={onNotificationsClick}
            className="relative h-9 w-9 shrink-0 text-muted-foreground hover:text-foreground"
          >
            <Bell className="h-4 w-4" />
            {notificationCount > 0 && (
              <span
                aria-hidden="true"
                className="absolute right-1.5 top-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-paper px-1 text-[10px] font-w510 leading-none text-void"
              >
                {notificationCount > 9 ? "9+" : notificationCount}
              </span>
            )}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" aria-label={`User menu for ${userName}`} className="h-9 w-9 shrink-0 rounded-full p-0">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={userAvatarUrl} alt={userName} />
                  <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{userName}</DropdownMenuLabel>
              {onProfileSettings && (
                <DropdownMenuItem onClick={onProfileSettings}>
                  Profile Settings
                </DropdownMenuItem>
              )}
              {onTeamManagement && (
                <DropdownMenuItem onClick={onTeamManagement}>
                  Team Management
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            {onLogout && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={onLogout}
                  className="text-coral-red-foreground focus:text-coral-red-foreground"
                >
                  Log out
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative order-3 w-full min-w-0 sm:w-64 sm:flex-none">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          aria-label="Search dashboard"
          placeholder="Search dashboard..."
          onChange={(e) => onSearch?.(e.target.value)}
          className="h-9 pl-9 text-xs border-border placeholder:text-muted-foreground"
        />
      </div>
    </header>
  );
}
