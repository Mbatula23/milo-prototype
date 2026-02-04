import AppLayout from "@/components/AppLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ExternalLink,
  FileText,
  Filter,
  Gavel,
  Mail,
  MessageSquare,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

/*
 * Legislation Tracker Output View
 * 
 * Design: Matches Bloom & Wild's Legislation Tracker artifact
 * - Kanban board with regulation cards by category
 * - Detail view with summary, tasks, articles, cases, risk assessment
 */

// Categories for the Kanban columns
const categories = [
  { id: "data-protection", name: "Data Protection & Privacy", icon: "🔒" },
  { id: "employment", name: "Employment Law & Workforce", icon: "👥" },
  { id: "product-safety", name: "Product Safety & Consumer", icon: "🛡️" },
  { id: "sustainability", name: "Sustainability & Reporting", icon: "🌱" },
  { id: "corporate", name: "Corporate", icon: "🏢" },
];

// Mock regulation items
const regulations = [
  {
    id: 1,
    title: "UK Advertising Regulation ASACAP CMA And ICO Roles",
    category: "data-protection",
    status: "In review",
    priority: "P2",
    date: "April 2025",
    flag: "🇬🇧",
    description: "UK advertising is regulated by the ASA/CAP (non-broadcast ads incl. paid social and marketers' own sites) and the CMA (consumer law on misleading practices). From 6 April 2025, the DMCC Act lets the CMA impose fines up to 10% of global turnover, heightening scrutiny of green claims and online choice architecture. Direct marketing sits with the ICO under PECR rather than ASA.",
    tasks: [
      {
        id: 1,
        text: "Stand up UK ad-review workflow covering ASA/CAP and CMA risk; require evidence for green and pricing claims.",
        tags: ["Process Update", "Marketing Ops + Legal (UK)"],
        completed: false,
      },
      {
        id: 2,
        text: "Train marketing and social teams on ASA remit and influencer disclosure; update creator briefs and contracts.",
        tags: ["Training", "Legal (UK) + Brand Partnerships"],
        completed: false,
      },
      {
        id: 3,
        text: "Audit UK websites and social posts for own-site claim compliance; fix ambiguous 'eco/sustainable' wording.",
        tags: ["Policy/Records Update", "E-commerce + Legal Copy Review"],
        completed: false,
      },
    ],
    articles: [
      {
        title: "Taylor Wessing explains ASA vs CMA remits and rising green-claims focus; DMCC to add direct fines.",
        source: "taylorwessing.com",
        relevancy: 8,
        relevanceNote: "High UK relevance for our e-commerce ads and claims on site/social; guides who regulates which channel.",
      },
      {
        title: "CMA Annual Plan confirms new consumer powers from April 2025 incl. fines up to 10% of global turnover.",
        source: "gov.uk",
        relevancy: 8,
      },
      {
        title: "DMCC Act text/commencement shows consumer enforcement regime in force 6 Apr 2025; penalty ceiling set.",
        source: "legislation.gov.uk",
        relevancy: 7,
      },
      {
        title: "ASA Advice: CAP Code applies to marketers' own websites and other non-paid-for online space under their control.",
        source: "asa.org.uk",
        relevancy: 7,
      },
      {
        title: "ASA guidance: influencer marketing must be obviously identifiable (e.g., clear 'Ad' label); both brand and influencer liable.",
        source: "asa.org.uk",
        relevancy: 7,
      },
      {
        title: "ICO email marketing guidance (PECR) applies to direct marketing; note updates pending post-DUAA.",
        source: "ico.org.uk",
        relevancy: 6,
      },
      {
        title: "TW: Top 10 ASA rulings Q1 2025—green claims (Flooring by Nature) upheld; generic 'eco-friendly' deemed misleading.",
        source: "taylorwessing.com",
        relevancy: 6,
      },
    ],
    cases: [
      {
        title: "CMA green-claims undertakings: ASOS, Boohoo, George agree clearer environmental claims after probe (Mar 2024).",
        source: "reuters.com",
        isHighlighted: true,
      },
      {
        title: "ASA ruling (19 Feb 2025): Flooring by Nature—'eco-friendly/sustainable' claims upheld as misleading; website wording revised.",
        source: "taylorwessing.com",
        isHighlighted: true,
      },
    ],
    riskAssessment: {
      financial: null,
      downtime: null,
      legalCompliance: 4,
      reputational: 3,
      customerDisruption: 2,
      strategic: null,
      healthSafety: null,
      esg: null,
      informationSecurity: null,
    },
    internalProgress: "In review",
  },
  {
    id: 2,
    title: "EU AI Act AI Literacy And Prohibited Practices HRD",
    category: "employment",
    status: "In review",
    priority: "P2",
    date: "February 2025",
    flag: "🇪🇺",
    description: "Stand up AI literacy, ban prohibited workplace AI, and update HR/vendor processes to meet EU AI Act rules.",
  },
  {
    id: 3,
    title: "UK DMCC Unfair Commercial Practices Price Transpar",
    category: "product-safety",
    status: "Not addressed",
    priority: "P2",
    date: "April 2025",
    flag: "🇬🇧",
    description: "UK DMCC unfair-practice rules live; align checkout and pricing claims and track CMA price-transparency guidance.",
  },
  {
    id: 4,
    title: "EU Packaging Packaging Waste Regulation PPWR Ecomm",
    category: "sustainability",
    status: "In review",
    priority: "P2",
    date: "August 2026",
    flag: "🇪🇺",
    description: "EU PPWR applies from 12 Aug 2026—redesign e-commerce packaging, reduce empty space, meet recyclability and labelling rules.",
  },
  {
    id: 5,
    title: "UK DMCCA Subscriptions Pricing And Advertising Q4",
    category: "corporate",
    status: "In review",
    priority: "P2",
    date: "October 2025",
    flag: "🇬🇧",
    description: "Prepare UK pricing, grottos and subscription UX for DMCCA; tighten affiliate/discount claims; ready for unit-pricing changes.",
  },
  {
    id: 6,
    title: "EU Data Act 2025 Cloud Switching And Data Agreemen",
    category: "data-protection",
    status: "Not addressed",
    priority: "P2",
    date: "September 2025",
    flag: "🇪🇺",
    description: "Prepare for EU Data Act: update data-sharing/cloud contracts, enable at-cost switching, and implement migration/access controls.",
  },
  {
    id: 7,
    title: "Netherlands Minimum Wage Increase July 2025",
    category: "employment",
    status: "In review",
    priority: "P2",
    date: "July 2025",
    flag: "🇳🇱",
    description: "NL minimum wage is €14.40/hour from 1 Jul 2025; update payroll and agency rates, audit for back pay.",
  },
  {
    id: 8,
    title: "EU General Product Safety Regulation GPSR Complian",
    category: "product-safety",
    status: "Not addressed",
    priority: "P2",
    date: "December 2024",
    flag: "🇪🇺",
    description: "Implement EU GPSR controls for online sales: risk assessments, EU responsible person, recall remedies, Safety Gate reporting.",
  },
  {
    id: 9,
    title: "EU Green Claims Directive Status EmpCo 2024825",
    category: "sustainability",
    status: "In review",
    priority: "P3",
    date: "April 2025",
    flag: "🇪🇺",
    description: "EU green claims law paused; EmpCo applies from Sept 2026—tighten substantiation, label use and marketing claims now.",
  },
];

