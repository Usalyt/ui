import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineIcon,
  TimelineContent,
  TimelineTitle,
  TimelineDescription,
  TimelineTime,
} from "./timeline";

describe("Timeline Primitive Component", () => {
  it("renders chronological items with icon, title and description", () => {
    render(
      <Timeline>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon>1</TimelineIcon>
            <TimelineTitle>Evaluation Started</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>
            <TimelineDescription>Nielsen evaluation initiated.</TimelineDescription>
            <TimelineTime>10:00 AM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    );

    expect(screen.getByRole("list", { name: "timeline" })).toBeInTheDocument();
    expect(screen.getByText("Evaluation Started")).toBeInTheDocument();
    expect(screen.getByText("Nielsen evaluation initiated.")).toBeInTheDocument();
    expect(screen.getByText("10:00 AM")).toBeInTheDocument();
  });
});
