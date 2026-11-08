import React from "react";
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
} from "@usalyt/ui";
import { Play, ClipboardList, FileDown } from "lucide-react";

const entries = [
  {
    icon: Play,
    title: "Kickoff review",
    time: "09:00",
    description: "Scopes set for the checkout flow.",
  },
  {
    icon: ClipboardList,
    title: "Findings logged",
    time: "11:30",
    description: "12 findings across five heuristics.",
  },
  {
    icon: FileDown,
    title: "Report exported",
    time: "17:45",
    description: "Delivered to the team.",
  },
];

export function TimelineDemo() {
  return (
    <Timeline className="w-full max-w-sm">
      {entries.map((entry, i) => (
        <TimelineItem key={entry.title}>
          {i < entries.length - 1 && <TimelineConnector />}
          <TimelineHeader>
            <TimelineIcon>
              <entry.icon className="h-4 w-4" />
            </TimelineIcon>
            <TimelineContent>
              <TimelineTitle>{entry.title}</TimelineTitle>
              <TimelineDescription>{entry.description}</TimelineDescription>
            </TimelineContent>
            <TimelineTime>{entry.time}</TimelineTime>
          </TimelineHeader>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
