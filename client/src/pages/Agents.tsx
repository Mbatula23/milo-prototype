import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  Clock,
  FileText,
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
 * Agents Page - Main agent list with chat-first creation
 * 
 * Design: Split view with agent list on left, chat creation on right
 * Inspired by Twin.so's conversational approach + existing Milo structure
 */

// Mock agents data
const agents = [
  {
    id: "1",
    name: "PO Matching",
    description: "Three-way matching: PO → Packing List → Invoice",
    status: "active" as const,
    icon: "📦",
    lastRun: "2 min ago",
    stats: { processed: 1247, flagged: 62, successRate: 95.0 },
  },
  {
    id: "2",
    name: "Regulatory Monitor",
    description: "EU regulatory changes affecting packaging & labeling",
    status: "active" as const,
    icon: "📋",
    lastRun: "1 hour ago",
    stats: { processed: 89, flagged: 3, successRate: 100 },
  },
  {
    id: "3",
    name: "Rebates Calculator",
    description: "Supplier rebate tracking and reconciliation",
    status: "paused" as const,
    icon: "💰",
    lastRun: "2 days ago",
    stats: { processed: 456, flagged: 12, successRate: 97.4 },
  },
];

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

function AgentCard({ agent }: { agent: (typeof agents)[0] }) {
  return (
    <Link href={`/agents/${agent.id}`}>
      <Card className="p-4 agent-card cursor-pointer border-border/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-xl shrink-0">
            {agent.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{agent.name}</h3>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5",
                  agent.status === "active"
                    ? "status-success"
                    : "text-muted-foreground border-muted-foreground/30"
                )}
              >
                {agent.status === "active" ? (
                  <><Play className="w-2.5 h-2.5 mr-1" /> Active</>
                ) : (
                  <><Pause className="w-2.5 h-2.5 mr-1" /> Paused</>
                )}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {agent.description}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {agent.lastRun}
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {agent.stats.successRate}%
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export default function Agents() {
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

  return (
    <AppLayout>
      <div className="h-full flex">
        {/* Left panel - Agent list */}
        <div className={cn(
          "border-r border-border flex flex-col transition-all duration-300",
          showChat ? "w-80" : "flex-1 max-w-2xl"
        )}>
          {/* Header */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold">Agents</h1>
              </div>
              <Button
                size="sm"
                onClick={() => setShowChat(true)}
                className="gap-1.5"
              >
                <Plus className="w-4 h-4" />
                New Agent
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-9 bg-muted/50 border-0"
              />
            </div>
          </div>

          {/* Agent list */}
          <div className="flex-1 overflow-auto p-4 space-y-2">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>

        {/* Right panel - Chat or empty state */}
        <div className="flex-1 flex flex-col">
          {showChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="font-medium">Create New Agent</h2>
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
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-4 h-4 text-primary" />
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
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
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
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">
                  Select an agent to view details
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Or create a new agent by describing what you want to automate
                  in plain English.
                </p>
                <Button onClick={() => setShowChat(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Create New Agent
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
