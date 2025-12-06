import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, addDays } from "date-fns";
import { TrendingUp } from "lucide-react";

export default function CashFlowForecast({ transactions, invoices }) {
  const getForecastData = () => {
    const data = [];
    const today = new Date();

    // Get historical average
    const avgDailyCashIn = transactions
      .filter(t => t.type === 'cash_in')
      .reduce((sum, t) => sum + t.amount, 0) / 90;

    const avgDailyCashOut = transactions
      .filter(t => t.type === 'cash_out')
      .reduce((sum, t) => sum + t.amount, 0) / 90;

    // Project next 60 days
    for (let i = 0; i < 60; i += 5) {
      const date = addDays(today, i);
      const dateStr = format(date, 'MMM d');

      // Check for scheduled invoices
      const scheduledPayments = invoices
        .filter(inv => {
          const dueDate = new Date(inv.due_date);
          return dueDate >= date && dueDate < addDays(date, 5) && inv.status !== 'paid';
        })
        .reduce((sum, inv) => sum + inv.amount, 0);

      const projectedCashIn = Math.round(avgDailyCashIn * 5 + scheduledPayments);
      const projectedCashOut = Math.round(avgDailyCashOut * 5);

      data.push({
        date: dateStr,
        projected_in: projectedCashIn,
        projected_out: projectedCashOut,
      });
    }

    return data;
  };

  const forecastData = getForecastData();

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-[#1e3a5f] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          60-Day Cash Flow Forecast
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={forecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
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
            <Line 
              type="monotone" 
              dataKey="projected_in" 
              stroke="#10b981" 
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Projected Cash In"
              dot={{ fill: '#10b981', r: 3 }}
            />
            <Line 
              type="monotone" 
              dataKey="projected_out" 
              stroke="#ef4444" 
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Projected Cash Out"
              dot={{ fill: '#ef4444', r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}