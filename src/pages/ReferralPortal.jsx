import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gift, Plus, DollarSign, TrendingUp, Clock } from "lucide-react";
import { createPageUrl } from "@/utils";

import ReferralForm from "../components/referral/ReferralForm";
import ReferralCard from "../components/referral/ReferralCard";
import EarningsSummary from "../components/referral/EarningsSummary";

export default function ReferralPortal() {
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const userData = await base44.auth.me();
        return userData;
      } catch (error) {
        base44.auth.redirectToLogin(createPageUrl('ReferralPortal'));
        return null;
      }
    },
    retry: false,
  });

  const { data: referrals = [], isLoading: referralsLoading } = useQuery({
    queryKey: ['myReferrals', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const allReferrals = await base44.entities.Referral.list('-created_date');
      return allReferrals.filter(r => r.referrer_email === user.email);
    },
    enabled: !!user?.email,
    initialData: [],
  });

  const createReferralMutation = useMutation({
    mutationFn: (data) => base44.entities.Referral.create({
      ...data,
      referrer_name: user.full_name,
      referrer_email: user.email,
      status: 'Received'
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReferrals'] });
      setShowForm(false);
    },
  });

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0b1d3a] to-[#1a3355]">
        <div className="text-center">
          <Gift className="w-16 h-16 text-[#c8a559] mx-auto mb-4 animate-pulse" />
          <p className="text-white">Loading your portal...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1d3a] to-[#1a3355] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#c8a559] to-[#d4af37] rounded-2xl p-8 shadow-2xl mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#0b1d3a] mb-2">
                Welcome back, {user.full_name?.split(' ')[0]}!
              </h1>
              <p className="text-[#0b1d3a]/80 text-lg">
                Your Partner-Profit Portal
              </p>
            </div>
            <div className="bg-[#0b1d3a] p-3 rounded-xl">
              <Gift className="w-8 h-8 text-[#c8a559]" />
            </div>
          </div>
        </div>

        {/* Earnings Summary */}
        <EarningsSummary referrals={referrals} />

        {/* Submit New Referral */}
        <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold text-[#0b1d3a]">
                Submit a New Referral
              </CardTitle>
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a]"
              >
                <Plus className="w-5 h-5 mr-2" />
                {showForm ? 'Cancel' : 'New Referral'}
              </Button>
            </div>
          </CardHeader>
          {showForm && (
            <CardContent>
              <ReferralForm
                onSubmit={(data) => createReferralMutation.mutate(data)}
                onCancel={() => setShowForm(false)}
                isSubmitting={createReferralMutation.isPending}
              />
            </CardContent>
          )}
        </Card>

        {/* My Referrals */}
        <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-[#0b1d3a]">
              My Referrals ({referrals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {referralsLoading ? (
              <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-[#c8a559] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600">Loading your referrals...</p>
              </div>
            ) : referrals.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700 mb-2">
                  No Referrals Yet
                </h3>
                <p className="text-slate-500 mb-6">
                  Submit your first referral and start earning today!
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a]"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Submit Your First Referral
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {referrals.map((referral) => (
                  <ReferralCard key={referral.id} referral={referral} isClientView={true} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}