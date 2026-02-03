import DashboardLayout from "@/components/DashboardLayout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MoreHorizontal, Plus, Search, Shield } from "lucide-react";
import { toast } from "sonner";

// Mock data
const members = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@babymori.com",
    role: "Admin",
    department: "Finance Operations",
    status: "active" as const,
    lastActive: "Just now",
    initials: "SC",
  },
  {
    id: "2",
    name: "James Wong",
    email: "james.wong@babymori.com",
    role: "Member",
    department: "Finance",
    status: "active" as const,
    lastActive: "2h ago",
    initials: "JW",
  },
  {
    id: "3",
    name: "Emily Roberts",
    email: "emily.roberts@babymori.com",
    role: "Member",
    department: "Legal",
    status: "active" as const,
    lastActive: "1d ago",
    initials: "ER",
  },
  {
    id: "4",
    name: "Michael Torres",
    email: "michael.torres@babymori.com",
    role: "Viewer",
    department: "Procurement",
    status: "pending" as const,
    lastActive: "Invited",
    initials: "MT",
  },
];

const roles = [
  {
    name: "Admin",
    description: "Full access to all features and settings",
    permissions: ["Manage workers", "Approve all", "Manage team", "Settings"],
  },
  {
    name: "Member",
    description: "Can review and approve within their limits",
    permissions: ["View workers", "Approve (limited)", "View activity"],
  },
  {
    name: "Viewer",
    description: "Read-only access to dashboards and reports",
    permissions: ["View workers", "View activity"],
  },
];

function MemberRow({ member }: { member: (typeof members)[0] }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-border last:border-0">
      <Avatar className="w-10 h-10">
        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
          {member.initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">{member.name}</p>
          {member.status === "pending" && (
            <Badge variant="outline" className="text-xs">
              Pending
            </Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground">{member.email}</p>
      </div>
      <div className="w-32">
        <p className="text-sm text-muted-foreground">{member.department}</p>
      </div>
      <div className="w-24">
        <Badge
          variant="outline"
          className={cn(
            "text-xs",
            member.role === "Admin" && "text-primary border-primary/30"
          )}
        >
          {member.role}
        </Badge>
      </div>
      <div className="w-24 text-right">
        <p className="text-xs text-muted-foreground">{member.lastActive}</p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Edit role</DropdownMenuItem>
          <DropdownMenuItem>View activity</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function TeamMembers() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Team Members
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage who has access to your Milo workspace.
            </p>
          </div>
          <Button className="gap-2" onClick={() => toast.info("Feature coming soon")}>
            <Plus className="w-4 h-4" />
            Invite Member
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members list */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-base font-medium">
                  Members ({members.length})
                </CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search members..." className="pl-9" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Header row */}
                <div className="flex items-center gap-4 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground border-b border-border">
                  <div className="w-10" />
                  <div className="flex-1">Name</div>
                  <div className="w-32">Department</div>
                  <div className="w-24">Role</div>
                  <div className="w-24 text-right">Last Active</div>
                  <div className="w-8" />
                </div>
                {members.map((member) => (
                  <MemberRow key={member.id} member={member} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Roles sidebar */}
          <div>
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-base font-medium">Roles</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {roles.map((role) => (
                  <div
                    key={role.name}
                    className="p-3 border border-border rounded-lg"
                  >
                    <p className="text-sm font-medium">{role.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {role.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {role.permissions.map((perm) => (
                        <Badge
                          key={perm}
                          variant="secondary"
                          className="text-xs"
                        >
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" onClick={() => toast.info("Feature coming soon")}>
                  Manage Roles
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
