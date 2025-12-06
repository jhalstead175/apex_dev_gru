import React, { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, Users, Briefcase, Share2, TrendingUp, Search, ExternalLink, Shield, AlertCircle } from "lucide-react";
import { createPageUrl } from "@/utils";

export default function AIAgents() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const userData = await base44.auth.me();
        return userData;
      } catch (error) {
        base44.auth.redirectToLogin(createPageUrl('AIAgents'));
        return null;
      }
    },
    retry: false,
  });

  useEffect(() => {
    if (user && user.role !== 'owner') {
      // Redirect non-owners
      window.location.href = createPageUrl('Dashboard');
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Bot className="w-16 h-16 text-[#10b981] mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Loading AI Agents...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'owner') {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Access Denied
            </h3>
            <p className="text-slate-600">
              This page is only accessible to company owners.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const agents = [
    {
      name: "Lead Nurturing Agent",
      agent_name: "lead_nurturing",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      description: "Automates initial lead interactions, qualifies prospects, and answers common questions before sales handoff.",
      capabilities: [
        "Qualify and score leads automatically",
        "Answer FAQs about services",
        "Gather detailed contact information",
        "Schedule consultations",
        "Move qualified leads through pipeline"
      ]
    },
    {
      name: "Project Oversight Agent",
      agent_name: "project_oversight",
      icon: Briefcase,
      color: "from-emerald-500 to-emerald-600",
      description: "Internal tool for project managers to analyze project health, track costs, and get actionable insights.",
      capabilities: [
        "Comprehensive project status summaries",
        "Identify projects at risk or delayed",
        "Financial analysis and cost tracking",
        "Milestone tracking and completion rates",
        "Generate actionable recommendations"
      ]
    },
    {
      name: "Social Media Manager",
      agent_name: "social_media_manager",
      icon: Share2,
      color: "from-purple-500 to-purple-600",
      description: "Creates platform-optimized content for Facebook, Instagram, and LinkedIn based on projects and trends.",
      capabilities: [
        "Generate engaging social posts",
        "Platform-specific optimization",
        "Content calendar management",
        "Seasonal topic suggestions",
        "Hashtag recommendations"
      ]
    },
    {
      name: "Sales Workflow Automation",
      agent_name: "sales_workflow_automation",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      description: "Analyzes lead progression, identifies bottlenecks, and recommends optimal next actions for sales.",
      capabilities: [
        "Lead stage progression analysis",
        "Identify stuck or stagnant leads",
        "Conversion rate optimization",
        "Automated follow-up sequences",
        "Sales performance insights"
      ]
    },
    {
      name: "SEO Strategist",
      agent_name: "seo_strategist",
      icon: Search,
      color: "from-indigo-500 to-indigo-600",
      description: "Provides SEO strategy, keyword research, content optimization, and local SEO guidance.",
      capabilities: [
        "Keyword research and analysis",
        "Content SEO optimization",
        "Local SEO strategies",
        "Competitor analysis",
        "Blog topic generation"
      ]
    }
  ];

  const getWhatsAppURL = (agentName) => {
    return base44.agents.getWhatsAppConnectURL(agentName);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a85] rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-gradient-to-br from-[#d4af37] to-[#b8941f] p-3 rounded-xl shadow-lg">
            <Bot className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              AI Agents Management
            </h1>
            <p className="text-emerald-300 text-lg">
              Access and configure your AI-powered business agents
            </p>
          </div>
        </div>
        <div className="mt-4 bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-300 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-100 text-sm font-medium">Owner-Only Access</p>
            <p className="text-yellow-200 text-xs mt-1">
              This page is only accessible to company owners. Agents can be accessed via WhatsApp or the dashboard.
            </p>
          </div>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {agents.map((agent) => {
          const Icon = agent.icon;
          return (
            <Card key={agent.agent_name} className="bg-white border-0 shadow-lg hover:shadow-xl transition-all">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className={`bg-gradient-to-br ${agent.color} p-3 rounded-xl shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <CardTitle className="text-xl font-bold text-[#1e3a5f]">
                  {agent.name}
                </CardTitle>
                <p className="text-sm text-slate-600 mt-2">
                  {agent.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Capabilities */}
                <div>
                  <h4 className="font-semibold text-sm text-slate-700 mb-2">Key Capabilities:</h4>
                  <ul className="space-y-1">
                    {agent.capabilities.map((capability, idx) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{capability}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t space-y-2">
                  <a
                    href={getWhatsAppURL(agent.agent_name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Connect via WhatsApp
                    </Button>
                  </a>
                  <p className="text-xs text-slate-500 text-center">
                    Access this agent directly through WhatsApp messaging
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Usage Instructions */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#1e3a5f]">
            How to Use AI Agents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
              1
            </div>
            <div>
              <p className="font-semibold text-blue-900">Connect via WhatsApp</p>
              <p className="text-slate-600">Click "Connect via WhatsApp" on any agent to start a conversation. You'll be redirected to authenticate if needed.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
              2
            </div>
            <div>
              <p className="font-semibold text-blue-900">Ask Questions</p>
              <p className="text-slate-600">Each agent is specialized for specific tasks. Ask questions, request analysis, or get recommendations based on their capabilities.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
              3
            </div>
            <div>
              <p className="font-semibold text-blue-900">Get Real-Time Insights</p>
              <p className="text-slate-600">Agents have access to your business data (leads, projects, etc.) and can provide instant analysis and actionable recommendations.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}