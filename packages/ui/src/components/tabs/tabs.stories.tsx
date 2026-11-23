import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { User, Key, Bell, Shield } from "lucide-react";

const meta: Meta<typeof Tabs> = {
  title: "Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Tabs defaultValue="account">
        <TabsList className="w-full">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent
          value="account"
          className="p-4 border rounded-lg mt-3 space-y-1"
        >
          <h4 className="text-sm font-semibold">Account Settings</h4>
          <p className="text-xs text-muted-foreground">
            Manage your account credentials and profile details.
          </p>
        </TabsContent>
        <TabsContent
          value="password"
          className="p-4 border rounded-lg mt-3 space-y-1"
        >
          <h4 className="text-sm font-semibold">Password & Security</h4>
          <p className="text-xs text-muted-foreground">
            Change your password and enable 2-factor authentication.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Tabs defaultValue="profile">
        <TabsList className="w-full">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-3.5 w-3.5" /> Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-3.5 w-3.5" /> Alerts
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-3.5 w-3.5" /> Security
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="p-4 border rounded-lg mt-3">
          <p className="text-sm">Personal details and public handle.</p>
        </TabsContent>
        <TabsContent value="notifications" className="p-4 border rounded-lg mt-3">
          <p className="text-sm font-medium">Notification channels & digests.</p>
        </TabsContent>
        <TabsContent value="security" className="p-4 border rounded-lg mt-3">
          <p className="text-sm font-medium">Active sessions and API keys.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <div className="w-full max-w-md">
      <Tabs defaultValue="general">
        <TabsList className="w-full">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="enterprise" disabled>
            Enterprise (Locked)
          </TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="p-4 border rounded-lg mt-3">
          <p className="text-sm">General workspace preferences.</p>
        </TabsContent>
        <TabsContent value="billing" className="p-4 border rounded-lg mt-3">
          <p className="text-sm">Invoices and payment methods.</p>
        </TabsContent>
      </Tabs>
    </div>
  ),
};