function KanbanView({ onSelectItem }: { onSelectItem: (id: number) => void }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {categories.map((category) => {
        const categoryItems = regulations.filter((r) => r.category === category.id);
        return (
          <div key={category.id} className="min-w-[280px] flex-shrink-0">
            <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-muted-foreground/30" />
              {category.name}
            </div>
            <div className="space-y-3">
              {categoryItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectItem(item.id)}
                  className="w-full p-3 rounded-lg border bg-card hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs",
                        item.status === "In review"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : item.status === "Not addressed"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-green-50 text-green-700 border-green-200"
                      )}
                    >
                      {item.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.date}
                    </span>
                    <Badge variant="outline" className="text-xs ml-auto">
                      {item.priority}
                    </Badge>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-base">{item.flag}</span>
                    <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DetailView({ item, onClose }: { item: typeof regulations[0]; onClose: () => void }) {
  const [progressNote, setProgressNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-y-0 right-0 w-full max-w-4xl bg-background border-l shadow-xl overflow-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <span className="text-muted-foreground">Legislation Tracker</span>
            <Button variant="ghost" size="sm">
              Close
              <X className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {item.priority}
              </Badge>
              <span className="text-lg">{item.flag}</span>
              <Badge variant="secondary" className="text-xs">
                Data Protection & Privacy
              </Badge>
            </div>
            <h1 className="text-xl font-semibold mb-2">{item.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              Implementation: {item.date}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            {item.description}
          </p>

          {/* Two column layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Left column - Tasks */}
            <div>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Suggested Tasks</CardTitle>
                    <Button variant="ghost" size="sm" className="text-primary">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Task
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {item.tasks?.map((task) => (
                    <div key={task.id} className="flex items-start gap-3 p-3 rounded-lg border">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        className="mt-1 w-4 h-4"
                        readOnly
                      />
                      <div className="flex-1">
                        <p className="text-sm">{task.text}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {task.tags.map((tag, i) => (
                            <Badge
                              key={i}
                              variant="outline"
                              className="text-xs bg-amber-50 text-amber-700 border-amber-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
                    Show all {item.tasks?.length || 0} tasks
                    <ChevronDown className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Right column - Progress */}
            <div>
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">Internal Progress</CardTitle>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700 border-blue-200"
                    >
                      {item.internalProgress || "In review"}
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">No progress updates yet</p>
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 mt-2 text-muted-foreground" />
                    <Textarea
                      placeholder="Add update or comment"
                      value={progressNote}
                      onChange={(e) => setProgressNote(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Articles and Cases */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            {/* Articles */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Articles ({item.articles?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.articles?.slice(0, 5).map((article, index) => (
                  <div key={index} className="p-3 rounded-lg border">
                    <p className="text-sm mb-2">{article.title}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Relevancy {article.relevancy}/10</span>
                        <span>›</span>
                        <a
                          href={`https://${article.source}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline flex items-center gap-1"
                        >
                          {article.source}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                    {article.relevanceNote && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Relevance: {article.relevanceNote}
                      </p>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Cases */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Gavel className="w-4 h-4" />
                  Cases ({item.cases?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {item.cases?.map((caseItem, index) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 rounded-lg border",
                      caseItem.isHighlighted && "bg-amber-50 border-amber-200"
                    )}
                  >
                    <p className={cn(
                      "text-sm mb-2",
                      caseItem.isHighlighted && "text-amber-900"
                    )}>
                      {caseItem.title}
                    </p>
                    <a
                      href={`https://${caseItem.source}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline flex items-center gap-1"
                    >
                      {caseItem.source}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Risk Register Assessment */}
          <Card className="mt-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Gavel className="w-4 h-4" />
                Risk Register Assessment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-9 gap-2">
                {Object.entries(item.riskAssessment || {}).map(([key, value]) => {
                  const labels: Record<string, string> = {
                    financial: "Financial",
                    downtime: "Downtime",
                    legalCompliance: "Legal/Compliance",
                    reputational: "Reputational",
                    customerDisruption: "Customer disruption",
                    strategic: "Strategic",
                    healthSafety: "Health & Safety",
                    esg: "ESG",
                    informationSecurity: "Information Security",
                  };
                  return (
                    <div key={key} className="text-center">
                      <p className="text-xs text-muted-foreground mb-2">{labels[key]}</p>
                      <div
                        className={cn(
                          "py-2 px-3 rounded text-sm font-medium",
                          value === null
                            ? "bg-muted text-muted-foreground"
                            : value >= 4
                            ? "bg-red-500 text-white"
                            : value >= 3
                            ? "bg-amber-500 text-white"
                            : "bg-green-500 text-white"
                        )}
                      >
                        {value === null ? "N/A" : value}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LegislationTracker() {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const selectedItem = regulations.find((r) => r.id === selectedItemId);

  return (
    <AppLayout>
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-border shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/workers/2">
                <Button variant="ghost" size="sm" className="gap-1.5 -ml-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-lg font-semibold">Legislation Tracker</h1>
                <p className="text-sm text-muted-foreground">
                  Monitoring {regulations.length} regulatory changes across jurisdictions
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search regulations..." className="pl-9 w-64" />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
              <Button variant="ghost" size="sm">
                Close
                <X className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Kanban board */}
        <div className="flex-1 overflow-auto p-4">
          <KanbanView onSelectItem={setSelectedItemId} />
        </div>

        {/* Detail panel */}
        {selectedItem && (
          <DetailView item={selectedItem} onClose={() => setSelectedItemId(null)} />
        )}
      </div>
    </AppLayout>
  );
}
