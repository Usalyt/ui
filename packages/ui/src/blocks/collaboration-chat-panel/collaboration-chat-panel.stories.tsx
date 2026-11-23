import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollaborationChatPanel } from "./collaboration-chat-panel";

const meta: Meta<typeof CollaborationChatPanel> = {
  title: "Blocks/CollaborationChatPanel",
  component: CollaborationChatPanel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    projectName: "Checkout Heuristic Audit #4",
    onlineCount: 3,
    typingUsers: ["Sophia"],
    messages: [
      {
        id: "msg-1",
        senderName: "Marcos Lead",
        content: "Please review the checkout button contrast before tomorrow's release.",
        timestamp: "11:20 AM",
        attachedFindingId: "H1-03",
      },
      {
        id: "msg-2",
        senderName: "You",
        content: "On it! Capturing the DOM state and adding screenshots.",
        timestamp: "11:22 AM",
        isCurrentUser: true,
      },
    ],
    className: "max-w-md mx-auto",
  },
};

export const EmptyConversation: Story = {
  args: {
    messages: [],
    onlineCount: 1,
    className: "max-w-md mx-auto"
  }
};
