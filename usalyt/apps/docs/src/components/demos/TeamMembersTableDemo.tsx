import React from "react";
import { TeamMembersTable, type TeamMember } from "@usalyt/ui";

const initialMembers: TeamMember[] = [
  {
    id: "usr-01",
    name: "Sara Gómez",
    email: "sara@example.com",
    role: "owner",
    joinedAt: "12 May 2026",
  },
  {
    id: "usr-02",
    name: "Carlos Rivera",
    email: "carlos@example.com",
    role: "moderator",
    joinedAt: "18 May 2026",
  },
  {
    id: "usr-03",
    name: "Mateo Ortiz",
    email: "mateo@example.com",
    role: "evaluator",
    joinedAt: "25 Jun 2026",
  },
];

export function TeamMembersTableDemo() {
  const [members, setMembers] = React.useState<TeamMember[]>(initialMembers);
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl space-y-2">
      <TeamMembersTable
        members={members}
        onRoleChange={(memberId, newRole) => {
          setMembers((prev) =>
            prev.map((member) => (member.id === memberId ? { ...member, role: newRole } : member))
          );
          setLastAction(`Role updated to ${newRole}`);
        }}
        onRemoveMember={(memberId) => {
          setMembers((prev) => prev.filter((member) => member.id !== memberId));
          setLastAction("Member removed from the project");
        }}
        onInviteMember={() => setLastAction("Invite link copied to clipboard")}
      />
      {lastAction && (
        <p className="text-center text-xs text-muted-foreground" role="status">
          {lastAction}
        </p>
      )}
    </div>
  );
}
