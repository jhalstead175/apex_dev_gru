import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, DollarSign, TrendingUp, Users } from "lucide-react";

import AdminReferralTable from "../components/referral/AdminReferralTable";

export default function AdminReferralDashboard() {
  const { data: referrals = [], isLoading } = useQuery({
    queryKey: ['allReferrals'],
    queryFn: () => base44.entities.Referral.list('-created_date'),
    initialData: [],
  });

  const totalReferrals = referrals.length;
  const completedReferrals = referrals.filter(r => r.status === 'Completed' || r.status === 'Paid').length;
  const conversionRate = totalReferrals > 0 ? ((completedReferrals / totalReferrals) * 100).toFixed(1) : 0;
  const totalPayouts = referrals
    .filter(r => r.status === 'Paid')
    .reduce((sum, r) => sum + (r.referral_fee || 0), 0);
  const avgProjectValue = referrals.length > 0
    ? referrals.reduce((sum, r) => sum + (r.project_value || 0), 0) / referrals.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0b1d3a] to-[#1a3355] rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#c8a559] to-[#d4af37] p-3 rounded-xl shadow-lg">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Referral Management Dashboard
            </h1>
            <p className="text-[#c8a559] text-lg">
              Partner-Profit Program Administration
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500 font-medium">Total Referrals</p>
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl font-bold text-[#0b1d3a]">{totalReferrals}</p>
            <p className="text-xs text-slate-500 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500 font-medium">Conversion Rate</p>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold text-[#0b1d3a]">{conversionRate}%</p>
            <p className="text-xs text-slate-500 mt-1">{completedReferrals} completed</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500 font-medium">Total Payouts</p>
              <DollarSign className="w-5 h-5 text-[#c8a559]" />
            </div>
            <p className="text-3xl font-bold text-[#0b1d3a]">${totalPayouts.toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Paid to partners</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-slate-500 font-medium">Avg Project Value</p>
              <DollarSign className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-[#0b1d3a]">${Math.round(avgProjectValue).toLocaleString()}</p>
            <p className="text-xs text-slate-500 mt-1">Per referral</p>
          </CardContent>
        </Card>
      </div>

      {/* Referrals Table */}
      <AdminReferralTable referrals={referrals} isLoading={isLoading} />
    </div>
  );
}