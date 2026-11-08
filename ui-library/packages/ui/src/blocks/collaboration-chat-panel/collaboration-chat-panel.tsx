"use client";

import * as React from "react";
import { Send, Paperclip, MessageSquare } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { Button } from "../../components/button";
import { Input } from "../../components/input";

export interface ChatMessage {
  id: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: string;
  isCurrentUser?: boolean;
  attachedFindingId?: string;
}

export interface CollaborationChatPanelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  projectName?: string;
  onlineCount?: number;
  messages?: ChatMessage[];
  typingUsers?: string[];
  onSendMessage?: (content: string) => void;
  onFindingClick?: (findingId: string) => void;
}

export function CollaborationChatPanel({
  projectName = "Checkout Flow Audit",
  onlineCount = 3,
  messages = [],
  typingUsers = [],
  onSendMessage,
  onFindingClick,
  className,
  ...props
}: CollaborationChatPanelProps) {
  const [text, setText] = React.useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSendMessage?.(text.trim());
    setText("");
  };

  return (
    <Card
      className={cn(
        "flex flex-col h-[520px] border border-border bg-card shadow-xs overflow-hidden",
        className
      )}
      {...props}
    >
      <CardHeader className="flex flex-row items-center justify-between py-3 px-4 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <CardTitle className="text-sm font-semibold text-foreground">{projectName}</CardTitle>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-pulse-green animate-pulse" />
          <span>{onlineCount} online</span>
        </div>
      </CardHeader>

      <CardContent
        role="log"
        aria-label="Project chat messages"
        aria-live="polite"
        aria-relevant="additions"
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No messages yet. Start the discussion!
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3",
                msg.isCurrentUser ? "flex-row-reverse" : "flex-row"
              )}
            >
              <Avatar className="h-7 w-7 mt-0.5">
                {msg.senderAvatar && (
                  <AvatarImage src={msg.senderAvatar} alt={msg.senderName} />
                )}
                <AvatarFallback>
                  {msg.senderName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div
                className={cn(
                  "flex flex-col max-w-[75%]",
                  msg.isCurrentUser ? "items-end" : "items-start"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-foreground">
                    {msg.senderName}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {msg.timestamp}
                  </span>
                </div>

                <div
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm leading-relaxed border border-border",
                    msg.isCurrentUser
                      ? "bg-secondary text-secondary-foreground rounded-tr-xs"
                      : "bg-muted text-foreground rounded-tl-xs"
                  )}
                >
                  <p>{msg.content}</p>

                  {msg.attachedFindingId && (
                    <button
                      type="button"
                      onClick={() => onFindingClick?.(msg.attachedFindingId!)}
                      className="mt-1.5 flex items-center gap-1 rounded-md border border-border bg-background px-2 py-0.5 text-xs font-mono font-medium text-primary transition-colors hover:bg-accent cursor-pointer"
                    >
                      <Paperclip className="h-3 w-3" />
                      <span>{msg.attachedFindingId}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>

      {typingUsers.length > 0 && (
        <div
          role="status"
          aria-live="polite"
          className="px-4 py-1 text-[11px] text-muted-foreground italic bg-muted/10 border-t border-border/20"
        >
          {typingUsers.join(", ")}{" "}
          {typingUsers.length === 1 ? "is typing..." : "are typing..."}
        </div>
      )}

      <CardFooter className="p-3 border-t border-border/40 bg-background">
        <form onSubmit={handleSend} className="flex w-full items-center gap-2">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Message"
            name="message"
            placeholder="Type a message or mention @teammate..."
            className="flex-1 text-sm h-9"
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 shrink-0"
            aria-label="Send message"
            disabled={!text.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
