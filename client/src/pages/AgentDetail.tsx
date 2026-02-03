import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  FileText,
  Pause,
  Play,
  RefreshCw,
  Settings,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "wouter";

/*
 * AgentDetail Page - Live execution view with actual data
 * 
 * Design: Twin-inspired live output + enterprise approval layer
 * Shows real data being processed, not just metrics
 */

// Mock agent data
const agent = {
  id: "1",
  name: "PO Matching",
  description: "Three-way matching: PO → Packing List → Invoice",
  status: "active" as const,
  icon: "📦",
  trigger: "Email to invoices@company.com or manual upload",
  lastRun: "2 min ago",
  nextRun: "Continuous",
};

// Mock execution data - this is what Twin does well
const recentItems = [
  {
    id: "INV-4521",
    supplier: "Baby Mori / Jellycat",
    poNumber: "PO-2024-1847",
    invoiceAmount: 2340.0,
    poAmount: 2250.0,
    status: "flagged" as const,
    issue: "Quantity mismatch (+20 units)",
    confidence: 87,
    recommendation: "Approve - likely partial shipment catch-up",
    timestamp: "2 min ago",
  },
  {
    id: "INV-4520",
    supplier: "Bloom & Wild",
    poNumber: "PO-2024-1845",
    invoiceAmount: 890.0,
    poAmount: 890.0,
    status: "matched" as const,
    issue: null,
    confidence: 100,
    recommendation: null,
    timestamp: "15 min ago",
  },
  {
    id: "INV-4519",
    supplier: "Jellycat",
    poNumber: "PO-2024-1842",
    invoiceAmount: 1250.0,
    poAmount: null,
    status: "error" as const,
    issue: "PDF parsing failed - non-standard format",
    confidence: 45,
    recommendation: "Manual review required",
    timestamp: "1 hour ago",
  },
  {
    id: "INV-4518",
    supplier: "Bloom & Wild",
    poNumber: "PO-2024-1840",
    invoiceAmount: 12500.0,
    poAmount: 10870.0,
    status: "escalated" as const,
    issue: "Price variance +15%",
    confidence: 94,
    recommendation: "Escalate to CFO - exceeds threshold",
    timestamp: "2 hours ago",
  },
  {
    id: "INV-4517",
    supplier: "Baby Mori",
    poNumber: "PO-2024-1838",
    invoiceAmount: 456.0,
    poAmount: 456.0,
    status: "auto-approved" as const,
    issue: null,
    confidence: 100,
    recommendation: null,
    timestamp: "3 hours ago",
  },
];

// Execution logs
const logs = [
  { time: "15:23:45", level: "info", message: "Processing invoice INV-4521 from Baby Mori / Jellycat" },
  { time: "15:23:46", level: "info", message: "Extracted 12 line items via OCR" },
  { time: "15:23:47", level: "info", message: "Matched to PO-2024-1847" },
  { time: "15:23:48", level: "warning", message: "Quantity mismatch detected: Invoice 520 vs PO 500 (+20)" },
  { time: "15:23:49", level: "info", message: "Checking historical patterns..." },
  { time: "15:23:50", level: "info", message: "Found: PO-2024-1798 was short by 20 units" },
  { time: "15:23:51", level: "success", message: "Recommendation: APPROVE (87% confidence)" },
  { time: "15:23:52", level: "info", message: "Flagged for human review → Sarah Chen" },
];

