import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

export default function ACVGauge({ projects }) {
  const completedProjects = projects.filter(p => p.status === 'completed');
  
  const totalProfit = completedProjects.reduce((sum, project) => {
    return sum + (project.contract_value - project.costs_to_date);
  }, 0);

  const averageProfit = completedProjects.length > 0 
    ? totalProfit / completedProjects.length 
    : 0;

  const targetProfit = 25000;
  const percentage = Math.min((averageProfit / targetProfit) * 100, 100);

  return (
    <Card className="bg-gradient-to-br from-[#1e3a5f] to-[#2d5a85] border-0 shadow-lg text-white">
      <CardHeader className="border-b border-white/10 pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-[#d4af37]" />
          Average After Construction Value
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-8">
        <div className="flex flex-col items-center">
          {/* Circular Gauge */}
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="16"
                fill="none"
              />
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#10b981"
                strokeWidth="16"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 80}`}
                strokeDashoffset={`${2 * Math.PI * 80 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-bold text-white">
                ${Math.round(averageProfit / 1000)}k
              </p>
              <p className="text-sm text-emerald-300 mt-1">per project</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <p className="text-xs text-slate-300 mb-1">Target</p>
              <p className="text-xl font-bold">${targetProfit.toLocaleString()}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
              <p className="text-xs text-slate-300 mb-1">Projects</p>
              <p className="text-xl font-bold">{completedProjects.length}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-emerald-300">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">
              {percentage >= 100 ? 'Target Exceeded!' : `${Math.round(percentage)}% to target`}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}