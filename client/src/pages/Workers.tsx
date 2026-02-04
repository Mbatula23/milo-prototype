import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Bot,
  Clock,
  FileCheck,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Shield,
  Sparkles,
  TrendingUp,
  Wallet,
  Calculator,
  FileText,
  BarChart3,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

/*
 * Workers Page - Main worker list with chat-first creation
 * 
 * Design: Split view with worker list on left, chat creation on right
 * Workers grouped by category: Finance, Compliance, Operations
 * 
 * Note: Using professional Lucide icons with neutral/muted colors for enterprise feel
 */

// Icon mapping for workers - professional icons with muted colors
const workerIcons: Record<string, React.ReactNode> = {
  "po-matching": <FileCheck className="w-5 h-5 text-muted-foreground" />,
  "regulatory": <Shield className="w-5 h-5 text-muted-foreground" />,
  "rebates": <Wallet className="w-5 h-5 text-muted-foreground" />,
  "invoice-processing": <FileText className="w-5 h-5 text-muted-foreground" />,
  "expense-audit": <Calculator className="w-5 h-5 text-muted-foreground" />,
  "spend-analytics": <BarChart3 className="w-5 h-5 text-muted-foreground" />,
};

// Category definitions
type Category = "finance" | "compliance" | "operations";

const categoryLabels: Record<Category, string> = {
  finance: "Finance",
  compliance: "Compliance",
  operations: "Operations",
};

// Worker type
interface Worker {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused";
  iconKey: string;
  category: Category;
  lastRun: string;
  stats: { processed: number; flagged: number; successRate: number };
}

// Mock workers data grouped by category
const workers: Worker[] = [
  // Finance
  {
    id: "1",
    name: "PO Matching",
    description: "Three-way matching: PO → Packing List → Invoice",
    status: "active",
    iconKey: "po-matching",
    category: "finance",
    lastRun: "2 min ago",
    stats: { processed: 1247, flagged: 62, successRate: 95.0 },
  },
  {
    id: "3",
    name: "Rebates Calculator",
    description: "Supplier rebate tracking and reconciliation",
    status: "paused",
    iconKey: "rebates",
    category: "finance",
    lastRun: "2 days ago",
    stats: { processed: 456, flagged: 12, successRate: 97.4 },
  },
  // Compliance
  {
    id: "2",
    name: "Regulatory Monitor",
    description: "EU regulatory changes affecting packaging & labeling",
    status: "active",
    iconKey: "regulatory",
    category: "compliance",
    lastRun: "1 hour ago",
    stats: { processed: 89, flagged: 3, successRate: 100 },
  },
  // Operations
  {
    id: "4",
    name: "Spend Analytics",
    description: "Monthly spend categorization and anomaly detection",
    status: "active",
    iconKey: "spend-analytics",
    category: "operations",
    lastRun: "4 hours ago",
    stats: { processed: 2341, flagged: 18, successRate: 99.2 },
  },
];

// Group workers by category
const workersByCategory = workers.reduce((acc, worker) => {
  if (!acc[worker.category]) {
    acc[worker.category] = [];
  }
  acc[worker.category].push(worker);
  return acc;
}, {} as Record<Category, Worker[]>);

// Chat messages for creation flow
interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const initialMessages: ChatMessage[] = [
  {
    role: "assistant",
    content: "What would you like to automate? Describe the task in plain English.",
  },
];

function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <Link href={`/workers/${worker.id}`}>
      <Card className="p-4 worker-card cursor-pointer border-border/50 hover:border-border hover:shadow-sm transition-all">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
            {workerIcons[worker.iconKey] || <Bot className="w-5 h-5 text-muted-foreground" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{worker.name}</h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5",
                  worker.status === "active"
                    ? "status-success"
                    : "text-muted-foreground border-muted-foreground/30"
                )}
              >
                {worker.status === "active" ? (
                  <><Play className="w-2.5 h-2.5 mr-1" /> Active</>
                ) : (
                  <><Pause className="w-2.5 h-2.5 mr-1" /> Paused</>
                )}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {worker.description}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {worker.lastRun}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {worker.stats.successRate}%
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function CategorySection({ category, workers }: { category: Category; workers: Worker[] }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {categoryLabels[category]}
        </span>
        <span className="text-xs text-muted-foreground/60">
          ({workers.length})
        </span>
      </div>
      <div className="space-y-2">
        {workers.map((worker) => (
          <WorkerCard key={worker.id} worker={worker} />
        ))}
      </div>
    </div>
  );
}

export default function Workers() {
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        role: "assistant",
        content:
          "I can help you set that up. Let me ask a few questions:\n\n1. Where do the invoices come from? (Email, upload, ERP)\n2. What ERP system do you use for PO data?\n3. What should happen when there's a mismatch?",
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  // Order categories
  const categoryOrder: Category[] = ["finance", "compliance", "operations"];

  return (
    <AppLayout>
      <div className="h-full flex">
        {/* Left panel - Worker list */}
        <div className={cn(
          "border-r border-border flex flex-col transition-all duration-300",
          showChat ? "w-80" : "flex-1 max-w-2xl"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-muted-foreground" />
                <h1 className="text-lg font-semibold">Workers</h1>
              </div>
              <Link href="/workers/new">
                <Button
                  size="sm"
                  className="gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  New Worker
                </Button>
              </Link>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search workers..."
                className="pl-9 bg-muted/50 border-0"
              />
            </div>
          </div>

          {/* Worker list grouped by category */}
          <div className="flex-1 overflow-auto p-4">
            {categoryOrder.map((category) => {
              const categoryWorkers = workersByCategory[category];
              if (!categoryWorkers || categoryWorkers.length === 0) return null;
              return (
                <CategorySection
                  key={category}
                  category={category}
                  workers={categoryWorkers}
                />
              );
            })}
          </div>
        </div>

        {/* Right panel - Chat or empty state */}
        <div className="flex-1 flex flex-col">
          {showChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-muted-foreground" />
                  <h2 className="font-medium">Create New Worker</h2>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowChat(false);
                    setMessages(initialMessages);
                  }}
                >
                  Cancel
                </Button>
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" && "justify-end"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-muted-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "max-w-[80%] px-4 py-3 text-sm whitespace-pre-line",
                        message.role === "user"
                          ? "chat-message-user"
                          : "chat-message-ai"
                      )}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="chat-message-ai px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.1s]" />
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Describe what you want to automate..."
                    className="flex-1 bg-muted/50 border-0"
                  />
                  <Button size="icon" onClick={handleSend} disabled={!input.trim()}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state when no chat */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Select a worker to view details
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Or create a new worker by describing what you want to automate
                  in plain English.
                </p>
                <Button onClick={() => setShowChat(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Worker
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
