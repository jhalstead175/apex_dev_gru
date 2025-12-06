import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { format, startOfMonth, parseISO } from "date-fns";

export default function ProjectCompletionChart({ projects, dateRange }) {
  // Filter projects by date range and group by month
  const getCompletionData = () => {
    const filteredProjects = projects.filter(p => {
      if (!p.actual_completion) return false;
      const completionDate = parseISO(p.actual_completion);
      return completionDate >= dateRange.start && completionDate <= dateRange.end;
    });

    // Group by month
    const monthlyData = {};
    filteredProjects.forEach(project => {
      const monthKey = format(startOfMonth(parseISO(project.actual_completion)), 'MMM yyyy');
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          month: monthKey,
          completed: 0,
          onTime: 0,
          delayed: 0,
          totalValue: 0
        };
      }
      monthlyData[monthKey].completed += 1;
      
      // Check if on time
      if (project.estimated_completion) {
        const estimated = parseISO(project.estimated_completion);
        const actual = parseISO(project.actual_completion);
        if (actual <= estimated) {
          monthlyData[monthKey].onTime += 1;
        } else {
          monthlyData[monthKey].delayed += 1;
        }
      }
      
      monthlyData[monthKey].totalValue += project.contract_value || 0;
    });

    return Object.values(monthlyData).sort((a, b) => 
      new Date(a.month) - new Date(b.month)
    );
  };

  const data = getCompletionData();
  
  // Calculate on-time completion rate
  const totalCompleted = data.reduce((sum, d) => sum + d.completed, 0);
  const totalOnTime = data.reduce((sum, d) => sum + d.onTime, 0);
  const onTimeRate = totalCompleted > 0 ? ((totalOnTime / totalCompleted) * 100).toFixed(1) : 0;

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-[#0b1d3a]">
            Project Completion Trends
          </CardTitle>
          <div className="text-right">
            <p className="text-sm text-slate-500">On-Time Rate</p>
            <p className="text-2xl font-bold text-emerald-600">{onTimeRate}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="month" 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px'
              }}
            />
            <Legend />
            <Bar dataKey="onTime" stackId="a" fill="#10b981" name="On Time" />
            <Bar dataKey="delayed" stackId="a" fill="#f59e0b" name="Delayed" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-sm text-slate-500">Total Completed</p>
            <p className="text-2xl font-bold text-[#0b1d3a]">{totalCompleted}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-500">On Time</p>
            <p className="text-2xl font-bold text-emerald-600">{totalOnTime}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-slate-500">Delayed</p>
            <p className="text-2xl font-bold text-yellow-600">
              {data.reduce((sum, d) => sum + d.delayed, 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}