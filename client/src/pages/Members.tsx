import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, MoreHorizontal, Mail } from "lucide-react";

/*
 * Members Page
 * 
 * Team member management with roles and permissions
 */

const members = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah.chen@bloomandwild.com",
    role: "Admin",
    avatar: "SC",
    status: "active",
    lastActive: "2 min ago",
  },
  {
    id: "2",
    name: "James Wong",
    email: "james.wong@bloomandwild.com",
    role: "Approver",
    avatar: "JW",
    status: "active",
    lastActive: "1 hour ago",
  },
  {
    id: "3",
    name: "Emma Thompson",
    email: "emma.thompson@bloomandwild.com",
    role: "Viewer",
    avatar: "ET",
    status: "active",
    lastActive: "3 hours ago",
  },
  {
    id: "4",
    name: "Michael Roberts",
    email: "michael.roberts@bloomandwild.com",
    role: "Approver",
    avatar: "MR",
    status: "pending",
    lastActive: "Invited",
  },
];

const roleColors: Record<string, string> = {
  Admin: "bg-purple-100 text-purple-700",
  Approver: "bg-blue-100 text-blue-700",
  Viewer: "bg-gray-100 text-gray-700",
};

export default function Members() {
  return (
    <AppLayout>
      <div className="h-full overflow-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-muted-foreground" />
            <div>
              <h1 className="text-2xl font-semibold">Team Members</h1>
              <p className="text-muted-foreground text-sm">
                Manage who has access to your workspace
              </p>
            </div>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Invite Member
          </Button>
        </div>

        {/* Members List */}
        <Card>
          <div className="divide-y divide-border">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {member.avatar}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{member.name}</p>
                      {member.status === "pending" && (
                        <Badge variant="outline" className="text-xs">
                          Pending
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">
                    {member.lastActive}
                  </span>
                  <Badge className={roleColors[member.role]} variant="secondary">
                    {member.role}
                  </Badge>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Roles Explanation */}
        <div className="mt-8">
          <h2 className="font-medium mb-4">Role Permissions</h2>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <Badge className={roleColors.Admin} variant="secondary">
                Admin
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Full access to all features, settings, and team management
              </p>
            </Card>
            <Card className="p-4">
              <Badge className={roleColors.Approver} variant="secondary">
                Approver
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Can review and approve items within their approval limit
              </p>
            </Card>
            <Card className="p-4">
              <Badge className={roleColors.Viewer} variant="secondary">
                Viewer
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">
                Read-only access to view agents and activity logs
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
