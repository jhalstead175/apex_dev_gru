import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, ArrowRight } from "lucide-react";

const stageLabels = {
  new_lead: 'New Leads',
  contacted: 'Contacted',
  quote_sent: 'Quote Sent',
  negotiation: 'Negotiation',
  closed_won: 'Closed Won',
};

const stageColors = {
  new_lead: 'bg-blue-500',
  contacted: 'bg-purple-500',
  quote_sent: 'bg-yellow-500',
  negotiation: 'bg-orange-500',
  closed_won: 'bg-emerald-500',
};

export default function LeadFunnelWidget({ leads }) {
  const stageCounts = {
    new_lead: leads.filter(l => l.stage === 'new_lead').length,
    contacted: leads.filter(l => l.stage === 'contacted').length,
    quote_sent: leads.filter(l => l.stage === 'quote_sent').length,
    negotiation: leads.filter(l => l.stage === 'negotiation').length,
    closed_won: leads.filter(l => l.stage === 'closed_won').length,
  };

  const maxCount = Math.max(...Object.values(stageCounts), 1);

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
          <Filter className="w-5 h-5 text-purple-500" />
          Lead Conversion Funnel
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {Object.entries(stageCounts).map(([stage, count], index) => {
            const widthPercentage = (count / maxCount) * 100;
            
            return (
              <div key={stage} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-700">{stageLabels[stage]}</span>
                  <span className="font-bold text-[#1e3a5f]">{count}</span>
                </div>
                <div className="relative h-12 bg-slate-100 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${stageColors[stage]} transition-all duration-500 flex items-center justify-end px-4`}
                    style={{ width: `${widthPercentage}%` }}
                  >
                    {count > 0 && (
                      <span className="text-white font-bold text-sm">{count}</span>
                    )}
                  </div>
                </div>
                {index < 4 && (
                  <div className="flex justify-center">
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-slate-600">Conversion Rate</span>
            <span className="text-2xl font-bold text-emerald-500">
              {stageCounts.new_lead > 0 
                ? `${Math.round((stageCounts.closed_won / stageCounts.new_lead) * 100)}%`
                : '0%'
              }
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}