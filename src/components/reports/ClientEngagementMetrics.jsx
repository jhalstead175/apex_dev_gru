import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { MessageSquare, FileText, TrendingUp } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";

export default function ClientEngagementMetrics({ projects, messages, documents }) {
  // Calculate engagement metrics
  const getEngagementData = () => {
    const clientEngagement = {};
    
    projects.forEach(project => {
      const clientEmail = project.created_by;
      if (!clientEngagement[clientEmail]) {
        clientEngagement[clientEmail] = {
          email: clientEmail,
          name: project.client_name,
          projectCount: 0,
          messageCount: 0,
          documentCount: 0,
          lastActivity: null,
          engagementScore: 0
        };
      }
      
      clientEngagement[clientEmail].projectCount += 1;
      
      // Count messages
      const projectMessages = messages.filter(m => m.project_id === project.id);
      clientEngagement[clientEmail].messageCount += projectMessages.length;
      
      // Count documents
      const projectDocs = documents.filter(d => d.project_id === project.id);
      clientEngagement[clientEmail].documentCount += projectDocs.length;
      
      // Track last activity
      if (project.updated_date) {
        const activityDate = parseISO(project.updated_date);
        if (!clientEngagement[clientEmail].lastActivity || activityDate > clientEngagement[clientEmail].lastActivity) {
          clientEngagement[clientEmail].lastActivity = activityDate;
        }
      }
    });
    
    // Calculate engagement scores
    return Object.values(clientEngagement).map(client => {
      const daysSinceActivity = client.lastActivity 
        ? differenceInDays(new Date(), client.lastActivity)
        : 999;
      
      // Score based on activity (messages, docs) and recency
      const activityScore = (client.messageCount * 2) + (client.documentCount * 3);
      const recencyScore = Math.max(0, 100 - daysSinceActivity * 2);
      const engagementScore = Math.min(100, activityScore + recencyScore);
      
      return {
        ...client,
        daysSinceActivity,
        engagementScore: Math.round(engagementScore),
        engagementLevel: engagementScore > 70 ? 'High' : engagementScore > 40 ? 'Medium' : 'Low'
      };
    }).sort((a, b) => b.engagementScore - a.engagementScore);
  };

  const clients = getEngagementData();
  
  // Engagement level distribution
  const engagementDistribution = [
    { name: 'High Engagement', value: clients.filter(c => c.engagementLevel === 'High').length, color: '#10b981' },
    { name: 'Medium Engagement', value: clients.filter(c => c.engagementLevel === 'Medium').length, color: '#f59e0b' },
    { name: 'Low Engagement', value: clients.filter(c => c.engagementLevel === 'Low').length, color: '#ef4444' }
  ];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-emerald-100 font-medium">Highly Engaged</p>
              <TrendingUp className="w-6 h-6 text-emerald-200" />
            </div>
            <p className="text-4xl font-bold mb-1">
              {clients.filter(c => c.engagementLevel === 'High').length}
            </p>
            <p className="text-emerald-200 text-sm">Active clients</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-blue-100 font-medium">Avg Messages</p>
              <MessageSquare className="w-6 h-6 text-blue-200" />
            </div>
            <p className="text-4xl font-bold mb-1">
              {clients.length > 0 
                ? Math.round(clients.reduce((sum, c) => sum + c.messageCount, 0) / clients.length)
                : 0}
            </p>
            <p className="text-blue-200 text-sm">Per client</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 border-0 shadow-lg">
          <CardContent className="p-6 text-white">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-100 font-medium">Avg Documents</p>
              <FileText className="w-6 h-6 text-purple-200" />
            </div>
            <p className="text-4xl font-bold mb-1">
              {clients.length > 0 
                ? Math.round(clients.reduce((sum, c) => sum + c.documentCount, 0) / clients.length)
                : 0}
            </p>
            <p className="text-purple-200 text-sm">Per client</p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#0b1d3a]">
              Engagement Level Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={engagementDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {engagementDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-4">
              {engagementDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-slate-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Engaged Clients */}
        <Card className="bg-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#0b1d3a]">
              Most Engaged Clients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {clients.slice(0, 5).map((client, idx) => (
                <div key={client.email} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-slate-900">{client.name || client.email}</p>
                      <p className="text-xs text-slate-500">
                        Last active {client.daysSinceActivity} days ago
                      </p>
                    </div>
                    <Badge className={
                      client.engagementLevel === 'High' ? 'bg-emerald-500 text-white' :
                      client.engagementLevel === 'Medium' ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }>
                      {client.engagementLevel}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-slate-500">Projects</p>
                      <p className="font-bold text-slate-900">{client.projectCount}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Messages</p>
                      <p className="font-bold text-blue-600">{client.messageCount}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Documents</p>
                      <p className="font-bold text-purple-600">{client.documentCount}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Engagement Score</span>
                      <span className="font-bold text-slate-700">{client.engagementScore}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#c8a559] to-[#d4af37] h-2 rounded-full"
                        style={{ width: `${client.engagementScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}