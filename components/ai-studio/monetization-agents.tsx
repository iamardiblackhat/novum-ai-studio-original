"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { runChatStream } from "@/lib/run-chat";
import { toast } from "sonner";
import { Copy, Sparkles, Loader2, DollarSign, Target, Send, Calendar, CheckCircle2, Bot, ArrowRight, ShieldCheck } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GeneratedItem {
  id: string;
  type: string;
  title: string;
  content: string;
  timestamp: string;
  badge: string;
}

export function MonetizationAgents() {
  const [goal, setGoal] = useState("Selling autonomous agent deployments & persistent memory workflows to UK & EU SMBs");
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [items, setItems] = useState<GeneratedItem[]>([
    {
      id: "preset-1",
      type: "offers",
      title: "Service Package Tiers",
      badge: "High-Ticket Retainer",
      timestamp: "Default Spec",
      content: `1. Autonomous Operations Sprint (£3,500 one-off)
   • 7-day deployment of 2 custom role-based agents (Research + Outreach)
   • Local Ollama / Private cloud setup + persistent memory integration
   • 30-day post-launch support and telemetry dashboard

2. Dedicated Autonomous Agent Fleet (£1,800/mo retainer)
   • Continuous self-governing agents handling customer triage & lead scoring
   • Weekly fine-tuning, memory compaction, and guardrail audits
   • SLA guarantee with <100ms response fallback

3. Bespoke Executive Agent OS (£7,500 setup + £2,200/mo)
   • Full ARDI-standard domain-contained autonomous studio for executive leadership
   • Complete IP ownership, zero external vendor lock-in`,
    },
    {
      id: "preset-2",
      type: "positioning",
      title: "Executive Positioning & Hero Angle",
      badge: "Conversion Copy",
      timestamp: "Default Spec",
      content: `Stop paying subscriptions for AI chatbots that forget your business every time you close the tab.

We engineer self-hosted, private autonomous agent systems with verified long-term memory. They learn your workflows, protect your proprietary data, and execute multi-step operations 24/7 without context loss.`,
    },
  ]);

  const addItem = (type: string, title: string, badge: string, content: string) => {
    const newItem: GeneratedItem = {
      id: Date.now().toString() + Math.random().toString(36).substring(4),
      type,
      title,
      badge,
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setItems((prev) => [newItem, ...prev]);
    return newItem;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const runMonetizationStep = async (stepName: string, prompt: string) => {
    setCurrentStep(stepName);
    const result = await runChatStream({
      model: "qwen-large",
      messages: [
        {
          role: "system",
          content:
            "You are an elite, top-tier commercial strategist and monetization architect for high-ticket autonomous AI agent agencies. Output structured, punchy, commercially ruthless copy with realistic GBP/EUR pricing, concrete deliverables, and zero generic fluff.",
        },
        { role: "user", content: prompt },
      ],
    });
    return result.trim();
  };

  const handleRun = async () => {
    if (!goal.trim()) {
      toast.error("Please describe what agency service or agent product you want to monetize");
      return;
    }

    setIsRunning(true);

    try {
      // Step 1: High-ticket Service Offers
      toast.info("Generating high-converting offer tiers...");
      const offers = await runMonetizationStep(
        "Offer Architect",
        `Goal: ${goal}\n\nDesign 3 compelling, crystal-clear service packages (Entry, Growth, Enterprise). For each: Name, Target Buyer, Key Deliverables, Realistic Pricing (in GBP/EUR), and Value Guarantee.`
      );
      addItem("offers", "Commercial Service Packages", "Priced Tiers", offers);

      // Step 2: Pitch & Positioning
      toast.info("Synthesizing executive positioning...");
      const positioning = await runMonetizationStep(
        "Positioning Strategist",
        `Based on these offers:\n${offers}\n\nWrite a lethal 3-part positioning statement: 1) The Expensive Problem, 2) The Private Autonomous Agent Solution, 3) The Risk-Free Guarantee.`
      );
      addItem("positioning", "Executive Win Narrative", "Positioning", positioning);

      // Step 3: Social & Outbound Acquisition
      toast.info("Drafting outreach & authority campaign...");
      const contentIdeas = await runMonetizationStep(
        "Growth Specialist",
        `Goal: ${goal}\n\nCreate:\n1. Two high-converting cold email outreach templates targeting CEOs/COOs.\n2. A 4-part viral LinkedIn/X hook sequence demonstrating autonomous agent ROI without buzzwords.`
      );
      addItem("content", "Client Acquisition Engine", "Outbound & Social", contentIdeas);

      // Step 4: 14-Day Sprint
      toast.info("Building 14-day execution plan...");
      const plan = await runMonetizationStep(
        "Operations Planner",
        `Create a tactical 14-day day-by-day roadmap to land the first 3 clients for: ${goal}. Include daily high-impact actions.`
      );
      addItem("plan", "14-Day Client Acquisition Sprint", "Action Plan", plan);

      toast.success("Monetization Engine completed successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error("Monetization generation failed: " + (error.message || "Unknown error"));
    } finally {
      setIsRunning(false);
      setCurrentStep("");
    }
  };

  return (
    <div className="flex flex-col h-full gap-5 p-2 overflow-hidden">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-xl border bg-gradient-to-r from-emerald-500/10 via-background to-cyan-500/10 backdrop-blur-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <DollarSign className="h-4 w-4" />
            </div>
            <h2 className="text-xl font-bold tracking-tight">Monetization & Commercial Strategy Engine</h2>
            <Badge variant="outline" className="text-emerald-400 border-emerald-500/40 text-[10px] uppercase font-mono">
              Agency Suite
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Generate high-ticket commercial packages, client proposals, outbound sequences, and pricing architectures for selling autonomous agent systems.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Uses configured local or cloud LLM endpoints</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 min-h-0">
        {/* Left Column: Input and Triggers */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <Card className="flex flex-col flex-1 border shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                Target Agency Service / Client Objective
              </CardTitle>
              <CardDescription className="text-xs">
                Specify your agent capability or client offer focus to generate a full commercial kit.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 flex flex-col flex-1 gap-4">
              <Textarea
                placeholder="e.g. Selling custom multi-agent customer onboarding and compliance verification workflows to UK financial advisors..."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="flex-1 min-h-[140px] text-xs resize-none leading-relaxed"
                disabled={isRunning}
              />

              <div className="space-y-2">
                <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Quick Focus Presets:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Private Agent Fleet for Law Firms",
                    "Autonomous Customer Care with AgentMemory",
                    "Cold Lead Generation Agent System",
                    "Autonomous Video Production Agency",
                  ].map((preset) => (
                    <Button
                      key={preset}
                      variant="outline"
                      size="sm"
                      className="text-[11px] h-7 px-2.5 rounded-full"
                      onClick={() => setGoal(preset)}
                      disabled={isRunning}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t mt-auto">
                <Button
                  onClick={handleRun}
                  disabled={isRunning || !goal.trim()}
                  className="w-full gap-2 font-semibold shadow-md bg-emerald-600 hover:bg-emerald-500 text-white"
                >
                  {isRunning ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Running {currentStep}...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate Monetization Package
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Generated Commercial Deliverables */}
        <div className="lg:col-span-7 flex flex-col min-h-0">
          <Card className="flex flex-col flex-1 border shadow-sm overflow-hidden">
            <CardHeader className="py-3 px-4 border-b bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Bot className="h-4 w-4 text-emerald-400" />
                  Commercial Assets & Playbooks
                </CardTitle>
                <CardDescription className="text-xs">
                  {items.length} active strategy components ready for client deployment.
                </CardDescription>
              </div>
              {items.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setItems([])}
                  className="text-xs h-7 text-muted-foreground"
                >
                  Clear All
                </Button>
              )}
            </CardHeader>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="border border-border/70 shadow-sm bg-card/60 backdrop-blur-sm">
                    <div className="p-3 border-b flex items-center justify-between bg-muted/30">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs tracking-tight">{item.title}</span>
                        <Badge variant="secondary" className="text-[10px] px-2 py-0.5">
                          {item.badge}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">{item.timestamp}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => copyToClipboard(item.content)}
                          title="Copy to clipboard"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 text-xs font-mono whitespace-pre-wrap leading-relaxed text-foreground/90 select-text">
                      {item.content}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
}
