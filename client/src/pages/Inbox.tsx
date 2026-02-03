import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  XCircle,
} from "lucide-react";
import { useState } from "react";

// Mock data
const inboxItems = [
  {
    id: "1",
    status: "pending" as const,
    worker: "Three-Way Matching",
    title: "Invoice #4521 - Quantity mismatch",
    supplier: "Baby Mori / Jellycat",
    issue: "Quantity mismatch",
    poQuantity: 500,
    invoiceQuantity: 520,
    variance: "+20 (4%)",
    invoiceAmount: "£2,340.00",
    expectedAmount: "£2,250.00",
    varianceAmount: "£90.00",
    aiRecommendation: "APPROVE",
    aiReasoning:
      "Likely partial shipment catch-up. Previous order #4498 was short by 20 units.",
    confidence: 87,
    assignedTo: "You",
    time: "2h ago",
  },
  {
    id: "2",
    status: "pending" as const,
    worker: "EU Regulatory Monitor",
    title: "New packaging regulation - P1 Priority",
    description:
      "EU Commission published new sustainable packaging requirements effective Q3 2026",
    priority: "P1",
    source: "EUR-Lex",
    affectedAreas: ["Packaging", "Labeling", "UK Operations"],
    aiRecommendation: "REVIEW",
    aiReasoning:
      "High relevance to current product line. Recommend legal team assessment within 7 days.",
    confidence: 92,
    assignedTo: "Legal Team",
    time: "4h ago",
  },
  {
    id: "3",
    status: "pending" as const,
    worker: "Three-Way Matching",
    title: "Invoice #4519 - Supplier format error",
    supplier: "Jellycat",
    issue: "PDF parsing failed",
    aiRecommendation: "MANUAL REVIEW",
    aiReasoning:
      "Unable to extract line items. Invoice appears to use non-standard format.",
    confidence: 45,
    assignedTo: "You",
    time: "5h ago",
  },
  {
    id: "4",
    status: "escalated" as const,
    worker: "Three-Way Matching",
    title: "Invoice #4518 - Large variance",
    supplier: "Bloom & Wild",
    issue: "Price discrepancy",
    variance: "+15%",
    invoiceAmount: "£12,500.00",
    expectedAmount: "£10,870.00",
    varianceAmount: "£1,630.00",
    aiRecommendation: "ESCALATE",
    aiReasoning: "Variance exceeds 10% threshold. Requires CFO approval.",
    confidence: 94,
    assignedTo: "CFO",
    escalatedBy: "James Wong",
    time: "Yesterday",
  },
];

const completedItems = [
  {
    id: "5",
    status: "approved" as const,
    worker: "Three-Way Matching",
    title: "Invoice #4515",
    approvedBy: "Sarah Chen",
    time: "Yesterday",
  },
  {
    id: "6",
    status: "rejected" as const,
    worker: "Three-Way Matching",
    title: "Invoice #4512",
    rejectedBy: "Sarah Chen",
    reason: "Duplicate invoice",
    time: "Yesterday",
  },
];

