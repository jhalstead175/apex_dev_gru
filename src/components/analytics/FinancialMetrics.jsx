import React from "react";
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, AlertTriangle, Target } from "lucide-react";

export default function FinancialMetrics({ projects, transactions, invoices }) {
  const totalRevenue = transactions
    .filter(t => t.type === 'cash_in')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'cash_out')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const overdueInvoices = invoices.filter(inv => {
    if (inv.status === 'paid') return false;
    const dueDate = new Date(inv.due_date);
    return dueDate < new Date();
  });

  const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

  const metrics = [
    {
      title: 'Total Revenue',
      value: `$${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'emerald',
      trend: '+12%'
    },
    {
      title: 'Net Profit',
      value: `$${netProfit.toLocaleString()}`,
      icon: TrendingUp,
      color: 'blue',
      trend: `${profitMargin.toFixed(1)}% margin`
    },
    {
      title: 'Overdue Invoices',
      value: overdueInvoices.length,
      icon: AlertTriangle,
      color: 'red',
      trend: `$${overdueAmount.toLocaleString()}`
    },
    {
      title: 'Total Expenses',
      value: `$${totalExpenses.toLocaleString()}`,
      icon: Target,
      color: 'purple',
      trend: 'YTD'
    },
  ];

  const colorMap = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <Card key={index} className="bg-white border-0 shadow-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className={`${colorMap[metric.color]} p-3 rounded-xl shadow-lg`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm font-medium text-slate-600 mb-1">{metric.title}</p>
            <p className="text-3xl font-bold text-[#1e3a5f] mb-2">{metric.value}</p>
            <p className="text-sm text-slate-500">{metric.trend}</p>
          </Card>
        );
      })}
    </div>
  );
}