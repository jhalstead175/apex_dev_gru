import React from "react";
import { Card } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";

const colorMap = {
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'bg-emerald-500',
    text: 'text-emerald-700',
    accent: 'text-emerald-500'
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'bg-blue-500',
    text: 'text-blue-700',
    accent: 'text-blue-500'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'bg-purple-500',
    text: 'text-purple-700',
    accent: 'text-purple-500'
  },
  gold: {
    bg: 'bg-yellow-50',
    icon: 'bg-[#d4af37]',
    text: 'text-yellow-700',
    accent: 'text-[#d4af37]'
  }
};

export default function StatCard({ title, value, icon: Icon, color, trend }) {
  const colors = colorMap[color] || colorMap.emerald;

  return (
    <Card className="relative overflow-hidden bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`${colors.icon} p-3 rounded-xl shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
              {trend}
            </div>
          )}
        </div>
        <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-[#1e3a5f]">{value}</p>
      </div>
      <div className={`absolute bottom-0 left-0 right-0 h-1 ${colors.icon}`} />
    </Card>
  );
}