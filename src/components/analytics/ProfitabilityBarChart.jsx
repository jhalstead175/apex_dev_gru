import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";

export default function ProfitabilityBarChart({ projects }) {
  const getJobTypeData = () => {
    const jobTypes = {
      'Residential Roof': { revenue: 0, cost: 0, count: 0 },
      'Commercial Roof': { revenue: 0, cost: 0, count: 0 },
      'Repair': { revenue: 0, cost: 0, count: 0 },
    };

    projects.forEach(project => {
      let type = 'Residential Roof';
      if (project.project_name?.toLowerCase().includes('commercial')) {
        type = 'Commercial Roof';
      } else if (project.project_name?.toLowerCase().includes('repair')) {
        type = 'Repair';
      }

      jobTypes[type].revenue += project.contract_value || 0;
      jobTypes[type].cost += project.costs_to_date || 0;
      jobTypes[type].count += 1;
    });

    return Object.entries(jobTypes).map(([type, data]) => ({
      type,
      revenue: Math.round(data.revenue),
      profit: Math.round(data.revenue - data.cost),
      acv: data.count > 0 ? Math.round((data.revenue - data.cost) / data.count) : 0,
    }));
  };

  const chartData = getJobTypeData();

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#10b981]" />
          Profitability by Job Type
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="type" 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value) => `$${value.toLocaleString()}`}
            />
            <Legend />
            <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" radius={[8, 8, 0, 0]} />
            <Bar dataKey="profit" fill="#10b981" name="Profit" radius={[8, 8, 0, 0]} />
            <Bar dataKey="acv" fill="#d4af37" name="Avg. Profit/Job" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}