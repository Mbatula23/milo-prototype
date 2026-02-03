import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Bot, Send, Sparkles } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// Templates
const templates = [
  {
    id: "three-way",
    icon: "📦",
    name: "Three-Way Matching",
    description: "PO → Packing List → Invoice reconciliation",
  },
  {
    id: "regulatory",
    icon: "📋",
    name: "Regulatory Monitor",
    description: "Monitor regulatory sources for compliance updates",
  },
  {
    id: "accruals",
    icon: "💰",
    name: "Month-End Accruals",
    description: "Automated accrual calculations and journal entries",
  },
];

// Conversation state
type ConversationStep = "initial" | "clarifying" | "configuring" | "complete";

interface Message {
  role: "user" | "assistant";
  content: string;
  options?: {
    type: "checkbox" | "radio" | "text";
    items?: { id: string; label: string; description?: string }[];
    selected?: string[];
  };
}

const initialMessages: Message[] = [];

const clarifyingMessage: Message = {
  role: "assistant",
  content:
    "I can help you set up a regulatory monitoring worker. A few questions to make sure I get this right:",
  options: {
    type: "checkbox",
    items: [
      {
        id: "eur-lex",
        label: "EUR-Lex",
        description: "EU legislation and regulations",
      },
      { id: "efsa", label: "EFSA", description: "Food safety authority" },
      { id: "echa", label: "ECHA", description: "Chemicals agency" },
      { id: "fsa", label: "UK FSA", description: "UK Food Standards Agency" },
    ],
  },
};

export default function NewWorker() {
  const [step, setStep] = useState<ConversationStep>("initial");
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [priorityMethod, setPriorityMethod] = useState<string>("");

  const handleSubmitInitial = () => {
    if (!userInput.trim()) return;

    // Add user message
    setMessages([
      ...messages,
      { role: "user", content: userInput },
      clarifyingMessage,
    ]);
    setUserInput("");
    setStep("clarifying");
  };

  const handleContinue = () => {
    if (step === "clarifying") {
      setMessages([
        ...messages,
        {
          role: "user",
          content: `Selected sources: ${selectedSources.join(", ")}`,
        },
        {
          role: "assistant",
          content: "How should I prioritize alerts?",
          options: {
            type: "radio",
            items: [
              {
                id: "relevance",
                label: "By topic relevance to your business",
              },
              { id: "deadline", label: "By implementation deadline" },
              { id: "custom", label: "Let me define custom rules" },
            ],
          },
        },
      ]);
      setStep("configuring");
    } else if (step === "configuring") {
      setMessages([
        ...messages,
        { role: "user", content: `Priority method: ${priorityMethod}` },
        {
          role: "assistant",
          content:
            "I've created your EU Regulatory Monitor worker. It will scan the selected sources daily and alert your team when relevant changes are detected.\n\nThe worker is now active and will run its first scan in the next hour.",
        },
      ]);
      setStep("complete");
    }
  };

  const toggleSource = (id: string) => {
    setSelectedSources((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/workers">
            <Button variant="ghost" size="sm" className="gap-1.5 mb-4 -ml-2">
              <ArrowLeft className="w-4 h-4" />
              Workers
            </Button>
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">
            Create New Worker
          </h1>
          <p className="text-muted-foreground mt-1">
            Describe what you want to automate, or start from a template.
          </p>
        </div>

        {/* Main content */}
        <Card>
          <CardContent className="p-6">
            {step === "initial" ? (
              <>
                {/* Initial input */}
                <div className="mb-8">
                  <Label className="text-base font-medium mb-3 block">
                    What would you like to automate?
                  </Label>
                  <div className="relative">
                    <Textarea
                      placeholder="I want to monitor EU regulatory websites daily and alert our legal team when there are changes that might affect our packaging or labeling requirements."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      className="min-h-[120px] pr-12 resize-none"
                    />
                    <Button
                      size="sm"
                      className="absolute bottom-3 right-3 gap-1.5"
                      onClick={handleSubmitInitial}
                      disabled={!userInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Templates */}
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Or start from a template:
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {templates.map((template) => (
                      <button
                        key={template.id}
                        className="p-4 border border-border rounded-lg text-left hover:bg-muted/50 hover:border-primary/30 transition-colors"
                      >
                        <div className="text-2xl mb-2">{template.icon}</div>
                        <p className="text-sm font-medium">{template.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {template.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Conversation */}
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex gap-3",
                        message.role === "user" && "justify-end"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                      )}
                      <div
                        className={cn(
                          "max-w-[80%]",
                          message.role === "user" &&
                            "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-4 py-2"
                        )}
                      >
                        <p
                          className={cn(
                            "text-sm whitespace-pre-line",
                            message.role === "assistant" && "text-foreground"
                          )}
                        >
                          {message.content}
                        </p>

                        {/* Options */}
                        {message.options?.type === "checkbox" && (
                          <div className="mt-4 space-y-3">
                            <p className="text-sm font-medium text-foreground">
                              Which regulatory sources should I monitor?
                            </p>
                            {message.options.items?.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-start gap-3"
                              >
                                <Checkbox
                                  id={item.id}
                                  checked={selectedSources.includes(item.id)}
                                  onCheckedChange={() => toggleSource(item.id)}
                                />
                                <div>
                                  <Label
                                    htmlFor={item.id}
                                    className="text-sm font-medium cursor-pointer"
                                  >
                                    {item.label}
                                  </Label>
                                  {item.description && (
                                    <p className="text-xs text-muted-foreground">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {message.options?.type === "radio" && (
                          <div className="mt-4">
                            <RadioGroup
                              value={priorityMethod}
                              onValueChange={setPriorityMethod}
                            >
                              {message.options.items?.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-3 py-2"
                                >
                                  <RadioGroupItem
                                    value={item.id}
                                    id={item.id}
                                  />
                                  <Label
                                    htmlFor={item.id}
                                    className="text-sm cursor-pointer"
                                  >
                                    {item.label}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue button */}
                {step !== "complete" && (
                  <div className="mt-6 flex justify-end">
                    <Button
                      onClick={handleContinue}
                      disabled={
                        (step === "clarifying" && selectedSources.length === 0) ||
                        (step === "configuring" && !priorityMethod)
                      }
                      className="gap-1.5"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Complete actions */}
                {step === "complete" && (
                  <div className="mt-6 flex justify-end gap-3">
                    <Link href="/workers">
                      <Button variant="outline">View All Workers</Button>
                    </Link>
                    <Link href="/workers/2">
                      <Button className="gap-1.5">
                        <Bot className="w-4 h-4" />
                        View Worker
                      </Button>
                    </Link>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
