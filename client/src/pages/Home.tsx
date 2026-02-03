import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
} from "lucide-react";
import { Link } from "wouter";

// Mock data
const metrics = [
  {
    label: "Pending Review",
    value: "12",
    change: "+3 from yesterday",
    changeType: "warning" as const,
  },
  {
    label: "Workers Active",
    value: "4",
    change: "All healthy",
    changeType: "success" as const,
  },
  {
    label: "Processed",
    value: "1,247",
    change: "This week",
    changeType: "neutral" as const,
  },
];

const pendingItems = [
  {
    id: "1",
    type: "warning",
    worker: "Three-Way Matching",
    title: "5 invoices have discrepancies",
    detail: "Baby Mori order #4521 • £2,340 variance",
    time: "2h ago",
  },
  {
    id: "2",
    type: "info",
    worker: "EU Regulatory Monitor",
    title: "New packaging regulation detected",
    detail: "P1 Priority • Affects UK operations",
    time: "4h ago",
  },
  {
    id: "3",
    type: "warning",
    worker: "Three-Way Matching",
    title: "Supplier format error",
    detail: "Jellycat invoice #8892 • PDF parsing failed",
    time: "5h ago",
  },
];

const recentActivity = [
  {
    id: "1",
    status: "approved",
    title: "Invoice #8823 auto-matched and approved",
    worker: "Three-Way Matching",
    time: "Just now",
  },
  {
    id: "2",
    status: "completed",
    title: "Regulatory scan completed • 0 new items",
    worker: "EU Monitor",
    time: "1h ago",
  },
  {
    id: "3",
    status: "processing",
    title: "Accrual calculation in progress",
    worker: "Month-End Worker",
    time: "Started 5m ago",
  },
];

function MetricCard({
  label,
  value,
  change,
  changeType,
}: {
  label: string;
  value: string;
  change: string;
  changeType: "success" | "warning" | "neutral";
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="metric-label">{label}</p>
        <p className="metric-value mt-2">{value}</p>
        <p
          className={cn(
            "text-xs mt-2",
            changeType === "success" && "text-success",
            changeType === "warning" && "text-warning",
            changeType === "neutral" && "text-muted-foreground"
          )}
        >
          {change}
        </p>
      </CardContent>
    </Card>
  );
}

function PendingItem({
  type,
  worker,
  title,
  detail,
  time,
}: {
  type: string;
  worker: string;
  title: string;
  detail: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
      <div
        className={cn(
          "mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center",
          type === "warning" ? "bg-warning/10" : "bg-primary/10"
        )}
      >
        {type === "warning" ? (
          <AlertTriangle className="w-4 h-4 text-warning" />
        ) : (
          <FileText className="w-4 h-4 text-primary" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-muted-foreground">
            {worker}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{detail}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          Skip
        </Button>
        <Button size="sm">Review</Button>
      </div>
    </div>
  );
}

function ActivityItem({
  status,
  title,
  worker,
  time,
}: {
  status: string;
  title: string;
  worker: string;
  time: string;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-border last:border-0">
      <div className="mt-0.5">
        {status === "approved" && (
          <CheckCircle2 className="w-4 h-4 text-success" />
        )}
        {status === "completed" && (
          <CheckCircle2 className="w-4 h-4 text-success" />
        )}
        {status === "processing" && (
          <Loader2 className="w-4 h-4 text-primary animate-spin" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted-foreground">{worker}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{time}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">
            {greeting}, Sarah
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your workflows today.
          </p>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Items */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-base font-medium">
                    Needs Your Attention
                  </CardTitle>
                </div>
                <Link href="/inbox">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View all
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                {pendingItems.map((item) => (
                  <PendingItem key={item.id} {...item} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div>
            <Card>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <CardTitle className="text-base font-medium">
                    Recent Activity
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {recentActivity.map((item) => (
                  <ActivityItem key={item.id} {...item} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
