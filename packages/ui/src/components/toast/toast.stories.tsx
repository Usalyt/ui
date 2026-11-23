import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  ToastProvider,
  Toast,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastPortal,
  ToastViewport,
  useToastManager,
} from "./toast";
import { Button } from "../button";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";

const meta: Meta<typeof Toast> = {
  title: "Primitives/Toast",
  component: Toast,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "success", "destructive", "warning", "info"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

type ToastVariant = "default" | "success" | "destructive" | "warning" | "info";

const storyContent: Record<
  ToastVariant,
  { title: string; description: string; icon?: React.ReactNode }
> = {
  default: {
    title: "Notification Received",
    description: "You have 3 unread messages in your inbox.",
  },
  success: {
    title: "Deployment Successful",
    description: "Version 2.4 deployed to production server.",
    icon: <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-pulse-green-foreground" />,
  },
  destructive: {
    title: "Connection Error",
    description: "Failed to connect to database. Retrying in 5s...",
    icon: <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />,
  },
  warning: {
    title: "Storage Limit Reached",
    description: "Your workspace is at 95% capacity. Upgrade plan soon.",
    icon: <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-signal-teal-foreground" />,
  },
  info: {
    title: "Heads Up",
    description: "A new version of the design system is available.",
    icon: <Info className="mt-0.5 h-5 w-5 shrink-0 text-iris-violet-foreground" />,
  },
};

function ToastList({ variant }: { variant: ToastVariant }) {
  const { toasts, close } = useToastManager();
  const content = storyContent[variant];

  return toasts.map((toast) => (
    <Toast key={toast.id} toast={toast} variant={variant}>
      <div className="flex items-start gap-3">
        {content.icon}
        <ToastContent>
          <ToastTitle>{toast.title ?? content.title}</ToastTitle>
          <ToastDescription>{toast.description ?? content.description}</ToastDescription>
        </ToastContent>
      </div>
      <ToastClose onClick={() => close(toast.id)} />
    </Toast>
  ));
}

function storyContentFor(variant: ToastVariant) {
  return storyContent[variant];
}

function ToastDemo({ variant }: { variant: ToastVariant }) {
  const { add } = useToastManager();
  const seeded = React.useRef(false);

  // Seed one real toast so the story always renders the mounted surface.
  React.useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const content = storyContentFor(variant);
    add({ title: content.title, description: content.description, timeout: 0 });
  }, [add, variant]);

  return (
    <div className="flex flex-col items-start gap-4">
      <Button
        onClick={() => {
          const content = storyContentFor(variant);
          add({ title: content.title, description: content.description, timeout: 0 });
        }}
      >
        Add toast
      </Button>
      <ToastPortal>
        <ToastViewport>
          <ToastList variant={variant} />
        </ToastViewport>
      </ToastPortal>
    </div>
  );
}

export const Default: Story = {
  args: {
    variant: "default",
  },
  render: (args) => (
    <ToastProvider timeout={0}>
      <ToastDemo variant={args.variant ?? "default"} />
    </ToastProvider>
  ),
};

export const SuccessToast: Story = {
  args: {
    variant: "success",
  },
  render: (args) => (
    <ToastProvider timeout={0}>
      <ToastDemo variant={(args.variant as ToastVariant) ?? "success"} />
    </ToastProvider>
  ),
};

export const DestructiveToast: Story = {
  args: {
    variant: "destructive",
  },
  render: (args) => (
    <ToastProvider timeout={0}>
      <ToastDemo variant={(args.variant as ToastVariant) ?? "destructive"} />
    </ToastProvider>
  ),
};

export const WarningToast: Story = {
  args: {
    variant: "warning",
  },
  render: (args) => (
    <ToastProvider timeout={0}>
      <ToastDemo variant={(args.variant as ToastVariant) ?? "warning"} />
    </ToastProvider>
  ),
};

export const InfoToast: Story = {
  args: {
    variant: "info",
  },
  render: (args) => (
    <ToastProvider timeout={0}>
      <ToastDemo variant={(args.variant as ToastVariant) ?? "info"} />
    </ToastProvider>
  ),
};
