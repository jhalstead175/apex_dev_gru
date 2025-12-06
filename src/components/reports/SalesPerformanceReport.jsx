import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Target, Award } from "lucide-react";
import { format, eachMonthOfInterval, startOfMonth, isSameMonth } from "date-fns";

export default function SalesPerformanceReport({ leads, projects, transactions, dateRange }) {
  // Calculate sales metrics
  const totalRevenue = transactions
    .filter(t => t.type === 'cash_in' && new Date(t.transaction_date) >= dateRange.start)
    .reduce((sum, t) => sum + t.amount, 0);

  const periodLeads = leads.filter(l => new Date(l.created_date) >= dateRange.start);
  const closedWon = periodLeads.filter(l => l.stage === 'closed_won').length;
  const conversionRate = periodLeads.length > 0 ? (closedWon / periodLeads.length) * 100 : 0;

  const averageDealSize = closedWon > 0 ? totalRevenue / closedWon : 0;

  // Monthly revenue trend
  const months = eachMonthOfInterval({ start: dateRange.start, end: dateRange.end });
  const revenueByMonth = months.map(month => {
    const monthRevenue = transactions
      .filter(t => t.type === 'cash_in' && isSameMonth(new Date(t.transaction_date), month))
      .reduce((sum, t) => sum + t.amount, 0);
    
    const monthLeads = leads.filter(l => isSameMonth(new Date(l.created_date), month));
    const monthClosed = monthLeads.filter(l => l.stage === 'closed_won').length;
    
    return {
      month: format(month, 'MMM yyyy'),
      revenue: Math.round(monthRevenue),
      deals: monthClosed,
      leads: monthLeads.length
    };
  });

  // Sales by source
  const sourceData = ['website', 'referral', 'social_media', 'phone', 'other'].map(source => {
    const sourceLeads = periodLeads.filter(l => l.source === source);
    const sourceClosed = sourceLeads.filter(l => l.stage === 'closed_won').length;
    const sourceRevenue = sourceClosed > 0 
      ? projects
          .filter(p => sourceLeads.some(l => l.id === p.lead_id))
          .reduce((sum, p) => sum + (p.contract_value || 0), 0)
      : 0;
    
    return {
      source: source.replace('_', ' ').toUpperCase(),
      leads: sourceLeads.length,
      closed: sourceClosed,
      revenue: Math.round(sourceRevenue)
    };
  });

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-emerald-700">Total Revenue</p>
            </div>
            <p className="text-3xl font-bold text-emerald-900">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-emerald-600 mt-1">In selected period</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Target className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-blue-700">Conversion Rate</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {conversionRate.toFixed(1)}%
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {closedWon} of {periodLeads.length} leads closed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Award className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-purple-700">Avg Deal Size</p>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              ${Math.round(averageDealSize).toLocaleString()}
            </p>
            <p className="text-xs text-purple-600 mt-1">Per closed deal</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Trend */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#1e3a5f]">
            Revenue & Deals Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value / 1000}k`} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} name="Revenue" />
              <Line type="monotone" dataKey="deals" stroke="#3b82f6" strokeWidth={3} name="Deals Closed" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sales by Source */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#1e3a5f]">
            Performance by Lead Source
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sourceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="source" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="leads" fill="#8b5cf6" name="Total Leads" radius={[8, 8, 0, 0]} />
              <Bar dataKey="closed" fill="#10b981" name="Closed Deals" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}