import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Download,
  Flag,
  Search,
  User,
  XCircle,
} from "lucide-react";

// Mock data
const activityLog = [
  {
    id: "1",
    time: "10:23 AM",
    user: "Sarah Chen",
    userType: "human" as const,
    worker: "Three-Way Matching",
    action: "approved" as const,
    title: "Invoice #4521 - £2,340",
    note: "Confirmed with supplier via email",
  },
  {
    id: "2",
    time: "10:15 AM",
    user: "System",
    userType: "system" as const,
    worker: "Three-Way Matching",
    action: "flagged" as const,
    title: "Invoice #4521 - Quantity mismatch detected",
    details: "Confidence: 87% | Assigned to: Sarah Chen",
  },
  {
    id: "3",
    time: "09:45 AM",
    user: "System",
    userType: "system" as const,
    worker: "EU Regulatory Monitor",
    action: "completed" as const,
    title: "Daily scan - 0 new regulatory items",
  },
  {
    id: "4",
    time: "09:30 AM",
    user: "James Wong",
    userType: "human" as const,
    worker: "Three-Way Matching",
    action: "escalated" as const,
    title: "Invoice #4518 - Escalated to CFO",
    note: "Value exceeds my approval limit",
  },
  {
    id: "5",
    time: "09:15 AM",
    user: "System",
    userType: "system" as const,
    worker: "Three-Way Matching",
    action: "auto-approved" as const,
    title: "Invoice #4517 - Auto-approved (exact match)",
  },
  {
    id: "6",
    time: "09:00 AM",
    user: "System",
    userType: "system" as const,
    worker: "Three-Way Matching",
    action: "processed" as const,
    title: "Batch processing started - 15 invoices queued",
  },
  {
    id: "7",
    time: "08:45 AM",
    user: "Sarah Chen",
    userType: "human" as const,
    worker: "Three-Way Matching",
    action: "rejected" as const,
    title: "Invoice #4512 - Duplicate invoice",
    note: "Already processed on 01/28",
  },
  {
    id: "8",
    time: "Yesterday",
    user: "System",
    userType: "system" as const,
    worker: "Month-End Accruals",
    action: "completed" as const,
    title: "January accruals calculated - 47 journal entries",
  },
  {
    id: "9",
    time: "Yesterday",
    user: "Finance Team",
    userType: "human" as const,
    worker: "Month-End Accruals",
    action: "approved" as const,
    title: "January accruals batch approved",
    note: "Reviewed by CFO",
  },
];

const actionConfig = {
  approved: {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
    label: "Approved",
  },
  "auto-approved": {
    icon: CheckCircle2,
    color: "text-success",
    bgColor: "bg-success/10",
    label: "Auto-approved",
  },
  rejected: {
    icon: XCircle,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
    label: "Rejected",
  },
  flagged: {
    icon: Flag,
    color: "text-warning",
    bgColor: "bg-warning/10",
    label: "Flagged",
  },
  escalated: {
    icon: ArrowUpRight,
    color: "text-escalated",
    bgColor: "bg-escalated/10",
    label: "Escalated",
  },
  completed: {
    icon: CheckCircle2,
    color: "text-primary",
    bgColor: "bg-primary/10",
    label: "Completed",
  },
  processed: {
    icon: Bot,
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    label: "Processed",
  },
};

function ActivityRow({ item }: { item: (typeof activityLog)[0] }) {
  const config = actionConfig[item.action];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-4 py-4 border-b border-border last:border-0">
      {/* Time */}
      <div className="w-20 shrink-0">
        <span className="text-xs font-mono text-muted-foreground">
          {item.time}
        </span>
      </div>

      {/* Icon */}
      <div
        className={cn(
          "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
          config.bgColor
        )}
      >
        <Icon className={cn("w-4 h-4", config.color)} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <div className="flex items-center gap-1.5">
            {item.userType === "human" ? (
              <User className="w-3 h-3 text-muted-foreground" />
            ) : (
              <Bot className="w-3 h-3 text-muted-foreground" />
            )}
            <span className="text-sm font-medium">{item.user}</span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-sm text-muted-foreground">{item.worker}</span>
        </div>
        <p className="text-sm text-foreground">{item.title}</p>
        {"details" in item && (
          <p className="text-xs text-muted-foreground mt-1">{item.details}</p>
        )}
        {"note" in item && (
          <p className="text-xs text-muted-foreground mt-1 italic">
            Note: "{item.note}"
          </p>
        )}
      </div>

      {/* Action badge */}
      <Badge
        variant="outline"
        className={cn("shrink-0 text-xs", config.color)}
      >
        {config.label}
      </Badge>
    </div>
  );
}

export default function Activity() {
  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Activity</h1>
            <p className="text-muted-foreground mt-1">
              Complete audit trail of all actions across your workers.
            </p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search activity..." className="pl-9" />
          </div>
          <Select defaultValue="all-workers">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Workers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-workers">All Workers</SelectItem>
              <SelectItem value="three-way">Three-Way Matching</SelectItem>
              <SelectItem value="eu-monitor">EU Regulatory Monitor</SelectItem>
              <SelectItem value="month-end">Month-End Accruals</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all-users">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-users">All Users</SelectItem>
              <SelectItem value="sarah">Sarah Chen</SelectItem>
              <SelectItem value="james">James Wong</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="today">
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity table */}
        <Card>
          <CardContent className="p-0">
            <div className="px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <div className="w-20">Time</div>
                <div className="w-8" />
                <div className="flex-1">Details</div>
                <div className="w-24 text-right">Action</div>
              </div>
            </div>
            <div className="px-4">
              {activityLog.map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pagination hint */}
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>Showing 9 of 1,247 entries</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
