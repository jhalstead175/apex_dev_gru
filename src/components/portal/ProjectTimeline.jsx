import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { CheckCircle, Circle, Clock } from "lucide-react";
import { format } from "date-fns";

const defaultMilestones = [
  { name: 'Contract Signed', order: 1 },
  { name: 'Deposit Received', order: 2 },
  { name: 'Materials Ordered', order: 3 },
  { name: 'Installation Start', order: 4 },
  { name: 'Final Walkthrough', order: 5 },
  { name: 'Project Complete', order: 6 },
];

export default function ProjectTimeline({ project }) {
  const queryClient = useQueryClient();

  const { data: milestones = [] } = useQuery({
    queryKey: ['milestones', project.id],
    queryFn: async () => {
      const allMilestones = await base44.entities.Milestone.list();
      let projectMilestones = allMilestones.filter(m => m.project_id === project.id);
      
      // If no milestones exist, create default ones
      if (projectMilestones.length === 0) {
        const created = await Promise.all(
          defaultMilestones.map(m => 
            base44.entities.Milestone.create({
              project_id: project.id,
              milestone_name: m.name,
              milestone_order: m.order,
              status: 'pending',
            })
          )
        );
        return created;
      }
      
      return projectMilestones.sort((a, b) => a.milestone_order - b.milestone_order);
    },
    initialData: [],
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-8 h-8 text-emerald-500" />;
      case 'in_progress':
        return <Clock className="w-8 h-8 text-blue-500 animate-pulse" />;
      default:
        return <Circle className="w-8 h-8 text-slate-300" />;
    }
  };

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader className="border-b border-slate-100">
        <CardTitle className="text-xl font-bold text-[#1e3a5f]">
          Project Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {milestones.map((milestone, index) => (
            <div key={milestone.id} className="flex gap-4">
              {/* Icon and Connector */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  {getStatusIcon(milestone.status)}
                </div>
                {index < milestones.length - 1 && (
                  <div
                    className={`w-0.5 h-16 mt-2 ${
                      milestone.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-8">
                <h4 className={`font-bold text-lg ${
                  milestone.status === 'completed' ? 'text-emerald-700' : 'text-slate-700'
                }`}>
                  {milestone.milestone_name}
                </h4>
                
                {milestone.completion_date && (
                  <p className="text-sm text-emerald-600 mt-1">
                    Completed: {format(new Date(milestone.completion_date), 'MMM d, yyyy')}
                  </p>
                )}
                
                {milestone.due_date && milestone.status !== 'completed' && (
                  <p className="text-sm text-slate-500 mt-1">
                    Expected: {format(new Date(milestone.due_date), 'MMM d, yyyy')}
                  </p>
                )}
                
                {milestone.notes && (
                  <p className="text-sm text-slate-600 mt-2 bg-slate-50 p-3 rounded-lg">
                    {milestone.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}