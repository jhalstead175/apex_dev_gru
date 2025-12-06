import React from "react";
import { Card } from "@/components/ui/card";
import { MapPin, DollarSign } from "lucide-react";

export default function LeadCard({ lead, onClick, isDragging }) {
  return (
    <Card
      onClick={onClick}
      className={`p-3 cursor-pointer hover:shadow-lg transition-all bg-white border-2 ${
        isDragging ? 'shadow-2xl rotate-2 border-emerald-400' : 'border-slate-200'
      }`}
    >
      <h4 className="font-bold text-[#1e3a5f] mb-2 truncate">
        {lead.client_name}
      </h4>
      
      <div className="space-y-1 text-xs text-slate-600">
        <div className="flex items-start gap-1">
          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-2">{lead.address}</span>
        </div>
        
        {lead.quote_value && (
          <div className="flex items-center gap-1 text-[#10b981] font-medium">
            <DollarSign className="w-3 h-3" />
            <span>${lead.quote_value.toLocaleString()}</span>
          </div>
        )}
      </div>

      {lead.roof_square_footage && (
        <div className="mt-2 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500">
            {lead.roof_square_footage} sq ft
          </span>
        </div>
      )}
    </Card>
  );
}