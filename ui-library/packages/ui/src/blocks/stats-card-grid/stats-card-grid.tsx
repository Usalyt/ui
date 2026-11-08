"use client";

import * as React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/card";
import { Badge } from "../../components/badge";
import { cn } from "../../lib/utils";

export interface StatItem {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  description?: string;
  icon?: React.ReactNode;
}

export interface StatsCardGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function StatsCardGrid({
  stats,
  columns = 3,
  className,
}: StatsCardGridProps) {
  const gridColsClass =
    columns === 2
      ? "grid-cols-1 md:grid-cols-2"
      : columns === 4
        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        : "grid-cols-1 md:grid-cols-3";

  if (stats.length === 0) {
    return (
      <div
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/10 p-8 text-center",
          className
        )}
      >
        <p className="text-sm font-medium text-foreground">
          No metrics available
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Stats will appear once evaluation activity is recorded.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4 w-full", gridColsClass, className)}>
      {stats.map((stat) => (
        <Card key={stat.id} className="relative overflow-hidden border-border shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground">
              {stat.title}
            </CardTitle>
            {stat.icon && (
              <div className="text-muted-foreground h-4 w-4 shrink-0">
                {stat.icon}
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="text-2xl font-bold tracking-tight text-foreground font-mono">
              {stat.value}
            </div>
            {(stat.change || stat.description) && (
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                {stat.change && (
                  <Badge
                    variant={
                      stat.trend === "up"
                        ? "default"
                        : stat.trend === "down"
                          ? "destructive"
                          : "secondary"
                    }
                    className="text-label px-1.5 py-0.5 font-mono"
                  >
                    {stat.change}
                  </Badge>
                )}
                {stat.description && <span>{stat.description}</span>}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
