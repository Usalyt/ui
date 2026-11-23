import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "./hover-card";
import { Calendar } from "lucide-react";

const meta: Meta<typeof HoverCard> = {
  title: "Primitives/HoverCard",
  component: HoverCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex justify-center p-12">
      <HoverCard>
        <HoverCardTrigger className="cursor-pointer text-foreground underline decoration-border underline-offset-4 hover:decoration-fog">
          @nextjs
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-w510 text-foreground">
              NJ
            </div>
            <div className="min-w-0 space-y-1.5">
              <h4 className="text-body-sm font-w510 text-foreground">
                @nextjs
              </h4>
              <p className="text-caption leading-body-sm text-muted-foreground">
                The React Framework for the Web – created and maintained by
                Vercel.
              </p>
              <div className="flex items-center gap-1.5 pt-1">
                <Calendar className="h-3.5 w-3.5 text-fog" aria-hidden="true" />
                <span className="text-label text-muted-foreground">
                  Joined December 2021
                </span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

export const UserProfileCard: Story = {
  render: () => (
    <div className="flex justify-center p-12">
      <HoverCard>
        <HoverCardTrigger className="cursor-pointer text-body-sm font-w510 text-foreground underline decoration-border underline-offset-4 hover:decoration-fog">
          Evaluator Profile
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-1.5">
            <h4 className="text-body-sm font-w510 text-foreground">
              Nielsen Heuristic Lead
            </h4>
            <p className="text-caption leading-body-sm text-muted-foreground">
              Senior UX Architect leading automated accessibility &amp;
              heuristic audits across client projects.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};
