import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Clock } from "lucide-react";

export default function EarningsSummary({ referrals }) {
  const totalPaid = referrals
    .filter(r => r.status === 'Paid')
    .reduce((sum, r) => sum + (r.referral_fee || 0), 0);

  const pendingEarnings = referrals
    .filter(r => r.status === 'Completed')
    .reduce((sum, r) => sum + (r.referral_fee || 0), 0);

  const inProgressCount = referrals.filter(r => 
    r.status === 'In Progress' || r.status === 'Contacted'
  ).length;

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-2xl">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-emerald-100 font-medium">Total Earned</p>
            <DollarSign className="w-6 h-6 text-emerald-200" />
          </div>
          <p className="text-4xl font-bold mb-1">${totalPaid.toLocaleString()}</p>
          <p className="text-emerald-200 text-sm">Paid out to you</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 border-0 shadow-2xl">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-yellow-100 font-medium">Pending Payout</p>
            <Clock className="w-6 h-6 text-yellow-200" />
          </div>
          <p className="text-4xl font-bold mb-1">${pendingEarnings.toLocaleString()}</p>
          <p className="text-yellow-200 text-sm">Ready for payment</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-2xl">
        <CardContent className="p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-100 font-medium">In Progress</p>
            <TrendingUp className="w-6 h-6 text-blue-200" />
          </div>
          <p className="text-4xl font-bold mb-1">{inProgressCount}</p>
          <p className="text-blue-200 text-sm">Active referrals</p>
        </CardContent>
      </Card>
    </div>
  );
}