import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ImageAvatar: Story = {
  args: {
    size: "md",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarImage
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        alt="Sarah Connor"
      />
      <AvatarFallback>SC</AvatarFallback>
    </Avatar>
  ),
};

export const Default: Story = ImageAvatar;

export const InitialsFallback: Story = {
  args: {
    size: "md",
  },
  render: (args) => (
    <Avatar {...args}>
      <AvatarFallback>AR</AvatarFallback>
    </Avatar>
  ),
};

export const CustomSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Avatar size="sm">
        <AvatarFallback>SM</AvatarFallback>
      </Avatar>
      <Avatar size="md">
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>LG</AvatarFallback>
      </Avatar>
      <Avatar size="xl">
        <AvatarFallback>XL</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const AvatarGroup: Story = {
  render: () => (
    <div className="flex -space-x-3 items-center">
      <Avatar size="md" className="border-2 border-background">
        <AvatarImage
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
          alt="User 1"
        />
        <AvatarFallback>U1</AvatarFallback>
      </Avatar>
      <Avatar size="md" className="border-2 border-background">
        <AvatarImage
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
          alt="User 2"
        />
        <AvatarFallback>U2</AvatarFallback>
      </Avatar>
      <Avatar size="md" className="border-2 border-background">
        <AvatarImage
          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150"
          alt="User 3"
        />
        <AvatarFallback>U3</AvatarFallback>
      </Avatar>
      <Avatar size="md" className="border-2 border-background">
        <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
          +5
        </AvatarFallback>
      </Avatar>
    </div>
  ),
};
