import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";
import { TrendingUp } from "lucide-react";

export default function CashFlowChart({ transactions }) {
  const getLast90DaysData = () => {
    const data = [];
    for (let i = 89; i >= 0; i -= 7) {
      const date = subDays(new Date(), i);
      const dateStr = format(date, 'yyyy-MM-dd');
      
      const weekTransactions = transactions.filter(t => {
        const transDate = new Date(t.transaction_date);
        return transDate <= date && transDate > subDays(date, 7);
      });

      const cashIn = weekTransactions
        .filter(t => t.type === 'cash_in')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const cashOut = weekTransactions
        .filter(t => t.type === 'cash_out')
        .reduce((sum, t) => sum + t.amount, 0);

      data.push({
        date: format(date, 'MMM d'),
        cashIn: Math.round(cashIn),
        cashOut: Math.round(cashOut),
      });
    }
    return data;
  };

  const chartData = getLast90DaysData();

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Cash Flow (90 Days)
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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
              dataKey="cashIn" 
              stroke="#10b981" 
              strokeWidth={3}
              name="Cash In"
              dot={{ fill: '#10b981', r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="cashOut" 
              stroke="#ef4444" 
              strokeWidth={3}
              name="Cash Out"
              dot={{ fill: '#ef4444', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}