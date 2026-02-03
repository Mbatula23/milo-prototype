import AppLayout from "@/components/AppLayout";
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
  History,
  Search,
  User,
  XCircle,
} from "lucide-react";

/*
 * Activity Page - Complete audit trail
 * 
 * Design: Enterprise audit log with filtering
 * Every action is logged with user/system attribution
 */

// Mock activity data
const activityLog = [
  {
    id: "1",
    time: "15:23",
    date: "Today",
    user: "Sarah Chen",
    userType: "human" as const,
    agent: "PO Matching",
    action: "approved" as const,
    title: "INV-4521 approved",
    detail: "£2,340 - Baby Mori / Jellycat",
    note: "Confirmed with supplier via email",
  },
  {
    id: "2",
    time: "15:15",
    date: "Today",
    user: "System",
    userType: "system" as const,
    agent: "PO Matching",
    action: "flagged" as const,
    title: "INV-4521 flagged for review",
    detail: "Quantity mismatch detected (+20 units)",
  },
  {
    id: "3",
    time: "14:45",
    date: "Today",
    user: "System",
    userType: "system" as const,
    agent: "Regulatory Monitor",
    action: "completed" as const,
    title: "Daily scan completed",
    detail: "0 new regulatory items found",
  },
  {
    id: "4",
    time: "14:30",
    date: "Today",
    user: "James Wong",
    userType: "human" as const,
    agent: "PO Matching",
    action: "escalated" as const,
    title: "INV-4518 escalated to CFO",
    detail: "£12,500 - Bloom & Wild",
    note: "Value exceeds my approval limit",
  },
  {
    id: "5",
    time: "14:15",
    date: "Today",
    user: "System",
    userType: "system" as const,
    agent: "PO Matching",
    action: "auto-approved" as const,
    title: "INV-4517 auto-approved",
    detail: "£456 - Exact match",
  },
  {
    id: "6",
    time: "09:00",
    date: "Today",
    user: "System",
    userType: "system" as const,
    agent: "PO Matching",
    action: "processed" as const,
    title: "Batch processing started",
    detail: "15 invoices queued",
  },
  {
    id: "7",
    time: "17:45",
    date: "Yesterday",
    user: "Sarah Chen",
    userType: "human" as const,
    agent: "PO Matching",
    action: "rejected" as const,
    title: "INV-4512 rejected",
    detail: "Duplicate invoice",
    note: "Already processed on 01/28",
  },
];

const actionConfig: Record<string, { icon: any; color: string; label: string }> = {
  approved: { icon: CheckCircle2, color: "text-success", label: "Approved" },
  "auto-approved": { icon: CheckCircle2, color: "text-success", label: "Auto-approved" },
  rejected: { icon: XCircle, color: "text-error", label: "Rejected" },
  flagged: { icon: Flag, color: "text-warning", label: "Flagged" },
  escalated: { icon: ArrowUpRight, color: "text-purple-400", label: "Escalated" },
  completed: { icon: CheckCircle2, color: "text-info", label: "Completed" },
  processed: { icon: Bot, color: "text-muted-foreground", label: "Processed" },
};

function ActivityRow({ item, showDate }: { item: (typeof activityLog)[0]; showDate: boolean }) {
  const config = actionConfig[item.action] || actionConfig.processed;
  const Icon = config.icon;

  return (
    <>
      {showDate && (
        <div className="py-2 px-4 bg-muted/30 text-xs font-medium text-muted-foreground">
          {item.date}
        </div>
      )}
      <div className="flex items-start gap-4 py-3 px-4 hover:bg-muted/20 transition-colors">
        {/* Time */}
        <div className="w-12 shrink-0">
          <span className="text-xs font-mono text-muted-foreground">{item.time}</span>
        </div>

        {/* Icon */}
        <div
          className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
            item.action === "approved" || item.action === "auto-approved"
              ? "bg-success/10"
              : item.action === "rejected"
              ? "bg-error/10"
              : item.action === "flagged"
              ? "bg-warning/10"
              : item.action === "escalated"
              ? "bg-purple-500/10"
              : "bg-muted"
          )}
        >
          <Icon className={cn("w-3.5 h-3.5", config.color)} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="flex items-center gap-1.5">
              {item.userType === "human" ? (
                <User className="w-3 h-3 text-muted-foreground" />
              ) : (
                <Bot className="w-3 h-3 text-muted-foreground" />
              )}
              <span className="text-sm font-medium">{item.user}</span>
            </div>
            <span className="text-muted-foreground text-xs">•</span>
            <span className="text-xs text-muted-foreground">{item.agent}</span>
          </div>
          <p className="text-sm">{item.title}</p>
          <p className="text-xs text-muted-foreground">{item.detail}</p>
          {"note" in item && item.note && (
            <p className="text-xs text-muted-foreground mt-1 italic">"{item.note}"</p>
          )}
        </div>

        {/* Action badge */}
        <Badge variant="outline" className={cn("shrink-0 text-[10px]", config.color)}>
          {config.label}
        </Badge>
      </div>
    </>
  );
}

export default function Activity() {
  // Track which dates we've shown
  let lastDate = "";

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <History className="w-5 h-5 text-primary" />
              <h1 className="text-lg font-semibold">Activity</h1>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9 bg-muted/50 border-0" />
            </div>
            <Select defaultValue="all-agents">
              <SelectTrigger className="w-40 bg-muted/50 border-0">
                <SelectValue placeholder="All Agents" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-agents">All Agents</SelectItem>
                <SelectItem value="po-matching">PO Matching</SelectItem>
                <SelectItem value="regulatory">Regulatory Monitor</SelectItem>
                <SelectItem value="rebates">Rebates Calculator</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-users">
              <SelectTrigger className="w-40 bg-muted/50 border-0">
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
              <SelectTrigger className="w-32 bg-muted/50 border-0">
                <SelectValue placeholder="Date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="yesterday">Yesterday</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Activity list */}
        <div className="flex-1 overflow-auto">
          <Card className="m-4 border-border/50">
            <CardContent className="p-0">
              {activityLog.map((item) => {
                const showDate = item.date !== lastDate;
                lastDate = item.date;
                return <ActivityRow key={item.id} item={item} showDate={showDate} />;
              })}
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border shrink-0 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing 7 of 1,247 entries</span>
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
    </AppLayout>
  );
}
