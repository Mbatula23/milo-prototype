import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Bot,
  FileText,
  MoreHorizontal,
  Pause,
  Pencil,
  Plus,
  Search,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const workers = [
  {
    id: "1",
    name: "Three-Way Matching",
    description: "PO → Packing List → Invoice reconciliation",
    icon: "📦",
    status: "active" as const,
    owner: "Sarah Chen",
    lastRun: "2h ago",
    processed: 1247,
    successRate: 94.2,
  },
  {
    id: "2",
    name: "EU Regulatory Monitor",
    description: "Daily scan of regulatory sources for EU compliance",
    icon: "📋",
    status: "active" as const,
    owner: "Legal Team",
    lastRun: "6h ago",
    alerts: 23,
    p1Alerts: 3,
    sources: 12,
  },
  {
    id: "3",
    name: "Month-End Accruals",
    description: "Automated accrual calculations and journal entries",
    icon: "💰",
    status: "paused" as const,
    owner: "Finance Team",
    lastRun: "3 days ago",
    processed: 156,
    successRate: 98.1,
  },
  {
    id: "4",
    name: "Supplier Onboarding",
    description: "Collect and verify new supplier documentation",
    icon: "🤝",
    status: "active" as const,
    owner: "Procurement",
    lastRun: "1h ago",
    processed: 34,
    successRate: 91.2,
  },
];

function WorkerCard({
  worker,
}: {
  worker: (typeof workers)[0];
}) {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-lg">
              {worker.icon}
            </div>
            <div>
              <h3 className="font-medium text-foreground">{worker.name}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">
                {worker.description}
              </p>
            </div>
          </div>
          <div
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              worker.status === "active"
                ? "bg-success/10 text-success"
                : "bg-muted text-muted-foreground"
            )}
          >
            {worker.status === "active" ? "● Active" : "○ Paused"}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4 pt-4 border-t border-border">
          <div>
            <p className="text-xs text-muted-foreground">Owner</p>
            <p className="text-sm font-medium mt-0.5">{worker.owner}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Last run</p>
            <p className="text-sm font-medium mt-0.5">{worker.lastRun}</p>
          </div>
          {"processed" in worker && (
            <>
              <div>
                <p className="text-xs text-muted-foreground">Processed</p>
                <p className="text-sm font-medium font-mono mt-0.5">
                  {worker.processed?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Success rate</p>
                <p className="text-sm font-medium font-mono mt-0.5">
                  {worker.successRate}%
                </p>
              </div>
            </>
          )}
          {"alerts" in worker && (
            <>
              <div>
                <p className="text-xs text-muted-foreground">Alerts</p>
                <p className="text-sm font-medium font-mono mt-0.5">
                  {worker.alerts}{" "}
                  <span className="text-warning">({worker.p1Alerts} P1)</span>
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sources</p>
                <p className="text-sm font-medium font-mono mt-0.5">
                  {worker.sources}
                </p>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 pt-4 border-t border-border">
          <Link href={`/workers/${worker.id}`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              View
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Pause className="w-3.5 h-3.5" />
            {worker.status === "active" ? "Pause" : "Resume"}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="ml-auto">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem>View logs</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Workers() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filteredWorkers = workers.filter((worker) => {
    if (filter === "active" && worker.status !== "active") return false;
    if (filter === "paused" && worker.status !== "paused") return false;
    if (
      search &&
      !worker.name.toLowerCase().includes(search.toLowerCase()) &&
      !worker.description.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <DashboardLayout>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Workers</h1>
            <p className="text-muted-foreground mt-1">
              Manage your AI workers and automation workflows.
            </p>
          </div>
          <Link href="/workers/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Worker
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search workers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="paused">Paused</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Workers Grid */}
        {filteredWorkers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No workers found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {search
                ? "Try adjusting your search terms"
                : "Create your first worker to get started"}
            </p>
            {!search && (
              <Link href="/workers/new">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Worker
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
