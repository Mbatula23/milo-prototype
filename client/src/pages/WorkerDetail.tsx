import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  Pause,
  Pencil,
  Play,
  Settings,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "wouter";

// Mock data
const worker = {
  id: "1",
  name: "Three-Way Matching",
  description: "PO → Packing List → Invoice reconciliation",
  icon: "📦",
  status: "active" as const,
  owner: "Sarah Chen",
  lastRun: "2h ago",
};

const stats = {
  processed: 1247,
  matched: 1173,
  matchRate: 94.1,
  flagged: 62,
  flagRate: 5.0,
  errors: 12,
  errorRate: 0.9,
};

const workflowSteps = [
  "Receives invoice PDF via email or upload",
  "Extracts line items using OCR",
  "Matches against PO in connected ERP",
  "Compares with packing list",
  "If match: Auto-approve (under £500)\n   If discrepancy: Flag for human review",
];

const approvalRules = [
  { condition: "Exact match, value < £500", approval: "Auto-approve" },
  { condition: "Variance < 5%, value < £5,000", approval: "Finance Team Member" },
  { condition: "Variance 5-10%, any value", approval: "Finance Manager" },
  { condition: "Variance > 10% OR value > £10,000", approval: "CFO" },
  { condition: "New supplier", approval: "Finance Manager + CFO" },
];

const queueItems = [
  {
    id: "1",
    title: "Invoice #4521 - Baby Mori / Jellycat",
    issue: "Quantity mismatch",
    variance: "+4%",
    amount: "£2,340.00",
    recommendation: "APPROVE",
    confidence: 87,
    assignedTo: "You",
    time: "2h ago",
  },
  {
    id: "2",
    title: "Invoice #4519 - Jellycat",
    issue: "PDF parsing failed",
    variance: "N/A",
    amount: "£890.00",
    recommendation: "MANUAL REVIEW",
    confidence: 45,
    assignedTo: "You",
    time: "5h ago",
  },
  {
    id: "3",
    title: "Invoice #4518 - Bloom & Wild",
    issue: "Price discrepancy",
    variance: "+15%",
    amount: "£12,500.00",
    recommendation: "ESCALATE",
    confidence: 94,
    assignedTo: "CFO",
    time: "Yesterday",
  },
];

const historyItems = [
  {
    id: "1",
    title: "Invoice #4517",
    status: "auto-approved" as const,
    time: "Today, 9:15 AM",
  },
  {
    id: "2",
    title: "Invoice #4515",
    status: "approved" as const,
    approvedBy: "Sarah Chen",
    time: "Yesterday",
  },
  {
    id: "3",
    title: "Invoice #4512",
    status: "rejected" as const,
    rejectedBy: "Sarah Chen",
    reason: "Duplicate",
    time: "Yesterday",
  },
  {
    id: "4",
    title: "Invoice #4510",
    status: "approved" as const,
    approvedBy: "James Wong",
    time: "2 days ago",
  },
];