function StatusBadge({ status }: { status: string }) {
  const config = {
    matched: { icon: CheckCircle2, label: "Matched", class: "status-success" },
    "auto-approved": { icon: CheckCircle2, label: "Auto-approved", class: "status-success" },
    flagged: { icon: AlertTriangle, label: "Flagged", class: "status-warning" },
    escalated: { icon: AlertTriangle, label: "Escalated", class: "bg-purple-500/15 text-purple-400 border-purple-500/30" },
    error: { icon: XCircle, label: "Error", class: "status-error" },
  }[status] || { icon: Clock, label: status, class: "" };

  const Icon = config.icon;

  return (
    <Badge variant="outline" className={cn("text-xs gap-1", config.class)}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}

function DataRow({ item }: { item: (typeof recentItems)[0] }) {
  return (
    <tr className="group">
      <td className="py-3 px-4 border-b border-border/50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <span className="font-mono text-sm">{item.id}</span>
        </div>
      </td>
      <td className="py-3 px-4 border-b border-border/50">
        <span className="text-sm">{item.supplier}</span>
      </td>
      <td className="py-3 px-4 border-b border-border/50">
        <span className="font-mono text-sm text-muted-foreground">{item.poNumber}</span>
      </td>
      <td className="py-3 px-4 border-b border-border/50 text-right">
        <span className="font-mono text-sm">£{item.invoiceAmount.toLocaleString()}</span>
      </td>
      <td className="py-3 px-4 border-b border-border/50 text-right">
        <span className="font-mono text-sm text-muted-foreground">
          {item.poAmount ? `£${item.poAmount.toLocaleString()}` : "—"}
        </span>
      </td>
      <td className="py-3 px-4 border-b border-border/50">
        <StatusBadge status={item.status} />
      </td>
      <td className="py-3 px-4 border-b border-border/50">
        <span className="text-xs text-muted-foreground">{item.timestamp}</span>
      </td>
      <td className="py-3 px-4 border-b border-border/50">
        {(item.status === "flagged" || item.status === "escalated" || item.status === "error") && (
          <Link href="/inbox">
            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
              Review
            </Button>
          </Link>
        )}
      </td>
    </tr>
  );
}

export default function AgentDetail() {
  const params = useParams();

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border shrink-0">
          <div className="flex items-center gap-4 mb-3">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-1.5 -ml-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl">
              {agent.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold">{agent.name}</h1>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs",
                    agent.status === "active" ? "status-success" : ""
                  )}
                >
                  {agent.status === "active" ? "● Active" : "○ Paused"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{agent.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <RefreshCw className="w-4 h-4" />
                Run Now
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Pause className="w-4 h-4" />
                Pause
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="flex items-center gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Trigger: </span>
              <span>{agent.trigger}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Last run: </span>
              <span>{agent.lastRun}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="output" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-4 border-b border-border shrink-0">
            <TabsList className="bg-transparent h-auto p-0 gap-4">
              <TabsTrigger
                value="output"
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                Output
                <Badge variant="secondary" className="ml-2 text-xs">
                  {recentItems.length}
                </Badge>
              </TabsTrigger>
              <TabsTrigger
                value="logs"
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                Logs
              </TabsTrigger>
              <TabsTrigger
                value="config"
                className="bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-0 pb-3"
              >
                Configuration
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Output tab - Live data table like Twin */}
          <TabsContent value="output" className="flex-1 overflow-auto m-0 p-4">
            <Card className="border-border/50">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4 border-b border-border">
                        Invoice
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4 border-b border-border">
                        Supplier
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4 border-b border-border">
                        PO
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4 border-b border-border">
                        Invoice Amt
                      </th>
                      <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4 border-b border-border">
                        PO Amt
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4 border-b border-border">
                        Status
                      </th>
                      <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider py-3 px-4 border-b border-border">
                        Time
                      </th>
                      <th className="py-3 px-4 border-b border-border w-20"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentItems.map((item) => (
                      <DataRow key={item.id} item={item} />
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>

            {/* Flagged item detail - shows AI reasoning */}
            {recentItems.filter(i => i.status === "flagged").length > 0 && (
              <Card className="mt-4 border-warning/30 bg-warning/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    Flagged: INV-4521 requires review
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Issue</p>
                      <p>Quantity mismatch: Invoice shows 520 units, PO shows 500</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Variance</p>
                      <p className="font-mono">+£90.00 (+4%)</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">Confidence</p>
                      <div className="flex items-center gap-2">
                        <Progress value={87} className="w-20 h-1.5" />
                        <span className="font-mono text-xs">87%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-background/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">AI Recommendation</p>
                    <p className="text-sm">
                      <span className="text-success font-medium">APPROVE</span> — Previous order PO-2024-1798 was short by 20 units. This appears to be a catch-up shipment.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" className="gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <XCircle className="w-4 h-4" />
                      Reject
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <ExternalLink className="w-4 h-4" />
                      View Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Logs tab - Execution logs */}
          <TabsContent value="logs" className="flex-1 overflow-auto m-0 p-4">
            <Card className="border-border/50">
              <CardContent className="p-4">
                <div className="font-mono text-xs space-y-1">
                  {logs.map((log, index) => (
                    <div key={index} className="flex gap-3">
                      <span className="text-muted-foreground w-20 shrink-0">
                        {log.time}
                      </span>
                      <span
                        className={cn(
                          log.level === "success" && "text-success",
                          log.level === "warning" && "text-warning",
                          log.level === "error" && "text-error"
                        )}
                      >
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Config tab */}
          <TabsContent value="config" className="flex-1 overflow-auto m-0 p-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Trigger</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>Email to invoices@company.com</p>
                  <p className="mt-1">Manual upload via dashboard</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Data Sources</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>NetSuite (PO data)</p>
                  <p className="mt-1">Gmail (invoice attachments)</p>
                </CardContent>
              </Card>
              <Card className="border-border/50 col-span-2">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Approval Rules</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span>Exact match, value &lt; £500</span>
                      <Badge variant="outline" className="text-xs">Auto-approve</Badge>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span>Variance &lt; 5%, value &lt; £5,000</span>
                      <Badge variant="outline" className="text-xs">Finance Team</Badge>
                    </div>
                    <div className="flex justify-between py-2 border-b border-border/50">
                      <span>Variance 5-10%, any value</span>
                      <Badge variant="outline" className="text-xs">Finance Manager</Badge>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Variance &gt; 10% OR value &gt; £10,000</span>
                      <Badge variant="outline" className="text-xs">CFO</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
