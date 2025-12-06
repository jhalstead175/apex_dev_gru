import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import { Users, Star, TrendingUp, CheckCircle } from "lucide-react";

export default function AgentPerformanceMetrics({ projects, feedback }) {
  // Calculate agent metrics
  const getAgentMetrics = () => {
    const agentData = {};
    
    projects.forEach(project => {
      const agent = project.created_by || 'Unassigned';
      if (!agentData[agent]) {
        agentData[agent] = {
          name: agent.split('@')[0],
          tasksCompleted: 0,
          activeProjects: 0,
          totalValue: 0,
          satisfactionScores: [],
          onTimeCompletions: 0,
          totalCompletions: 0
        };
      }
      
      agentData[agent].activeProjects += 1;
      agentData[agent].totalValue += project.contract_value || 0;
      
      if (project.status === 'completed') {
        agentData[agent].tasksCompleted += 1;
        agentData[agent].totalCompletions += 1;
        
        // Check if on time
        if (project.estimated_completion && project.actual_completion) {
          const estimated = new Date(project.estimated_completion);
          const actual = new Date(project.actual_completion);
          if (actual <= estimated) {
            agentData[agent].onTimeCompletions += 1;
          }
        }
      }
    });
    
    // Add satisfaction scores from feedback
    feedback.forEach(fb => {
      const project = projects.find(p => p.id === fb.project_id);
      if (project && project.created_by) {
        const agent = project.created_by;
        if (agentData[agent]) {
          agentData[agent].satisfactionScores.push(fb.satisfaction_score);
        }
      }
    });
    
    // Calculate averages
    return Object.values(agentData).map(agent => ({
      ...agent,
      avgSatisfaction: agent.satisfactionScores.length > 0
        ? (agent.satisfactionScores.reduce((sum, s) => sum + s, 0) / agent.satisfactionScores.length).toFixed(1)
        : 0,
      onTimeRate: agent.totalCompletions > 0
        ? ((agent.onTimeCompletions / agent.totalCompletions) * 100).toFixed(0)
        : 0
    })).sort((a, b) => b.totalValue - a.totalValue);
  };

  const agents = getAgentMetrics();
  
  // Prepare radar chart data for top agent
  const topAgent = agents[0] || {};
  const radarData = [
    { metric: 'Completion Rate', value: parseFloat(topAgent.onTimeRate) || 0, fullMark: 100 },
    { metric: 'Client Satisfaction', value: parseFloat(topAgent.avgSatisfaction) * 20 || 0, fullMark: 100 },
    { metric: 'Active Projects', value: (topAgent.activeProjects / 10) * 100 || 0, fullMark: 100 },
    { metric: 'Revenue Generated', value: Math.min((topAgent.totalValue / 100000) * 100, 100) || 0, fullMark: 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Top Performers */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#0b1d3a] flex items-center gap-2">
            <Users className="w-6 h-6 text-[#c8a559]" />
            Agent Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Performance Table */}
            <div>
              <h3 className="font-bold text-slate-700 mb-4">Top Performers</h3>
              <div className="space-y-3">
                {agents.slice(0, 5).map((agent, idx) => (
                  <div key={agent.name} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-[#c8a559] text-white">#{idx + 1}</Badge>
                        <p className="font-bold text-slate-900">{agent.name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-slate-700">{agent.avgSatisfaction}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <p className="text-slate-500">Projects</p>
                        <p className="font-bold text-slate-900">{agent.activeProjects}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Completed</p>
                        <p className="font-bold text-emerald-600">{agent.tasksCompleted}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">On Time</p>
                        <p className="font-bold text-blue-600">{agent.onTimeRate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Radar Chart for Top Agent */}
            <div>
              <h3 className="font-bold text-slate-700 mb-4">
                Top Agent Performance Profile: {topAgent.name}
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#cbd5e1" />
                  <PolarAngleAxis 
                    dataKey="metric" 
                    tick={{ fill: '#64748b', fontSize: 11 }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Radar 
                    name={topAgent.name} 
                    dataKey="value" 
                    stroke="#c8a559" 
                    fill="#c8a559" 
                    fillOpacity={0.5}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                  <p className="text-xs text-emerald-700">Total Revenue</p>
                  <p className="text-lg font-bold text-emerald-900">
                    ${(topAgent.totalValue || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-xs text-blue-700">Satisfaction</p>
                  <p className="text-lg font-bold text-blue-900">{topAgent.avgSatisfaction}/5.0</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Rate Comparison */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#0b1d3a]">
            Agent Completion Rates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agents.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
              <YAxis 
                type="category" 
                dataKey="name" 
                stroke="#64748b"
                width={100}
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="onTimeRate" fill="#10b981" name="On-Time %" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}