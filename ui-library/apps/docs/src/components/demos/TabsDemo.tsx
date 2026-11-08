import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, Card, CardHeader, CardTitle, CardDescription, CardContent, Input, Label, Button } from "@usalyt/ui";

export function TabsDemo() {
  return (
    <Tabs defaultValue="account" className="w-[400px]">
      <TabsList className="w-full">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Make changes to your account settings here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name-tab">Name</Label>
              <Input id="name-tab" defaultValue="Pedro Duarte" />
            </div>
            <Button className="mt-2">Save changes</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Change your password here after verification.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="current">Current password</Label>
              <Input id="current" type="password" />
            </div>
            <Button className="mt-2">Update password</Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
