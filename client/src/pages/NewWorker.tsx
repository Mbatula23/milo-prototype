import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  Database,
  FileText,
  Layout,
  Loader2,
  MessageSquare,
  Play,
  Send,
  Settings,
  Sparkles,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";

/*
 * NewWorker Page - Multi-step worker creation flow
 * 
 * Design: Conversational start (like Twin) → Configuration → Preview → Deploy
 * Shows the full journey from describing what you want to the final artifact
 */

const steps = [
  { id: 1, name: "Describe", icon: MessageSquare },
  { id: 2, name: "Configure", icon: Settings },
  { id: 3, name: "Preview", icon: Layout },
  { id: 4, name: "Deploy", icon: Play },
];

// Suggested worker templates
const templates = [
  {
    id: "po-matching",
    name: "PO Matching",
    description: "Three-way matching for invoices, POs, and packing lists",
    category: "Finance",
  },
  {
    id: "legislation-tracker",
    name: "Legislation Tracker",
    description: "Monitor regulatory changes across jurisdictions",
    category: "Compliance",
  },
  {
    id: "rebates-calculator",
    name: "Rebates Calculator",
    description: "Track and calculate supplier rebates",
    category: "Finance",
  },
  {
    id: "spend-analytics",
    name: "Spend Analytics",
    description: "Categorize and analyze company spending",
    category: "Operations",
  },
];

// Mock conversation
const mockConversation = [
  {
    role: "assistant",
    content: "What would you like to automate? Describe it in plain English, or choose from a template below.",
  },
];

// Mock data sources
const dataSources = [
  { id: "netsuite", name: "NetSuite", connected: true, type: "ERP" },
  { id: "gmail", name: "Gmail", connected: true, type: "Email" },
  { id: "sharepoint", name: "SharePoint", connected: false, type: "Documents" },
  { id: "slack", name: "Slack", connected: true, type: "Communication" },
];

