import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  CollaborationChatPanel,
  type ChatMessage,
} from "./collaboration-chat-panel";

const sampleMessages: ChatMessage[] = [
  {
    id: "m-1",
    senderName: "Carlos Dev",
    content: "Found an issue with error prevention on payment.",
    timestamp: "10:30 AM",
    attachedFindingId: "H5-02",
  },
  {
    id: "m-2",
    senderName: "Ana Evaluator",
    content: "Confirmed, adding to the report now.",
    timestamp: "10:32 AM",
    isCurrentUser: true,
  },
];

describe("CollaborationChatPanel Block", () => {
  it("renders messages, sender names, and attached findings", () => {
    render(
      <CollaborationChatPanel
        projectName="Checkout Evaluation"
        onlineCount={4}
        messages={sampleMessages}
      />
    );

    expect(screen.getByText("Checkout Evaluation")).toBeInTheDocument();
    expect(screen.getByText("4 online")).toBeInTheDocument();
    expect(screen.getByText("Carlos Dev")).toBeInTheDocument();
    expect(
      screen.getByText("Found an issue with error prevention on payment.")
    ).toBeInTheDocument();
    expect(screen.getByText("H5-02")).toBeInTheDocument();
    expect(
      screen.getByText("Confirmed, adding to the report now.")
    ).toBeInTheDocument();
  });

  it("submits message on send", async () => {
    const user = userEvent.setup();
    const handleSend = vi.fn();

    render(<CollaborationChatPanel onSendMessage={handleSend} />);

    const input = screen.getByPlaceholderText(/type a message/i);
    await user.type(input, "Checking the contrast ratio now");

    const sendBtn = screen.getByRole("button", { name: /send message/i });
    await user.click(sendBtn);

    expect(handleSend).toHaveBeenCalledWith("Checking the contrast ratio now");
  });

  it("names the composer and disables sending without content", async () => {
    const user = userEvent.setup();
    render(<CollaborationChatPanel />);

    const input = screen.getByRole("textbox", { name: /message/i });
    const sendBtn = screen.getByRole("button", { name: /send message/i });

    expect(sendBtn).toBeDisabled();

    await user.type(input, "Hello team");
    expect(sendBtn).not.toBeDisabled();
  });

  it("announces the message log and typing status", () => {
    render(
      <CollaborationChatPanel
        messages={sampleMessages}
        typingUsers={["Sofia"]}
      />
    );

    expect(
      screen.getByRole("log", { name: /project chat messages/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent(/sofia is typing/i);
  });

  it("keeps outgoing messages on a restrained surface instead of the primary accent", () => {
    render(<CollaborationChatPanel messages={sampleMessages} />);

    const outgoing = screen.getByText(
      "Confirmed, adding to the report now."
    ).parentElement as HTMLElement;

    expect(outgoing.className).not.toContain("bg-primary");
    expect(outgoing.className).toContain("bg-secondary");
  });
});
