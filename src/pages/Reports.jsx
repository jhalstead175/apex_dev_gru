
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Download,
  Calendar,
  Sparkles,
  Loader2,
  Activity, // Added new icon
  Target // Added new icon
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

import SalesPerformanceReport from "../components/reports/SalesPerformanceReport";
import ProfitabilityReport from "../components/reports/ProfitabilityReport";
import LeadConversionReport from "../components/reports/LeadConversionReport";
import ResourceUtilizationReport from "../components/reports/ResourceUtilizationReport";
import ProjectCompletionChart from "../components/reports/ProjectCompletionChart"; // Added new report component
import AgentPerformanceMetrics from "../components/reports/AgentPerformanceMetrics"; // Added new report component
import ClientEngagementMetrics from "../components/reports/ClientEngagementMetrics"; // Added new report component
import AIInsightsPanel from "../components/reports/AIInsightsPanel";

export default function Reports() {
  const [reportType, setReportType] = useState('sales_performance');
  const [dateRange, setDateRange] = useState('last_30_days');
  const [projectTypeFilter, setProjectTypeFilter] = useState('all'); // Added new state for project type filter
  const [aiInsights, setAiInsights] = useState(null);
  const [showAIPanel, setShowAIPanel] = useState(false);

  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list(),
    initialData: [],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: [],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-transaction_date'),
    initialData: [],
  });

  const { data: quotes = [] } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => base44.entities.Quote.list('-created_date'),
    initialData: [],
  });

  // Added new useQuery hooks for additional data
  const { data: messages = [] } = useQuery({
    queryKey: ['messages'],
    queryFn: () => base44.entities.Message.list(),
    initialData: [],
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: () => base44.entities.Document.list(),
    initialData: [],
  });

  const { data: feedback = [] } = useQuery({
    queryKey: ['feedback'],
    queryFn: () => base44.entities.ClientFeedback.list(),
    initialData: [],
  });

  const generateAIInsightsMutation = useMutation({
    mutationFn: async () => {
      const insights = await base44.integrations.Core.InvokeLLM({
        // Updated company name in prompt
        prompt: `You are a business intelligence analyst for Apex Construction Group, a roofing and building envelope company.

Analyze the following business data and provide actionable insights:

LEADS DATA:
- Total Leads: ${leads.length}
- New Leads: ${leads.filter(l => l.stage === 'new_lead').length}
- Contacted: ${leads.filter(l => l.stage === 'contacted').length}
- Quote Sent: ${leads.filter(l => l.stage === 'quote_sent').length}
- Negotiation: ${leads.filter(l => l.stage === 'negotiation').length}
- Closed Won: ${leads.filter(l => l.stage === 'closed_won').length}
- Closed Lost: ${leads.filter(l => l.stage === 'closed_lost').length}

PROJECTS DATA:
- Total Projects: ${projects.length}
- Active Projects: ${projects.filter(p => p.status === 'in_progress').length}
- Completed Projects: ${projects.filter(p => p.status === 'completed').length}
- Total Contract Value: $${projects.reduce((sum, p) => sum + (p.contract_value || 0), 0).toLocaleString()}
- Average Project Value: $${Math.round(projects.reduce((sum, p) => sum + (p.contract_value || 0), 0) / projects.length || 0).toLocaleString()}

FINANCIAL DATA:
- Total Revenue: $${transactions.filter(t => t.type === 'cash_in').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
- Total Expenses: $${transactions.filter(t => t.type === 'cash_out').reduce((sum, t) => sum + t.amount, 0).toLocaleString()}
- Net Profit: $${(transactions.filter(t => t.type === 'cash_in').reduce((sum, t) => sum + t.amount, 0) - transactions.filter(t => t.type === 'cash_out').reduce((sum, t) => sum + t.amount, 0)).toLocaleString()}

CONVERSION METRICS:
- Lead-to-Customer Conversion Rate: ${leads.length > 0 ? ((leads.filter(l => l.stage === 'closed_won').length / leads.length) * 100).toFixed(1) : 0}%
- Quote-to-Close Rate: ${leads.filter(l => l.stage === 'quote_sent' || l.stage === 'negotiation' || l.stage === 'closed_won').length > 0 ? ((leads.filter(l => l.stage === 'closed_won').length / leads.filter(l => l.stage === 'quote_sent' || l.stage === 'negotiation' || l.stage === 'closed_won').length) * 100).toFixed(1) : 0}%

Provide comprehensive insights including:
1. Overall business health assessment
2. Top 3 strengths
3. Top 3 areas for improvement
4. Specific actionable recommendations
5. Revenue growth opportunities
6. Operational efficiency suggestions
7. Market positioning insights`,
        response_json_schema: {
          type: "object",
          properties: {
            overall_health: {
              type: "string",
              enum: ["excellent", "good", "fair", "needs_attention"]
            },
            health_score: {
              type: "number",
              description: "Score from 0-100"
            },
            executive_summary: {
              type: "string"
            },
            strengths: {
              type: "array",
              items: { type: "string" },
              minItems: 3,
              maxItems: 3
            },
            areas_for_improvement: {
              type: "array",
              items: { type: "string" },
              minItems: 3,
              maxItems: 3
            },
            actionable_recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  category: { type: "string" },
                  recommendation: { type: "string" },
                  priority: { type: "string", enum: ["high", "medium", "low"] },
                  impact: { type: "string" }
                }
              }
            },
            revenue_opportunities: {
              type: "array",
              items: { type: "string" }
            },
            efficiency_suggestions: {
              type: "array",
              items: { type: "string" }
            },
            key_metrics_forecast: {
              type: "object",
              properties: {
                projected_monthly_revenue: { type: "number" },
                projected_conversion_rate: { type: "number" },
                recommended_sales_goals: { type: "string" }
              }
            }
          }
        }
      });

      return insights;
    },
    onSuccess: (data) => {
      setAiInsights(data);
      setShowAIPanel(true);
    },
  });

  const getDateRangeFilter = () => {
    const now = new Date();
    switch (dateRange) {
      case 'last_7_days':
        return { start: subDays(now, 7), end: now };
      case 'last_30_days':
        return { start: subDays(now, 30), end: now };
      case 'last_90_days':
        return { start: subDays(now, 90), end: now };
      case 'this_month':
        return { start: startOfMonth(now), end: endOfMonth(now) };
      case 'all_time':
        return { start: new Date(2020, 0, 1), end: now };
      default:
        return { start: subDays(now, 30), end: now };
    }
  };

  const dateFilter = getDateRangeFilter();

  // Filter projects and leads based on projectTypeFilter
  const filteredProjects = projectTypeFilter === 'all' 
    ? projects 
    : projects.filter(p => {
        const lead = leads.find(l => l.id === p.lead_id);
        return lead?.material_type === projectTypeFilter;
      });

  const filteredLeads = projectTypeFilter === 'all'
    ? leads
    : leads.filter(l => l.material_type === projectTypeFilter);

  // Updated reportComponents mapping to include new reports and use filtered data
  const reportComponents = {
    sales_performance: SalesPerformanceReport,
    profitability: ProfitabilityReport,
    lead_conversion: LeadConversionReport,
    resource_utilization: ResourceUtilizationReport,
    project_completion: () => <ProjectCompletionChart projects={filteredProjects} dateRange={dateFilter} />,
    agent_performance: () => <AgentPerformanceMetrics projects={filteredProjects} feedback={feedback} />,
    client_engagement: () => <ClientEngagementMetrics projects={filteredProjects} messages={messages} documents={documents} />
  };

  const ReportComponent = reportComponents[reportType];

  return (
    <div className="space-y-6">
      {/* Header - Updated styling and title */}
      <div className="bg-gradient-to-r from-[#0b1d3a] to-[#1a3355] rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#c8a559] to-[#d4af37] p-3 rounded-xl shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                Advanced Analytics & Reports
              </h1>
              <p className="text-[#c8a559] text-lg">
                Data-driven insights for smarter decisions
              </p>
            </div>
          </div>

          <Button
            onClick={() => generateAIInsightsMutation.mutate()}
            disabled={generateAIInsightsMutation.isPending}
            className="bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a] shadow-lg font-bold"
          >
            {generateAIInsightsMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate AI Insights
              </>
            )}
          </Button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {showAIPanel && aiInsights && (
        <AIInsightsPanel insights={aiInsights} onClose={() => setShowAIPanel(false)} />
      )}

      {/* Report Controls - Updated grid, added project type filter, updated export button */}
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4"> {/* Changed to 4 columns */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Report Type
              </label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales_performance">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Sales Performance
                    </div>
                  </SelectItem>
                  <SelectItem value="profitability">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Profitability Analysis
                    </div>
                  </SelectItem>
                  <SelectItem value="lead_conversion">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Lead Conversion
                    </div>
                  </SelectItem>
                  <SelectItem value="resource_utilization">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Resource Utilization
                    </div>
                  </SelectItem>
                  {/* Added new report types */}
                  <SelectItem value="project_completion">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Project Completion Trends
                    </div>
                  </SelectItem>
                  <SelectItem value="agent_performance">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Agent Performance
                    </div>
                  </SelectItem>
                  <SelectItem value="client_engagement">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Client Engagement
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Date Range
              </label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                  <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                  <SelectItem value="last_90_days">Last 90 Days</SelectItem>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="all_time">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Added Project Type Filter */}
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Project Type
              </label>
              <Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="asphalt_shingles">Asphalt Shingles</SelectItem>
                  <SelectItem value="metal_roofing">Metal Roofing</SelectItem>
                  <SelectItem value="tile">Tile</SelectItem>
                  <SelectItem value="slate">Slate</SelectItem>
                  <SelectItem value="wood_shakes">Wood Shakes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button variant="outline" className="w-full border-[#c8a559] text-[#c8a559] hover:bg-[#c8a559]/10">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>
              Showing data from {format(dateFilter.start, 'MMM d, yyyy')} to{' '}
              {format(dateFilter.end, 'MMM d, yyyy')}
            </span>
            {projectTypeFilter !== 'all' && ( // Conditionally display project type filter
              <span className="ml-2">
                • Filtered by: <strong>{projectTypeFilter.replace('_', ' ')}</strong>
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Report Content - Updated rendering logic for new report components */}
      {ReportComponent && (
        // Check if the current report component is one of the new ones that are functions
        typeof ReportComponent === 'function' && 
        (reportType.includes('project_completion') || reportType.includes('agent_') || reportType.includes('client_')) ? (
          <ReportComponent /> // Call the function to render the component
        ) : (
          <ReportComponent
            leads={filteredLeads} // Pass filtered leads
            projects={filteredProjects} // Pass filtered projects
            transactions={transactions}
            quotes={quotes}
            dateRange={dateFilter}
          />
        )
      )}
    </div>
  );
}
