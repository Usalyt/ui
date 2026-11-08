import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button, Input, Label } from "@usalyt/ui";

export function CardDemo() {
  return (
    <div className="flex flex-wrap gap-6 items-start justify-center w-full">
      <Card className="w-[320px]">
        <CardHeader>
          <CardTitle>Create Project</CardTitle>
          <CardDescription>Deploy your new project in one click.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name of your project" />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Cancel</Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>

      <Card className="w-[320px]">
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>You have 3 unread messages.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Your monthly billing statement is ready for review.</p>
          <Card variant="subtle" className="p-3">
            <p className="text-xs text-bone">Subtle Inset Card — nested inside carbon card</p>
          </Card>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="secondary">Mark all as read</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