// Mock output preview data for Legislation Tracker
const previewData = {
  columns: ["Data Protection & Privacy", "Employment Law & Workforce", "Product Safety & Consumer", "Sustainability & Reporting"],
  items: [
    {
      title: "UK Advertising Regulation ASACAP CMA And ICO Roles",
      status: "In review",
      priority: "P2",
      date: "April 2025",
      column: 0,
    },
    {
      title: "EU AI Act AI Literacy And Prohibited Practices HRD",
      status: "In review",
      priority: "P2",
      date: "February 2025",
      column: 1,
    },
    {
      title: "UK DMCC Unfair Commercial Practices Price Transpar",
      status: "Not addressed",
      priority: "P2",
      date: "April 2025",
      column: 2,
    },
    {
      title: "EU Packaging Packaging Waste Regulation PPWR Ecomm",
      status: "In review",
      priority: "P2",
      date: "August 2026",
      column: 3,
    },
  ],
};

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              currentStep === step.id
                ? "bg-primary text-primary-foreground"
                : currentStep > step.id
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground"
            )}
          >
            {currentStep > step.id ? (
              <Check className="w-4 h-4" />
            ) : (
              <step.icon className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{step.name}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-8 h-0.5 mx-1",
                currentStep > step.id ? "bg-primary" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}

function DescribeStep({
  onNext,
  selectedTemplate,
  setSelectedTemplate,
}: {
  onNext: () => void;
  selectedTemplate: string | null;
  setSelectedTemplate: (id: string | null) => void;
}) {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState(mockConversation);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!message.trim()) return;
    
    setConversation([
      ...conversation,
      { role: "user", content: message },
    ]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `Great! I understand you want to ${message.toLowerCase()}. I'll help you set up a worker for this. Let me configure the data sources and output format for you.`,
        },
      ]);
      setIsTyping(false);
      setTimeout(onNext, 1500);
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat messages */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-xs font-medium text-primary">Milo</span>
                </div>
              )}
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-2xl px-4 py-3">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">Milo is thinking...</span>
              </div>
            </div>
          </div>
        )}

        {/* Templates - show only at start */}
        {conversation.length === 1 && (
          <div className="mt-6">
            <p className="text-sm text-muted-foreground mb-3">Or start from a template:</p>
            <div className="grid grid-cols-2 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setConversation([
                      ...conversation,
                      { role: "user", content: `I want to set up a ${template.name} worker` },
                    ]);
                    setIsTyping(true);
                    setTimeout(() => {
                      setConversation((prev) => [
                        ...prev,
                        {
                          role: "assistant",
                          content: `Perfect! ${template.name} is a great choice. ${template.description}. Let me configure this for you with the recommended settings.`,
                        },
                      ]);
                      setIsTyping(false);
                      setTimeout(onNext, 1500);
                    }, 2000);
                  }}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all hover:border-primary/50 hover:bg-muted/50",
                    selectedTemplate === template.id && "border-primary bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Bot className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{template.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{template.description}</p>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {template.category}
                  </Badge>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Describe what you want to automate..."
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!message.trim() || isTyping}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConfigureStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Worker name */}
        <div className="space-y-2">
          <Label htmlFor="name">Worker Name</Label>
          <Input id="name" defaultValue="Legislation Tracker" />
        </div>

        {/* Data Sources */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="w-4 h-4" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dataSources.map((source) => (
              <div
                key={source.id}
                className="flex items-center justify-between p-3 rounded-lg border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-muted flex items-center justify-center">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{source.name}</p>
                    <p className="text-xs text-muted-foreground">{source.type}</p>
                  </div>
                </div>
                {source.connected ? (
                  <Badge variant="outline" className="text-xs text-green-600 border-green-200 bg-green-50">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Button variant="outline" size="sm">
                    Connect
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Trigger */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Trigger
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                <input type="radio" name="trigger" defaultChecked className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Scheduled</p>
                  <p className="text-xs text-muted-foreground">Run daily at 9:00 AM</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                <input type="radio" name="trigger" className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">On new data</p>
                  <p className="text-xs text-muted-foreground">Run when new documents are detected</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50">
                <input type="radio" name="trigger" className="w-4 h-4" />
                <div>
                  <p className="text-sm font-medium">Manual only</p>
                  <p className="text-xs text-muted-foreground">Run only when triggered manually</p>
                </div>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Approval rules */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Approval Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Auto-approve low priority items</p>
                  <p className="text-xs text-muted-foreground">P3 and P4 items are auto-approved</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Require review for high priority</p>
                  <p className="text-xs text-muted-foreground">P1 and P2 items need human review</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Escalate critical items</p>
                  <p className="text-xs text-muted-foreground">P1 items escalate to department head</p>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext}>
            Preview Output
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function PreviewStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Output Preview</h3>
          <p className="text-sm text-muted-foreground">
            This is how your worker's output will appear. You can customize the layout and columns.
          </p>
        </div>

        {/* Kanban preview - matching Bloom & Wild Legislation Tracker */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Legislation Tracker</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">Filter</Button>
                <Button variant="outline" size="sm">Export</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {previewData.columns.map((column, colIndex) => (
                <div key={column} className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                    {column}
                  </div>
                  {previewData.items
                    .filter((item) => item.column === colIndex)
                    .map((item, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-lg border bg-card hover:shadow-sm transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              item.status === "In review"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            )}
                          >
                            {item.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium mb-1 line-clamp-2">{item.title}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={onNext}>
            Deploy Worker
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function DeployStep({ onBack }: { onBack: () => void }) {
  const [, setLocation] = useLocation();
  const [isDeploying, setIsDeploying] = useState(false);
  const [isDeployed, setIsDeployed] = useState(false);

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsDeployed(true);
    }, 2000);
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        {!isDeployed ? (
          <>
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              {isDeploying ? (
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              ) : (
                <Play className="w-8 h-8 text-primary" />
              )}
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready to Deploy</h3>
            <p className="text-muted-foreground mb-6">
              Your Legislation Tracker worker is configured and ready to start monitoring regulatory changes.
            </p>
            <div className="space-y-4">
              <Card className="text-left">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Worker Name</span>
                    <span className="font-medium">Legislation Tracker</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Trigger</span>
                    <span className="font-medium">Daily at 9:00 AM</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Data Sources</span>
                    <span className="font-medium">3 connected</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Approval Rules</span>
                    <span className="font-medium">Auto + Manual</span>
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-3">
                <Button variant="outline" onClick={onBack} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button onClick={handleDeploy} disabled={isDeploying} className="flex-1">
                  {isDeploying ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Deploy Now
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Worker Deployed!</h3>
            <p className="text-muted-foreground mb-6">
              Legislation Tracker is now active and will run its first scan at 9:00 AM tomorrow.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setLocation("/workers")} className="flex-1">
                View All Workers
              </Button>
              <Button onClick={() => setLocation("/workers/2")} className="flex-1">
                View Worker
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function NewWorker() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/workers">
                <Button variant="ghost" size="sm" className="gap-1.5 -ml-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">Create New Worker</h1>
                <p className="text-sm text-muted-foreground">
                  Set up an AI worker to automate a task
                </p>
              </div>
            </div>
            <StepIndicator currentStep={currentStep} />
          </div>
        </div>

        {/* Step content */}
        {currentStep === 1 && (
          <DescribeStep
            onNext={() => setCurrentStep(2)}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
          />
        )}
        {currentStep === 2 && (
          <ConfigureStep
            onNext={() => setCurrentStep(3)}
            onBack={() => setCurrentStep(1)}
          />
        )}
        {currentStep === 3 && (
          <PreviewStep
            onNext={() => setCurrentStep(4)}
            onBack={() => setCurrentStep(2)}
          />
        )}
        {currentStep === 4 && (
          <DeployStep onBack={() => setCurrentStep(3)} />
        )}
      </div>
    </AppLayout>
  );
}
