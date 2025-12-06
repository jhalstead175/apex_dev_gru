import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList } from "recharts";
import { Users, Clock, Target } from "lucide-react";
import { differenceInDays } from "date-fns";

export default function LeadConversionReport({ leads, dateRange }) {
  const periodLeads = leads.filter(l => new Date(l.created_date) >= dateRange.start);

  // Conversion funnel
  const funnelData = [
    {
      name: 'New Leads',
      value: periodLeads.filter(l => l.stage === 'new_lead').length,
      fill: '#3b82f6'
    },
    {
      name: 'Contacted',
      value: periodLeads.filter(l => ['contacted', 'quote_sent', 'negotiation', 'closed_won'].includes(l.stage)).length,
      fill: '#8b5cf6'
    },
    {
      name: 'Quote Sent',
      value: periodLeads.filter(l => ['quote_sent', 'negotiation', 'closed_won'].includes(l.stage)).length,
      fill: '#f59e0b'
    },
    {
      name: 'Negotiation',
      value: periodLeads.filter(l => ['negotiation', 'closed_won'].includes(l.stage)).length,
      fill: '#10b981'
    },
    {
      name: 'Closed Won',
      value: periodLeads.filter(l => l.stage === 'closed_won').length,
      fill: '#059669'
    }
  ];

  // Calculate conversion rates
  const newToContacted = funnelData[0].value > 0 ? (funnelData[1].value / funnelData[0].value * 100) : 0;
  const contactedToQuote = funnelData[1].value > 0 ? (funnelData[2].value / funnelData[1].value * 100) : 0;
  const quoteToNegotiation = funnelData[2].value > 0 ? (funnelData[3].value / funnelData[2].value * 100) : 0;
  const negotiationToClose = funnelData[3].value > 0 ? (funnelData[4].value / funnelData[3].value * 100) : 0;
  const overallConversion = funnelData[0].value > 0 ? (funnelData[4].value / funnelData[0].value * 100) : 0;

  // Average time in each stage
  const avgTimeByStage = ['new_lead', 'contacted', 'quote_sent', 'negotiation'].map(stage => {
    const stageLeads = periodLeads.filter(l => l.stage === stage && l.last_contact_date);
    const avgDays = stageLeads.length > 0 
      ? stageLeads.reduce((sum, l) => {
          const created = new Date(l.created_date);
          const lastContact = new Date(l.last_contact_date);
          return sum + differenceInDays(lastContact, created);
        }, 0) / stageLeads.length
      : 0;
    
    return {
      stage: stage.replace('_', ' ').toUpperCase(),
      days: Math.round(avgDays)
    };
  });

  // Stage distribution
  const stageDistribution = ['new_lead', 'contacted', 'quote_sent', 'negotiation', 'closed_won', 'closed_lost'].map(stage => ({
    stage: stage.replace('_', ' ').toUpperCase(),
    count: periodLeads.filter(l => l.stage === stage).length,
    percentage: periodLeads.length > 0 ? (periodLeads.filter(l => l.stage === stage).length / periodLeads.length * 100) : 0
  }));

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-blue-700">Total Leads</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">{periodLeads.length}</p>
            <p className="text-xs text-blue-600 mt-1">In selected period</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-emerald-700">Conversion Rate</p>
            </div>
            <p className="text-3xl font-bold text-emerald-900">{overallConversion.toFixed(1)}%</p>
            <p className="text-xs text-emerald-600 mt-1">Lead to close rate</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-purple-700">Avg Close Time</p>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              {Math.round(avgTimeByStage.reduce((sum, s) => sum + s.days, 0))} days
            </p>
            <p className="text-xs text-purple-600 mt-1">Average sales cycle</p>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Funnel */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#1e3a5f]">
            Lead Conversion Funnel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {funnelData.map((stage, index) => {
              const prevStage = funnelData[index - 1];
              const dropoff = prevStage ? ((prevStage.value - stage.value) / prevStage.value * 100) : 0;
              
              return (
                <div key={stage.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-700">{stage.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#1e3a5f]">{stage.value}</span>
                      {index > 0 && (
                        <span className="text-sm text-red-600">
                          -{dropoff.toFixed(1)}% dropoff
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="h-12 bg-slate-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 flex items-center justify-center text-white font-bold"
                      style={{ 
                        width: `${(stage.value / funnelData[0].value) * 100}%`,
                        backgroundColor: stage.fill
                      }}
                    >
                      {stage.value > 0 && `${((stage.value / funnelData[0].value) * 100).toFixed(0)}%`}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Stage Performance */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#1e3a5f]">
              Average Time in Each Stage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={avgTimeByStage}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="stage" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip formatter={(value) => `${value} days`} />
                <Bar dataKey="days" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#1e3a5f]">
              Stage Conversion Rates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-700">New → Contacted</span>
                <span className="text-2xl font-bold text-blue-900">{newToContacted.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-purple-700">Contacted → Quote</span>
                <span className="text-2xl font-bold text-purple-900">{contactedToQuote.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-orange-700">Quote → Negotiation</span>
                <span className="text-2xl font-bold text-orange-900">{quoteToNegotiation.toFixed(1)}%</span>
              </div>
            </div>
            
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-emerald-700">Negotiation → Close</span>
                <span className="text-2xl font-bold text-emerald-900">{negotiationToClose.toFixed(1)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}