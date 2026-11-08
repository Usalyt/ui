"use client";

import * as React from "react";
import { Trash2, Edit2, ExternalLink, Image as ImageIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/card";
import { Badge } from "../../components/badge";
import { AspectRatio } from "../../components/aspect-ratio";
import { CopyButton } from "../../components/copy-button";
import { Button } from "../../components/button";

export type FindingSeverity = "CRITICAL" | "MEDIUM" | "GOOD";

export interface HeuristicFinding {
  id: string;
  heuristicId: string;
  heuristicTitle: string;
  severity: FindingSeverity;
  rating: number;
  selector: string;
  description: string;
  screenshotUrl?: string;
  createdAt?: string;
  evaluatorName?: string;
}

export interface HeuristicFindingCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  finding: HeuristicFinding;
  onEdit?: (finding: HeuristicFinding) => void;
  onDelete?: (id: string) => void;
  onViewScreenshot?: (finding: HeuristicFinding) => void;
}

export function HeuristicFindingCard({
  finding,
  onEdit,
  onDelete,
  onViewScreenshot,
  className,
  ...props
}: HeuristicFindingCardProps) {
  const getSeverityBadgeVariant = (severity: FindingSeverity) => {
    switch (severity) {
      case "CRITICAL":
        return "coral-red";
      case "MEDIUM":
        return "signal-teal";
      case "GOOD":
        return "pulse-green";
      default:
        return "neutral";
    }
  };

  return (
    <Card
      className={cn("overflow-hidden border border-border bg-card text-card-foreground shadow-xs", className)}
      {...props}
    >
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="neutral" className="font-mono text-xs font-bold border-border">
              {finding.heuristicId}
            </Badge>
            <Badge variant={getSeverityBadgeVariant(finding.severity)}>
              {finding.severity}
            </Badge>
          </div>
          <CardTitle className="break-words text-base font-semibold text-card-foreground">
            {finding.heuristicTitle}
          </CardTitle>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => onEdit(finding)}
              aria-label="Edit finding"
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-coral-red"
              onClick={() => onDelete(finding.id)}
              aria-label="Delete finding"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        {finding.screenshotUrl ? (
          <div className="overflow-hidden rounded-md border border-border bg-muted/40 relative group">
            <AspectRatio ratio={16 / 9}>
              <img
                src={finding.screenshotUrl}
                alt={`Screenshot for finding on ${finding.selector}`}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            </AspectRatio>
            {onViewScreenshot && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 transition-opacity gap-1 text-xs"
                onClick={() => onViewScreenshot(finding)}
              >
                <ExternalLink className="h-3 w-3" />
                <span>Expand</span>
              </Button>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center rounded-md border border-dashed border-border bg-muted/30 py-6 text-muted-foreground text-xs gap-2">
            <ImageIcon className="h-4 w-4" />
            <span>No screenshot captured</span>
          </div>
        )}

        <div className="flex min-w-0 items-center justify-between gap-2 rounded-md border border-border bg-muted/40 px-3 py-1.5 font-mono text-xs">
          <span className="min-w-0 flex-1 truncate text-foreground">
            {finding.selector}
          </span>
          <CopyButton value={finding.selector} className="h-6 w-6 text-muted-foreground" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="min-w-0">Usability Severity Score</span>
            <Badge
              variant={getSeverityBadgeVariant(finding.severity)}
              className="shrink-0 font-mono font-semibold tabular-nums"
              aria-label={`Usability severity score: ${finding.rating} of 5`}
            >
              {finding.rating} / 5
            </Badge>
          </div>
          <p className="break-words text-sm leading-relaxed text-foreground">
            {finding.description}
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
        <span>
          {finding.evaluatorName
            ? `Evaluated by ${finding.evaluatorName}`
            : "Audited element"}
        </span>
        {finding.createdAt && <span>{finding.createdAt}</span>}
      </CardFooter>
    </Card>
  );
}
