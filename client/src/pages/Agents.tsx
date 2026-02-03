import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Bot,
  Clock,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

/*
 * Agents Page (v3) - Workers list with card layout
 * 
 * Theme: White/light matching platform.get-milo.com
 * Layout: Sidebar + card-based content with "Ask Analyst" pattern
 * Features: Enterprise controls from v1/v2
 */

// Mock workers data matching actual Milo
const workers = [
  {
    id: "1",
    name: "Invoice-Order Match Assistant",
    category: "Accounts Payable",
    status: "active" as const,
    metrics: { value: "552", unit: "h", label: "Hours Saved", subtext: "≈ £16,560 staff time" },
    items: [
      { name: "Mori Textiles", amount: "£1,312", detail: "0 price variances • 5 over • 7 under" },
      { name: "Packaging Ltd", amount: "£309", detail: "3 price variances • 0 over • 9 under" },
      { name: "Fabric Co", amount: "£739", detail: "13 price variances • 12 over • 0 under" },
    ],
    secondaryMetrics: [
      { value: "£61,008", label: "Anomaly Savings" },
      { value: "87%", label: "Auto-Match Rate" },
    ],
  },
  {
    id: "2",
    name: "Early Settlement Discounts",
    category: "Treasury",
    status: "active" as const,
    metrics: { value: "£756k", unit: "", label: "Annual Savings", subtext: "" },
    items: [
      { name: "Urban Textile Mills", amount: "£72,850", detail: "Due £280,000 • 7 invoices" },
      { name: "Premium Leather Supplies", amount: "£64,105", detail: "Due £295,000 • 6 invoices" },
      { name: "Premium Fabrics International", amount: "£58,985", detail: "Due £245,000 • 6 invoices" },
    ],
    secondaryMetrics: [
      { value: "2,145", label: "Hours Saved" },
      { value: "3,948", label: "Negotiations Avoided" },
    ],
  },
  {
    id: "3",
    name: "Regulation Research",
    category: "Risk & Compliance",
    status: "active" as const,
    metrics: { value: "£130k", unit: "", label: "Advisor Saved", subtext: "≈ £14,402 staff time" },
    items: [
      { name: "EU: Data Act (2025)", amount: "P2", detail: "Cloud Switching and Data Agreements", isRisk: true },
      { name: "UK: DMCC Unfair Commercial Practices", amount: "P2", detail: "Price Transparency", isRisk: true },
      { name: "EU General Product Safety Regulation", amount: "P2", detail: "GPSR compliance", isRisk: true },
    ],
    secondaryMetrics: [
      { value: "480", label: "Hours Saved" },
      { value: "3", label: "Critical Risks Caught" },
    ],
  },
];

function WorkerCard({ worker }: { worker: (typeof workers)[0] }) {
  const [analystInput, setAnalystInput] = useState("");

  return (
    <Card className="p-6 bg-card border-border">
      {/* Category label */}
      <div className="text-xs text-muted-foreground mb-3">{worker.category}</div>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-status-active)]" />
          <h3 className="font-medium">{worker.name}</h3>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-xs">Annual</Button>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">Monthly</Button>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <div className="text-3xl font-semibold tracking-tight">
            {worker.metrics.value}<span className="text-lg text-muted-foreground">{worker.metrics.unit}</span>
          </div>
          <div className="text-xs text-muted-foreground">{worker.metrics.label}</div>
          {worker.metrics.subtext && (
            <div className="text-xs text-muted-foreground mt-0.5">{worker.metrics.subtext}</div>
          )}
        </div>
        {worker.secondaryMetrics.map((metric, i) => (
          <div key={i}>
            <div className="text-2xl font-semibold tracking-tight">{metric.value}</div>
            <div className="text-xs text-muted-foreground">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Items list */}
      <div className="space-y-3 mb-4">
        {worker.items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
            <div>
              <div className="font-medium text-sm">{item.name}</div>
              <div className="text-xs text-muted-foreground">{item.detail}</div>
            </div>
            <div className="flex items-center gap-3">
              <span className={cn(
                "font-medium text-sm",
                (item as any).isRisk ? "text-[var(--color-status-pending)]" : ""
              )}>
                {item.amount}
              </span>
              <Button variant="outline" size="sm" className="text-xs">
                Resolve
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="ghost" size="sm" className="text-xs text-muted-foreground w-full justify-center">
        View full history
      </Button>

      {/* Ask Analyst input */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={analystInput}
            onChange={(e) => setAnalystInput(e.target.value)}
            placeholder="Ask Analyst any question about your financials"
            className="flex-1 text-sm bg-muted/30 border-0"
          />
          <Button variant="outline" size="sm" className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Ask Analyst
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function Agents() {
  return (
    <AppLayout>
      <div className="h-full overflow-auto">
        <div className="p-6 max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold">Workers</h1>
            <Button className="gap-1.5">
              <Plus className="w-4 h-4" />
              Create Worker
            </Button>
          </div>

          {/* Workers grid */}
          <div className="grid gap-6">
            {workers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}

            {/* Create Worker card */}
            <Card className="p-6 border-dashed border-2 border-border bg-transparent hover:bg-accent/50 transition-colors cursor-pointer">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Plus className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">Create Worker</h3>
                <p className="text-sm text-muted-foreground">Add a new worker to your team</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
