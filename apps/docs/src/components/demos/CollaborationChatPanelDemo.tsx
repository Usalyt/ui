import React from "react";
import { CollaborationChatPanel, type ChatMessage } from "@usalyt/ui";

const initialMessages: ChatMessage[] = [
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
];

export function CollaborationChatPanelDemo() {
  const [messages, setMessages] = React.useState<ChatMessage[]>(initialMessages);
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  const handleSend = (content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${prev.length + 1}`,
        senderName: "You",
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isCurrentUser: true,
      },
    ]);
  };

  return (
    <div className="w-full max-w-md space-y-2">
      <CollaborationChatPanel
        projectName="Checkout Heuristic Audit #4"
        onlineCount={3}
        messages={messages}
        typingUsers={["Sophia"]}
        onSendMessage={handleSend}
        onFindingClick={(findingId) => setLastAction(`Opened finding ${findingId}`)}
      />
      {lastAction && (
        <p className="text-center text-xs text-muted-foreground" role="status">
          {lastAction}
        </p>
      )}
    </div>
  );
}
