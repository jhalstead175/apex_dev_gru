import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DollarSign, TrendingDown, Percent } from "lucide-react";

export default function ProfitabilityReport({ projects, transactions, dateRange }) {
  // Calculate profitability metrics
  const periodProjects = projects.filter(p => 
    new Date(p.start_date) >= dateRange.start && new Date(p.start_date) <= dateRange.end
  );

  const totalRevenue = periodProjects.reduce((sum, p) => sum + (p.contract_value || 0), 0);
  const totalCosts = periodProjects.reduce((sum, p) => sum + (p.costs_to_date || 0), 0);
  const grossProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Project profitability breakdown
  const projectData = periodProjects
    .map(p => ({
      name: p.project_name.length > 20 ? p.project_name.substring(0, 20) + '...' : p.project_name,
      revenue: p.contract_value || 0,
      cost: p.costs_to_date || 0,
      profit: (p.contract_value || 0) - (p.costs_to_date || 0),
      margin: p.contract_value > 0 ? (((p.contract_value - p.costs_to_date) / p.contract_value) * 100) : 0
    }))
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 10);

  // Cost breakdown
  const costsByCategory = ['material_purchase', 'labor', 'equipment', 'overhead', 'other'].map(category => {
    const amount = transactions
      .filter(t => t.category === category && new Date(t.transaction_date) >= dateRange.start)
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      name: category.replace('_', ' ').toUpperCase(),
      value: Math.round(amount)
    };
  }).filter(c => c.value > 0);

  const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-emerald-700">Gross Profit</p>
            </div>
            <p className="text-3xl font-bold text-emerald-900">
              ${grossProfit.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Percent className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-blue-700">Profit Margin</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">
              {profitMargin.toFixed(1)}%
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500 p-2 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-purple-700">Total Revenue</p>
            </div>
            <p className="text-3xl font-bold text-purple-900">
              ${totalRevenue.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-orange-500 p-2 rounded-lg">
                <TrendingDown className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-orange-700">Total Costs</p>
            </div>
            <p className="text-3xl font-bold text-orange-900">
              ${totalCosts.toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Profitability */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#1e3a5f]">
            Top 10 Projects by Profitability
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={projectData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value / 1000}k`} />
              <YAxis type="category" dataKey="name" stroke="#64748b" style={{ fontSize: '10px' }} width={120} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
              <Bar dataKey="cost" fill="#ef4444" name="Cost" />
              <Bar dataKey="profit" fill="#10b981" name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Cost Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#1e3a5f]">
              Cost Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costsByCategory}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: $${(entry.value / 1000).toFixed(0)}k`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costsByCategory.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#1e3a5f]">
              Profitability Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-bold text-emerald-900 mb-2">Best Performing</h4>
              <p className="text-sm text-emerald-700">
                {projectData[0]?.name} with {projectData[0]?.margin.toFixed(1)}% profit margin
              </p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-bold text-blue-900 mb-2">Average Margin</h4>
              <p className="text-sm text-blue-700">
                {profitMargin.toFixed(1)}% across all projects in this period
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-bold text-purple-900 mb-2">Total Projects</h4>
              <p className="text-sm text-purple-700">
                {periodProjects.length} projects analyzed in selected period
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}