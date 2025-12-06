import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { TrendingUp, DollarSign, Target, Activity, Zap, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createPageUrl } from "@/utils";

import CashFlowChart from "../components/dashboard/CashFlowChart";
import ACVGauge from "../components/dashboard/ACVGauge";
import LeadFunnelWidget from "../components/dashboard/LeadFunnelWidget";
import ProjectHealthGrid from "../components/dashboard/ProjectHealthGrid";
import StatCard from "../components/dashboard/StatCard";

export default function Dashboard() {
  const [salesInsights, setSalesInsights] = React.useState(null);
  const [showInsights, setShowInsights] = React.useState(false);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const userData = await base44.auth.me();
        return userData;
      } catch (error) {
        base44.auth.redirectToLogin(createPageUrl('Dashboard'));
        return null;
      }
    },
    retry: false,
  });

  React.useEffect(() => {
    if (!userLoading && !user) {
      base44.auth.redirectToLogin(createPageUrl('Dashboard'));
    }
  }, [user, userLoading]);

  const { data: leads = [] } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list(),
    initialData: [],
    enabled: !!user && (user.role === 'owner' || user.role === 'manager')
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list(),
    initialData: [],
    enabled: !!user && (user.role === 'owner' || user.role === 'manager')
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: () => base44.entities.Transaction.list('-transaction_date'),
    initialData: [],
    enabled: !!user && (user.role === 'owner' || user.role === 'manager')
  });

  // Check for notification triggers on mount
  const checkNotificationsMutation = useMutation({
    mutationFn: async () => {
      return await base44.functions.invoke('clientNotifications', {
        action: 'check_notifications'
      });
    },
  });

  // Process automated follow-ups
  const processFollowupsMutation = useMutation({
    mutationFn: async () => {
      return await base44.functions.invoke('salesAutomation', {
        action: 'process_followups'
      });
    },
  });

  // Get sales insights
  const getSalesInsightsMutation = useMutation({
    mutationFn: async () => {
      return await base44.functions.invoke('salesAutomation', {
        action: 'get_sales_insights'
      });
    },
    onSuccess: (response) => {
      setSalesInsights(response.data.insights);
      setShowInsights(true);
    },
  });

  React.useEffect(() => {
    if (user && (user.role === 'owner' || user.role === 'manager')) {
      // Check for pending notifications when dashboard loads
      checkNotificationsMutation.mutate();
      
      // Process automated follow-ups (runs daily)
      const lastFollowupCheck = localStorage.getItem('lastFollowupCheck');
      const today = new Date().toDateString();
      
      if (lastFollowupCheck !== today) {
        processFollowupsMutation.mutate();
        localStorage.setItem('lastFollowupCheck', today);
      }
    }
  }, [user]);

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#10b981] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const totalRevenue = transactions
    .filter(t => t.type === 'cash_in')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a85] rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-emerald-300 text-lg">
              Here's what's happening with your business today
            </p>
          </div>
          {(user.role === 'owner' || user.role === 'manager') && (
            <Button
              onClick={() => getSalesInsightsMutation.mutate()}
              disabled={getSalesInsightsMutation.isPending}
              className="bg-[#10b981] hover:bg-[#059669] shadow-lg"
            >
              <Zap className="w-5 h-5 mr-2" />
              {getSalesInsightsMutation.isPending ? 'Analyzing...' : 'Get Sales Insights'}
            </Button>
          )}
        </div>
      </div>

      {/* Sales Insights Panel */}
      {showInsights && salesInsights && (
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200 shadow-xl">
          <CardHeader className="border-b border-orange-200">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-bold text-orange-900 flex items-center gap-2">
                <Zap className="w-6 h-6 text-orange-600" />
                AI Sales Intelligence
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowInsights(false)}
                className="text-orange-700"
              >
                Dismiss
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Urgent Leads */}
            {salesInsights.urgentLeads.length > 0 && (
              <div className="bg-white rounded-lg p-4 border-2 border-red-200">
                <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Urgent High-Value Leads ({salesInsights.urgentLeads.length})
                </h4>
                <div className="space-y-2">
                  {salesInsights.urgentLeads.slice(0, 3).map((lead, idx) => (
                    <div key={idx} className="bg-red-50 rounded p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-red-900">{lead.clientName}</span>
                        <Badge className="bg-red-600 text-white">${lead.quoteValue.toLocaleString()}</Badge>
                      </div>
                      <p className="text-red-700 text-xs">{lead.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stagnant Leads */}
            {salesInsights.stagnantLeads.length > 0 && (
              <div className="bg-white rounded-lg p-4 border-2 border-yellow-200">
                <h4 className="font-bold text-yellow-900 mb-3">
                  Stagnant Leads Needing Attention ({salesInsights.stagnantLeads.length})
                </h4>
                <div className="space-y-2">
                  {salesInsights.stagnantLeads.slice(0, 3).map((lead, idx) => (
                    <div key={idx} className="bg-yellow-50 rounded p-3 text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-yellow-900">{lead.clientName}</span>
                        <span className="text-xs text-yellow-700">{lead.daysInPipeline} days</span>
                      </div>
                      <p className="text-yellow-700 text-xs">{lead.recommendation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {salesInsights.recommendations.length > 0 && (
              <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
                <h4 className="font-bold text-blue-900 mb-3">Strategic Recommendations</h4>
                <div className="space-y-3">
                  {salesInsights.recommendations.map((rec, idx) => (
                    <div key={idx} className="bg-blue-50 rounded p-3">
                      <div className="flex items-start gap-2">
                        <Badge className={`${rec.priority === 'high' ? 'bg-red-500' : 'bg-blue-500'} text-white text-xs`}>
                          {rec.priority.toUpperCase()}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-bold text-blue-900 text-sm">{rec.category}</p>
                          <p className="text-blue-700 text-xs mt-1">{rec.action}</p>
                          <p className="text-blue-600 text-xs mt-1 italic">→ {rec.suggestion}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversion Metrics */}
            <div className="bg-white rounded-lg p-4 border-2 border-emerald-200">
              <h4 className="font-bold text-emerald-900 mb-3">Pipeline Metrics</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{salesInsights.conversionMetrics.totalLeads}</p>
                  <p className="text-xs text-emerald-700">Total Leads</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{salesInsights.conversionMetrics.conversionRate}</p>
                  <p className="text-xs text-emerald-700">Conversion Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">
                    ${Math.round(salesInsights.conversionMetrics.averageQuoteValue / 1000)}k
                  </p>
                  <p className="text-xs text-emerald-700">Avg Quote Value</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-600">{salesInsights.highValueLeads.length}</p>
                  <p className="text-xs text-emerald-700">High-Value Leads</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Projects"
          value={activeProjects}
          icon={Activity}
          color="emerald"
          trend="+12%"
        />
        <StatCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          color="blue"
          trend="+8%"
        />
        <StatCard
          title="Active Leads"
          value={leads.filter(l => l.stage !== 'closed_won' && l.stage !== 'closed_lost').length}
          icon={Target}
          color="purple"
          trend="+15%"
        />
        <StatCard
          title="Conversion Rate"
          value="32%"
          icon={TrendingUp}
          color="gold"
          trend="+5%"
        />
      </div>

      {/* Main Dashboard Widgets */}
      <div className="grid lg:grid-cols-2 gap-6">
        <CashFlowChart transactions={transactions} />
        <ACVGauge projects={projects} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <LeadFunnelWidget leads={leads} />
        <ProjectHealthGrid projects={projects} />
      </div>
    </div>
  );
}