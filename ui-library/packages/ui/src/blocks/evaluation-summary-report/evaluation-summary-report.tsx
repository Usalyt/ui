"use client";

import * as React from "react";
import {
  Download,
  Share2,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
} from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/card";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import { Progress } from "../../components/progress";

export interface HeuristicScoreItem {
  id: string;
  name: string;
  score: number;
  findingCount: number;
}

export interface EvaluationSummaryReportProps
  extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  projectName?: string;
  overallScore?: number;
  criticalCount?: number;
  mediumCount?: number;
  goodCount?: number;
  heuristics?: HeuristicScoreItem[];
  onExportPdf?: () => void;
  onShareReport?: () => void;
}

export function EvaluationSummaryReport({
  title = "Heuristic Evaluation Executive Report",
  projectName = "UX Check Project",
  overallScore = 82,
  criticalCount = 3,
  mediumCount = 7,
  goodCount = 14,
  heuristics = [],
  onExportPdf,
  onShareReport,
  className,
  ...props
}: EvaluationSummaryReportProps) {
  const totalFindings = criticalCount + mediumCount + goodCount;

  return (
    <Card
      className={cn("overflow-hidden border border-border shadow-xs", className)}
      {...props}
    >
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3 space-y-0 pb-4 border-b border-border/40">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Badge variant="outline" className="self-start text-xs">
            Executive Summary
          </Badge>
          <CardTitle className="text-lg font-bold text-foreground">
            {title}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {projectName}
          </CardDescription>
        </div>

        <div className="flex max-w-full flex-wrap items-center gap-2">
          {onShareReport && (
            <Button
              variant="outline"
              size="sm"
              onClick={onShareReport}
              className="gap-1.5 text-xs"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share</span>
            </Button>
          )}
          {onExportPdf && (
            <Button size="sm" onClick={onExportPdf} className="gap-1.5 text-xs">
              <Download className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6 pt-6">
        <div
          role="group"
          aria-label="Evaluation score summary"
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/20 p-4">
            <div className="flex min-h-8 items-start">
              <span className="text-xs font-medium text-muted-foreground">
                Overall Usability
              </span>
            </div>
            <div className="flex flex-wrap items-baseline gap-2 leading-none">
              <span className="text-3xl font-extrabold leading-none text-foreground">
                {overallScore}
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
            <Progress value={overallScore} variant="neutral" aria-label="Overall Usability Score" className="h-1.5" />
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
            <div className="flex min-h-8 items-start gap-1.5 text-xs font-medium text-coral-red-foreground">
              <AlertOctagon className="h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0">Critical Issues</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-2 leading-none">
              <span className="text-3xl font-extrabold leading-none text-foreground">
                {criticalCount}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Requires immediate fix
            </span>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-signal-teal/30 bg-signal-teal/5 p-4">
            <div className="flex min-h-8 items-start gap-1.5 text-xs font-medium text-signal-teal-foreground">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0">Medium Issues</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-2 leading-none">
              <span className="text-3xl font-extrabold leading-none text-foreground">
                {mediumCount}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Impacts efficiency
            </span>
          </div>

          <div className="flex flex-col gap-2 rounded-lg border border-pulse-green/30 bg-pulse-green/5 p-4">
            <div className="flex min-h-8 items-start gap-1.5 text-xs font-medium text-pulse-green-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span className="min-w-0">Positive Points</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-2 leading-none">
              <span className="text-3xl font-extrabold leading-none text-foreground">
                {goodCount}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Follows best practices
            </span>
          </div>
        </div>

        {heuristics.length > 0 && (
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Nielsen's 10 Heuristics Performance
            </h4>
            <div className="flex flex-col gap-3">
              {heuristics.map((item) => (
                <div key={item.id} className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-start justify-between gap-2 text-xs">
                    <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] px-1.5 py-0"
                      >
                        {item.id}
                      </Badge>
                      <span className="min-w-0 break-words font-medium text-foreground">
                        {item.name}
                      </span>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="text-muted-foreground">
                        {item.findingCount} findings
                      </span>
                      <span className="w-10 text-right font-bold text-foreground">
                        {item.score}%
                      </span>
                    </div>
                  </div>
                  <Progress value={item.score} variant="neutral" aria-label={`${item.name} score`} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 py-3 text-xs text-muted-foreground">
        <span>Total Findings Audited: {totalFindings}</span>
        <span>Generated with UX Check</span>
      </CardFooter>
    </Card>
  );
}
