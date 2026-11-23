import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
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

const meta: Meta<typeof Timeline> = {
  title: "Primitives/Timeline",
  component: Timeline,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-md p-4">
      <Timeline>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon>1</TimelineIcon>
            <TimelineTitle>Evaluation Created</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>
            <TimelineDescription>Initiated heuristic evaluation for checkout flow.</TimelineDescription>
            <TimelineTime>09:30 AM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon>2</TimelineIcon>
            <TimelineTitle>Element Inspected</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>
            <TimelineDescription>Captured submit button with missing focus indicators.</TimelineDescription>
            <TimelineTime>10:15 AM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineHeader>
            <TimelineIcon>3</TimelineIcon>
            <TimelineTitle>Report Exported</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>
            <TimelineDescription>Generated PDF report with 5 findings.</TimelineDescription>
            <TimelineTime>11:00 AM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <div className="w-full max-w-3xl p-4">
      <Timeline orientation="horizontal">
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon>1</TimelineIcon>
            <TimelineTitle>Evaluation Created</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>
            <TimelineDescription>Initiated heuristic evaluation for checkout flow.</TimelineDescription>
            <TimelineTime>09:30 AM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineConnector />
          <TimelineHeader>
            <TimelineIcon>2</TimelineIcon>
            <TimelineTitle>Element Inspected</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>
            <TimelineDescription>Captured submit button with missing focus indicators.</TimelineDescription>
            <TimelineTime>10:15 AM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem>
          <TimelineHeader>
            <TimelineIcon>3</TimelineIcon>
            <TimelineTitle>Report Exported</TimelineTitle>
          </TimelineHeader>
          <TimelineContent>
            <TimelineDescription>Generated PDF report with 5 findings.</TimelineDescription>
            <TimelineTime>11:00 AM</TimelineTime>
          </TimelineContent>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};
