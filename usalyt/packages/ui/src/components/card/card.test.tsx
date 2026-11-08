import React, { createRef } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
import { Button } from "../button";

describe("Card Component", () => {
  it("renders card sections correctly", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>You have 3 unread messages.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content Body</p>
        </CardContent>
        <CardFooter>
          <Button>Mark all as read</Button>
        </CardFooter>
      </Card>
    );

    expect(screen.getByText("Notifications")).toBeInTheDocument();
    expect(
      screen.getByText("You have 3 unread messages.")
    ).toBeInTheDocument();
    expect(screen.getByText("Card Content Body")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /mark all as read/i })
    ).toBeInTheDocument();
  });

  it("applies custom className to Card root", () => {
    const { container } = render(
      <Card className="my-custom-card shadow-lg bg-primary">
        <CardContent>Body</CardContent>
      </Card>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("my-custom-card");
    expect(card).toHaveClass("shadow-lg");
    expect(card).toHaveClass("bg-primary");
  });

  it("applies subtle variant classes", () => {
    const { container } = render(
      <Card variant="subtle">
        <CardContent>Subtle Content</CardContent>
      </Card>
    );

    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass("rounded-md");
    expect(card).toHaveClass("bg-field");
  });

  it("forwards ref to Card and sub-components", () => {
    const cardRef = createRef<HTMLDivElement>();
    const titleRef = createRef<HTMLHeadingElement>();
    render(
      <Card ref={cardRef}>
        <CardHeader>
          <CardTitle ref={titleRef}>Ref Title</CardTitle>
        </CardHeader>
      </Card>
    );

    expect(cardRef.current).toBeInstanceOf(HTMLDivElement);
    expect(titleRef.current).toBeInstanceOf(HTMLHeadingElement);
  });

  it("handles click on interactive card container", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Card onClick={onClick} className="cursor-pointer">
        <CardHeader>
          <CardTitle>Clickable Card</CardTitle>
        </CardHeader>
      </Card>
    );

    await user.click(screen.getByText("Clickable Card"));
    expect(onClick).toHaveBeenCalled();
  });

  it("handles button click inside CardFooter without breaking layout", async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    render(
      <Card>
        <CardContent>Content</CardContent>
        <CardFooter>
          <Button onClick={onAction}>Action Button</Button>
        </CardFooter>
      </Card>
    );

    const btn = screen.getByRole("button", { name: "Action Button" });
    await user.click(btn);
    expect(onAction).toHaveBeenCalled();
  });
});