function StatCard({
  label,
  value,
  rate,
  type,
}: {
  label: string;
  value: number;
  rate: number;
  type: "success" | "warning" | "error" | "neutral";
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <p className="metric-label">{label}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <p className="metric-value">{value.toLocaleString()}</p>
          <span
            className={cn(
              "text-sm font-medium",
              type === "success" && "text-success",
              type === "warning" && "text-warning",
              type === "error" && "text-destructive",
              type === "neutral" && "text-muted-foreground"
            )}
          >
            {rate}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function QueueItem({ item }: { item: (typeof queueItems)[0] }) {
  return (
    <div className="flex items-start gap-4 p-4 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
      <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
        <AlertTriangle className="w-4 h-4 text-warning" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{item.title}</p>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span>{item.issue}</span>
          <span>•</span>
          <span className="font-mono">{item.amount}</span>
          {item.variance !== "N/A" && (
            <>
              <span>•</span>
              <span className="text-warning">{item.variance}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant="outline"
            className={cn(
              "text-xs",
              item.recommendation === "APPROVE" && "text-success border-success/30",
              item.recommendation === "ESCALATE" &&
                "text-escalated border-escalated/30",
              item.recommendation === "MANUAL REVIEW" &&
                "text-warning border-warning/30"
            )}
          >
            {item.recommendation}
          </Badge>
          <div className="flex items-center gap-1.5">
            <Progress value={item.confidence} className="w-12 h-1" />
            <span className="text-xs font-mono text-muted-foreground">
              {item.confidence}%
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-xs text-muted-foreground">{item.time}</span>
        <div className="flex gap-1.5">
          <Button variant="outline" size="sm">
            View
          </Button>
          <Button size="sm">Review</Button>
        </div>
      </div>
    </div>
  );
}

function HistoryItem({ item }: { item: (typeof historyItems)[0] }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      {item.status === "approved" || item.status === "auto-approved" ? (
        <CheckCircle2 className="w-4 h-4 text-success" />
      ) : (
        <XCircle className="w-4 h-4 text-destructive" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{item.title}</span>
          {item.status === "auto-approved" && (
            <Badge variant="outline" className="text-xs">
              Auto
            </Badge>
          )}
        </div>
        {"approvedBy" in item && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Approved by {item.approvedBy}
          </p>
        )}
        {"rejectedBy" in item && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Rejected by {item.rejectedBy} - {item.reason}
          </p>
        )}
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
    </div>
  );
}

export default function WorkerDetail() {
  const params = useParams();

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/workers">
            <Button variant="ghost" size="sm" className="gap-1.5 mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4" />
              Workers
            </Button>
          </Link>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                {worker.icon}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold tracking-tight">
                    {worker.name}
                  </h1>
                  <Badge
                    variant="outline"
                    className={cn(
                      worker.status === "active"
                        ? "text-success border-success/30"
                        : "text-muted-foreground"
                    )}
                  >
                    {worker.status === "active" ? "● Active" : "○ Paused"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  {worker.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-1.5">
                <Pencil className="w-4 h-4" />
                Edit
              </Button>
              <Button variant="outline" className="gap-1.5">
                {worker.status === "active" ? (
                  <>
                    <Pause className="w-4 h-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Resume
                  </>
                )}
              </Button>
              <Button variant="outline" className="gap-1.5">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview">
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="queue">
              Queue
              <Badge variant="secondary" className="ml-2 font-mono">
                {queueItems.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <StatCard
                label="Processed"
                value={stats.processed}
                rate={100}
                type="neutral"
              />
              <StatCard
                label="Matched"
                value={stats.matched}
                rate={stats.matchRate}
                type="success"
              />
              <StatCard
                label="Flagged"
                value={stats.flagged}
                rate={stats.flagRate}
                type="warning"
              />
              <StatCard
                label="Errors"
                value={stats.errors}
                rate={stats.errorRate}
                type="error"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* How it works */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    How this worker operates
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {workflowSteps.map((step, index) => (
                      <li key={index} className="flex gap-3">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-sm text-foreground whitespace-pre-line">
                          {step}
                        </span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              {/* Approval rules */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base font-medium">
                    Approval Rules
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {approvalRules.map((rule, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <span className="text-sm text-foreground">
                          {rule.condition}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {rule.approval}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Queue Tab */}
          <TabsContent value="queue">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base font-medium">
                  Items Pending Review
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    All
                  </Button>
                  <Button variant="ghost" size="sm">
                    Needs My Review
                  </Button>
                  <Button variant="ghost" size="sm">
                    Escalated
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {queueItems.map((item) => (
                  <QueueItem key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Processing History
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {historyItems.map((item) => (
                  <HistoryItem key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configuration Tab */}
          <TabsContent value="configuration">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-medium">
                  Worker Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configuration settings for this worker will be displayed here.
                  This includes trigger conditions, data sources, and output
                  destinations.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
