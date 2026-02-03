import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  FileText,
  Inbox as InboxIcon,
  XCircle,
} from "lucide-react";
import { useState } from "react";

/*
 * Inbox Page - Approval queue with AI recommendations
 * 
 * Design: Enterprise approval workflow with confidence levels
 * Items that need human review surface here
 */

// Mock inbox items
const inboxItems = [
  {
    id: "1",
    type: "invoice" as const,
    agent: "PO Matching",
    title: "INV-4521 - Quantity mismatch",
    subtitle: "Baby Mori / Jellycat",
    issue: "Invoice shows 520 units, PO shows 500 (+20)",
    amounts: { invoice: 2340, po: 2250, variance: 90 },
    recommendation: "APPROVE" as const,
    reasoning: "Previous order PO-2024-1798 was short by 20 units. This appears to be a catch-up shipment.",
    confidence: 87,
    assignedTo: "You",
    time: "2 min ago",
    priority: "normal" as const,
  },
  {
    id: "2",
    type: "regulatory" as const,
    agent: "Regulatory Monitor",
    title: "New EU packaging regulation",
    subtitle: "P1 Priority - EUR-Lex",
    issue: "Sustainable packaging requirements effective Q3 2026",
    recommendation: "REVIEW" as const,
    reasoning: "High relevance to current product line. Recommend legal team assessment within 7 days.",
    confidence: 92,
    assignedTo: "Legal Team",
    time: "4 hours ago",
    priority: "high" as const,
  },
  {
    id: "3",
    type: "invoice" as const,
    agent: "PO Matching",
    title: "INV-4519 - Parse error",
    subtitle: "Jellycat",
    issue: "PDF parsing failed - non-standard invoice format",
    recommendation: "MANUAL" as const,
    reasoning: "Unable to extract line items. Invoice appears to use non-standard format.",
    confidence: 45,
    assignedTo: "You",
    time: "1 hour ago",
    priority: "normal" as const,
  },
  {
    id: "4",
    type: "invoice" as const,
    agent: "PO Matching",
    title: "INV-4518 - Large variance",
    subtitle: "Bloom & Wild",
    issue: "Price discrepancy +15% (£1,630)",
    amounts: { invoice: 12500, po: 10870, variance: 1630 },
    recommendation: "ESCALATE" as const,
    reasoning: "Variance exceeds 10% threshold. Requires CFO approval per policy.",
    confidence: 94,
    assignedTo: "CFO",
    escalatedBy: "James Wong",
    time: "2 hours ago",
    priority: "high" as const,
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
  const recommendationConfig = {
    APPROVE: { color: "text-success", bg: "bg-success/10" },
    REVIEW: { color: "text-info", bg: "bg-info/10" },
    MANUAL: { color: "text-warning", bg: "bg-warning/10" },
    ESCALATE: { color: "text-purple-400", bg: "bg-purple-500/10" },
  };

  const config = recommendationConfig[item.recommendation];

  return (
    <Card
      className={cn(
        "border-border/50 transition-all duration-200",
        expanded && "ring-1 ring-primary/30",
        item.priority === "high" && "border-l-2 border-l-warning"
      )}
    >
      <CardContent className="p-0">
        {/* Header row - clickable */}
        <button
          onClick={onToggle}
          className="w-full flex items-start gap-4 p-4 text-left hover:bg-muted/30 transition-colors"
        >
          <div
            className={cn(
              "mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              config.bg
            )}
          >
            {item.recommendation === "ESCALATE" ? (
              <ArrowUpRight className={cn("w-4 h-4", config.color)} />
            ) : (
              <AlertTriangle className={cn("w-4 h-4", config.color)} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground">{item.agent}</span>
              {"escalatedBy" in item && (
                <Badge variant="outline" className="text-[10px] text-purple-400 border-purple-500/30">
                  Escalated
                </Badge>
              )}
            </div>
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground">{item.subtitle}</p>
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
          <div className="px-4 pb-4 border-t border-border/50">
            <div className="pt-4 space-y-4">
              {/* Issue details */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Issue</p>
                <p className="text-sm">{item.issue}</p>
              </div>

              {/* Amounts if invoice */}
              {"amounts" in item && item.amounts && (
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Invoice</p>
                    <p className="font-mono text-sm">£{item.amounts.invoice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">PO</p>
                    <p className="font-mono text-sm">£{item.amounts.po.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Variance</p>
                    <p className="font-mono text-sm text-warning">+£{item.amounts.variance.toLocaleString()}</p>
                  </div>
                </div>
              )}

              {/* AI Recommendation */}
              <div className={cn("p-3 rounded-lg border", config.bg, "border-transparent")}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      AI Recommendation
                    </span>
                    <Badge variant="outline" className={cn("text-xs", config.color)}>
                      {item.recommendation}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Confidence</span>
                    <Progress value={item.confidence} className="w-16 h-1.5" />
                    <span className="text-xs font-mono">{item.confidence}%</span>
                  </div>
                </div>
                <p className="text-sm">{item.reasoning}</p>
              </div>

              {/* Assignment */}
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Assigned to: </span>
                  <span className="font-medium">{item.assignedTo}</span>
                </div>
                {"escalatedBy" in item && (
                  <div>
                    <span className="text-muted-foreground">Escalated by: </span>
                    <span className="font-medium">{item.escalatedBy}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Documents
                </Button>
                <div className="flex-1" />
                <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive">
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </Button>
                {item.recommendation !== "ESCALATE" && (
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

export default function Inbox() {
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>("1");

  const myItems = inboxItems.filter((i) => i.assignedTo === "You");
  const escalatedItems = inboxItems.filter((i) => "escalatedBy" in i);

  const filteredItems = inboxItems.filter((item) => {
    if (filter === "mine") return item.assignedTo === "You";
    if (filter === "escalated") return "escalatedBy" in item;
    return true;
  });

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <InboxIcon className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold">Inbox</h1>
            <Badge variant="secondary" className="font-mono">
              {inboxItems.length} pending
            </Badge>
          </div>

          {/* Filters */}
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="bg-muted/50">
              <TabsTrigger value="all" className="text-xs">
                All ({inboxItems.length})
              </TabsTrigger>
              <TabsTrigger value="mine" className="text-xs">
                Mine ({myItems.length})
              </TabsTrigger>
              <TabsTrigger value="escalated" className="text-xs">
                Escalated ({escalatedItems.length})
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-auto p-4 space-y-3">
          {filteredItems.map((item) => (
            <InboxItem
              key={item.id}
              item={item}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
            />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
