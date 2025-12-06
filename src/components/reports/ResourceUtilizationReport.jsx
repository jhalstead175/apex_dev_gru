import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Users, Clock, Briefcase } from "lucide-react";

export default function ResourceUtilizationReport({ projects, transactions, dateRange }) {
  const periodProjects = projects.filter(p => 
    new Date(p.start_date) >= dateRange.start && new Date(p.start_date) <= dateRange.end
  );

  // Project status distribution
  const statusData = ['planning', 'in_progress', 'completed', 'on_hold', 'delayed'].map(status => ({
    status: status.replace('_', ' ').toUpperCase(),
    count: periodProjects.filter(p => p.status === status).length
  }));

  // Resource allocation by project
  const projectResources = periodProjects
    .map(p => ({
      name: p.project_name.length > 25 ? p.project_name.substring(0, 25) + '...' : p.project_name,
      budget: p.contract_value || 0,
      spent: p.costs_to_date || 0,
      remaining: (p.contract_value || 0) - (p.costs_to_date || 0),
      utilization: p.contract_value > 0 ? ((p.costs_to_date / p.contract_value) * 100) : 0
    }))
    .sort((a, b) => b.utilization - a.utilization)
    .slice(0, 10);

  // Calculate overall metrics
  const totalBudget = periodProjects.reduce((sum, p) => sum + (p.contract_value || 0), 0);
  const totalSpent = periodProjects.reduce((sum, p) => sum + (p.costs_to_date || 0), 0);
  const avgUtilization = totalBudget > 0 ? (totalSpent / totalBudget * 100) : 0;

  const activeProjects = periodProjects.filter(p => p.status === 'in_progress').length;
  const completedProjects = periodProjects.filter(p => p.status === 'completed').length;
  const projectCompletionRate = periodProjects.length > 0 ? (completedProjects / periodProjects.length * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 p-2 rounded-lg">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-blue-700">Active Projects</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">{activeProjects}</p>
            <p className="text-xs text-blue-600 mt-1">
              {periodProjects.length} total projects
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-emerald-500 p-2 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-emerald-700">Budget Utilization</p>
            </div>
            <p className="text-3xl font-bold text-emerald-900">{avgUtilization.toFixed(1)}%</p>
            <p className="text-xs text-emerald-600 mt-1">
              ${totalSpent.toLocaleString()} of ${totalBudget.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-500 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm font-medium text-purple-700">Completion Rate</p>
            </div>
            <p className="text-3xl font-bold text-purple-900">{projectCompletionRate.toFixed(1)}%</p>
            <p className="text-xs text-purple-600 mt-1">
              {completedProjects} projects completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Project Status Distribution */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#1e3a5f]">
            Project Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="status" stroke="#64748b" style={{ fontSize: '12px' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Budget Utilization by Project */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#1e3a5f]">
            Top 10 Projects by Budget Utilization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={projectResources} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" stroke="#64748b" style={{ fontSize: '12px' }} tickFormatter={(value) => `$${value / 1000}k`} />
              <YAxis type="category" dataKey="name" stroke="#64748b" style={{ fontSize: '10px' }} width={150} />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="budget" fill="#3b82f6" name="Budget" />
              <Bar dataKey="spent" fill="#ef4444" name="Spent" />
              <Bar dataKey="remaining" fill="#10b981" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Resource Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#1e3a5f]">
              Over-Budget Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectResources
                .filter(p => p.utilization > 100)
                .slice(0, 5)
                .map((project, index) => (
                  <div key={index} className="bg-red-50 rounded-lg p-4 border border-red-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-red-900">{project.name}</h4>
                      <span className="text-lg font-bold text-red-600">
                        {project.utilization.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-red-700">
                      <span>Budget: ${project.budget.toLocaleString()}</span>
                      <span>Spent: ${project.spent.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-red-600 mt-1">
                      Over budget by ${Math.abs(project.remaining).toLocaleString()}
                    </p>
                  </div>
                ))}
              {projectResources.filter(p => p.utilization > 100).length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No over-budget projects in this period</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-[#1e3a5f]">
              Efficient Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {projectResources
                .filter(p => p.utilization < 80 && p.utilization > 0)
                .slice(0, 5)
                .map((project, index) => (
                  <div key={index} className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-emerald-900">{project.name}</h4>
                      <span className="text-lg font-bold text-emerald-600">
                        {project.utilization.toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-emerald-700">
                      <span>Budget: ${project.budget.toLocaleString()}</span>
                      <span>Spent: ${project.spent.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-emerald-600 mt-1">
                      ${project.remaining.toLocaleString()} remaining
                    </p>
                  </div>
                ))}
              {projectResources.filter(p => p.utilization < 80 && p.utilization > 0).length === 0 && (
                <div className="text-center py-8 text-slate-500">
                  <p>No efficient projects in this period</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}