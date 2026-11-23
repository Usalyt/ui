"use client";

import * as React from "react";
import { UserPlus, Trash2 } from "lucide-react";
import { cn } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/avatar";
import { Badge } from "../../components/badge";
import { Button } from "../../components/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "../../components/table";

export type ProjectRole = "owner" | "moderator" | "evaluator" | "viewer";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: ProjectRole;
  avatarUrl?: string;
  joinedAt?: string;
}

export interface TeamMembersTableProps
  extends React.HTMLAttributes<HTMLDivElement> {
  members?: TeamMember[];
  onRoleChange?: (memberId: string, newRole: ProjectRole) => void;
  onRemoveMember?: (memberId: string) => void;
  onInviteMember?: () => void;
}

export function TeamMembersTable({
  members = [],
  onRoleChange,
  onRemoveMember,
  onInviteMember,
  className,
  ...props
}: TeamMembersTableProps) {
  return (
    <Card
      className={cn(
        "w-full min-w-0 border border-border shadow-xs overflow-hidden",
        className
      )}
      {...props}
    >
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/40">
        <div className="min-w-0">
          <CardTitle className="text-base font-semibold">
            Project Team Members
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Manage who has access and evaluate permissions in this project.
          </CardDescription>
        </div>

        {onInviteMember && (
          <Button
            size="sm"
            onClick={onInviteMember}
            className="gap-1.5 text-xs"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Invite Member</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-0">
        <Table aria-label="Project team members">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Member</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-xs text-muted-foreground py-8"
                >
                  No members found in this project.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {member.avatarUrl && (
                          <AvatarImage src={member.avatarUrl} alt={member.name} />
                        )}
                        <AvatarFallback>
                          {member.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">
                          {member.name}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    {member.role === "owner" ? (
                      <Badge
                        variant="default"
                        className="text-[11px] capitalize font-medium"
                      >
                        Owner
                      </Badge>
                    ) : (
                      <select
                        aria-label={`Change role for ${member.name}`}
                        value={member.role}
                        onChange={(e) =>
                          onRoleChange?.(
                            member.id,
                            e.target.value as ProjectRole
                          )
                        }
                        className="rounded-md border border-border bg-popover text-popover-foreground px-2.5 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="moderator">Moderator</option>
                        <option value="evaluator">Evaluator</option>
                        <option value="viewer">Viewer</option>
                      </select>
                    )}
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground font-mono">
                    {member.joinedAt ?? "Active"}
                  </TableCell>

                  <TableCell className="text-right">
                    {member.role !== "owner" && onRemoveMember && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveMember(member.id)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        aria-label={`Remove ${member.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
