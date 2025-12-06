import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertCircle, CheckCircle, Clock } from "lucide-react";

const healthConfig = {
  on_track: {
    label: 'On Track',
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
    iconColor: 'text-emerald-500'
  },
  at_risk: {
    label: 'At Risk',
    color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    icon: AlertCircle,
    iconColor: 'text-yellow-500'
  },
  delayed: {
    label: 'Delayed',
    color: 'bg-red-100 text-red-700 border-red-200',
    icon: Clock,
    iconColor: 'text-red-500'
  }
};

export default function ProjectHealthGrid({ projects }) {
  const activeProjects = projects.filter(p => 
    p.status === 'in_progress' || p.status === 'planning'
  );

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-bold text-[#1e3a5f] flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Active Projects Health
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {activeProjects.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No active projects</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
            {activeProjects.map((project) => {
              const health = healthConfig[project.health_status] || healthConfig.on_track;
              const HealthIcon = health.icon;
              
              return (
                <div
                  key={project.id}
                  className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-[#1e3a5f] mb-1">
                        {project.project_name}
                      </h4>
                      <p className="text-sm text-slate-600">{project.client_name}</p>
                      <p className="text-xs text-slate-500 mt-1">{project.address}</p>
                    </div>
                    <Badge className={`${health.color} border`}>
                      <HealthIcon className="w-3 h-3 mr-1" />
                      {health.label}
                    </Badge>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{project.progress_percentage}%</span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          project.health_status === 'on_track' 
                            ? 'bg-emerald-500' 
                            : project.health_status === 'at_risk'
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        } transition-all duration-500`}
                        style={{ width: `${project.progress_percentage}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-3 text-xs">
                    <div>
                      <span className="text-slate-500">Value:</span>
                      <span className="ml-1 font-medium text-[#1e3a5f]">
                        ${project.contract_value?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500">Status:</span>
                      <span className="ml-1 font-medium text-[#1e3a5f] capitalize">
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}