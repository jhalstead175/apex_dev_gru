import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, User, MapPin } from "lucide-react";
import { format } from "date-fns";

import StatusStepper from "./StatusStepper";

export default function ReferralCard({ referral, isClientView = false }) {
  const statusColors = {
    'Received': 'bg-blue-100 text-blue-700',
    'Contacted': 'bg-purple-100 text-purple-700',
    'In Progress': 'bg-yellow-100 text-yellow-700',
    'Completed': 'bg-emerald-100 text-emerald-700',
    'Paid': 'bg-green-100 text-green-700'
  };

  return (
    <Card className="bg-white hover:shadow-lg transition-all border-2 border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-[#0b1d3a] mb-1">
              {referral.lead_name}
            </h3>
            <Badge className={statusColors[referral.status]}>
              {referral.status}
            </Badge>
          </div>
          {referral.project_value > 0 && (
            <div className="text-right">
              <p className="text-sm text-slate-500">Project Value</p>
              <p className="text-2xl font-bold text-[#0b1d3a]">
                ${referral.project_value.toLocaleString()}
              </p>
              {(referral.status === 'Completed' || referral.status === 'Paid') && (
                <p className="text-sm text-[#c8a559] font-bold">
                  Your Fee: ${referral.referral_fee.toLocaleString()}
                </p>
              )}
            </div>
          )}
        </div>

        <StatusStepper status={referral.status} />

        <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <User className="w-4 h-4" />
            <span>{referral.project_type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{referral.lead_address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>Submitted {format(new Date(referral.created_date), 'MMM d, yyyy')}</span>
          </div>
          {referral.date_paid && (
            <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
              <DollarSign className="w-4 h-4" />
              <span>Paid {format(new Date(referral.date_paid), 'MMM d, yyyy')}</span>
            </div>
          )}
        </div>

        {!isClientView && referral.referrer_name && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-slate-500">Referred by:</p>
            <p className="font-medium text-[#0b1d3a]">
              {referral.referrer_name} ({referral.referrer_email})
            </p>
          </div>
        )}

        {referral.notes && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-slate-500 mb-1">Notes:</p>
            <p className="text-sm text-slate-700">{referral.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}