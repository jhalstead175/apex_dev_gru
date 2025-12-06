import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { TrendingUp, DollarSign, AlertCircle } from "lucide-react";

import ProfitabilityBarChart from "../components/analytics/ProfitabilityBarChart";
import CashFlowForecast from "../components/analytics/CashFlowForecast";
import RecentInvoicesTable from "../components/analytics/RecentInvoicesTable";
import FinancialMetrics from "../components/analytics/FinancialMetrics";

export default function Analytics() {
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

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => base44.entities.Invoice.list('-created_date'),
    initialData: [],
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a85] rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#d4af37] to-[#b8941f] p-3 rounded-xl shadow-lg">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Financial Analytics
            </h1>
            <p className="text-emerald-300 text-lg">
              Deep dive into your business performance
            </p>
          </div>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <FinancialMetrics 
        projects={projects}
        transactions={transactions}
        invoices={invoices}
      />

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <ProfitabilityBarChart projects={projects} />
        <CashFlowForecast transactions={transactions} invoices={invoices} />
      </div>

      {/* Invoices Table */}
      <RecentInvoicesTable invoices={invoices} projects={projects} />
    </div>
  );
}