function InboxItem({
  item,
  expanded,
  onToggle,
}: {
  item: (typeof inboxItems)[0];
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className={cn(
        "transition-all duration-200",
        expanded && "ring-1 ring-primary/20"
      )}
    >
      <CardContent className="p-0">
        {/* Header row */}
        <button
          onClick={onToggle}
          className="w-full flex items-start gap-4 p-4 text-left hover:bg-muted/50 transition-colors"
        >
          <div
            className={cn(
              "mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              item.status === "pending" && "bg-warning/10",
              item.status === "escalated" && "bg-escalated/10"
            )}
          >
            {item.status === "pending" && (
              <AlertTriangle className="w-4 h-4 text-warning" />
            )}
            {item.status === "escalated" && (
              <ArrowUpRight className="w-4 h-4 text-escalated" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-muted-foreground">
                {item.worker}
              </span>
              {item.status === "escalated" && (
                <Badge
                  variant="outline"
                  className="text-escalated border-escalated/30 text-xs"
                >
                  Escalated
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium text-foreground">{item.title}</p>
            {"supplier" in item && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {item.supplier}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs text-muted-foreground">{item.time}</span>
            <ChevronRight
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                expanded && "rotate-90"
              )}
            />
          </div>
        </button>

        {/* Expanded content */}
        {expanded && (
          <div className="px-4 pb-4 pt-0 border-t border-border">
            <div className="pt-4 space-y-4">
              {/* Issue details */}
              {"invoiceAmount" in item && (
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Invoice Amount
                    </p>
                    <p className="text-sm font-mono font-medium mt-1">
                      {item.invoiceAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expected</p>
                    <p className="text-sm font-mono font-medium mt-1">
                      {item.expectedAmount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Variance</p>
                    <p className="text-sm font-mono font-medium mt-1 text-warning">
                      {item.varianceAmount}
                    </p>
                  </div>
                </div>
              )}

              {/* AI Recommendation */}
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      AI Recommendation
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        item.aiRecommendation === "APPROVE" &&
                          "text-success border-success/30",
                        item.aiRecommendation === "ESCALATE" &&
                          "text-escalated border-escalated/30",
                        item.aiRecommendation === "MANUAL REVIEW" &&
                          "text-warning border-warning/30"
                      )}
                    >
                      {item.aiRecommendation}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Confidence
                    </span>
                    <div className="flex items-center gap-2">
                      <Progress value={item.confidence} className="w-16 h-1.5" />
                      <span className="text-xs font-mono font-medium">
                        {item.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-foreground">{item.aiReasoning}</p>
              </div>

              {/* Assignment info */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div>
                    <span className="text-muted-foreground">Assigned to: </span>
                    <span className="font-medium">{item.assignedTo}</span>
                  </div>
                  {"escalatedBy" in item && (
                    <div>
                      <span className="text-muted-foreground">
                        Escalated by:{" "}
                      </span>
                      <span className="font-medium">{item.escalatedBy}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  View Documents
                </Button>
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive hover:text-destructive"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </Button>
                {item.status !== "escalated" && (
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    Escalate
                  </Button>
                )}
                <Button size="sm" className="gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CompletedItem({ item }: { item: (typeof completedItems)[0] }) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-border last:border-0">
      {item.status === "approved" ? (
        <CheckCircle2 className="w-4 h-4 text-success" />
      ) : (
        <XCircle className="w-4 h-4 text-destructive" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">
          {item.title} -{" "}
          {item.status === "approved"
            ? `Approved by ${item.approvedBy}`
            : `Rejected by ${item.rejectedBy}`}
        </p>
        {"reason" in item && (
          <p className="text-xs text-muted-foreground mt-0.5">
            Reason: {item.reason}
          </p>
        )}
      </div>
      <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
    </div>
  );
}

export default function Inbox() {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>("1");

  const pendingCount = inboxItems.filter((i) => i.status === "pending").length;
  const escalatedCount = inboxItems.filter(
    (i) => i.status === "escalated"
  ).length;
  const myItems = inboxItems.filter((i) => i.assignedTo === "You");

  const filteredItems = inboxItems.filter((item) => {
    if (filter === "mine") return item.assignedTo === "You";
    if (filter === "escalated") return item.status === "escalated";
    return true;
  });

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
              <Badge variant="secondary" className="font-mono">
                {inboxItems.length} pending
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              Items requiring your review and approval.
            </p>
          </div>
        </div>

        {/* Filters */}
        <Tabs value={filter} onValueChange={setFilter} className="mb-6">
          <TabsList>
            <TabsTrigger value="all">
              All ({inboxItems.length})
            </TabsTrigger>
            <TabsTrigger value="mine">
              Assigned to Me ({myItems.length})
            </TabsTrigger>
            <TabsTrigger value="escalated">
              Escalated ({escalatedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main list */}
          <div className="lg:col-span-2 space-y-3">
            {filteredItems.map((item) => (
              <InboxItem
                key={item.id}
                item={item}
                expanded={expandedId === item.id}
                onToggle={() =>
                  setExpandedId(expandedId === item.id ? null : item.id)
                }
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick stats */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Today's Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Pending review
                  </span>
                  <span className="text-sm font-mono font-medium">
                    {pendingCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Escalated
                  </span>
                  <span className="text-sm font-mono font-medium text-escalated">
                    {escalatedCount}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Assigned to you
                  </span>
                  <span className="text-sm font-mono font-medium">
                    {myItems.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recently completed */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">
                  Recently Completed
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {completedItems.map((item) => (
                  <CompletedItem key={item.id} item={item} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
