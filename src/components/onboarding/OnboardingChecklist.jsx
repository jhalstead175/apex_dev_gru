import React, { useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ExternalLink, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEFAULT_TASKS = [
  {
    task_name: "Complete Your Profile",
    task_description: "Add your contact information and project details",
    task_order: 1,
    task_type: "setup",
    required: true
  },
  {
    task_name: "Review Project Timeline",
    task_description: "Familiarize yourself with your project milestones and schedule",
    task_order: 2,
    task_type: "tutorial",
    required: true
  },
  {
    task_name: "Upload Project Documents",
    task_description: "Share any existing documents, photos, or permits for your project",
    task_order: 3,
    task_type: "action",
    required: false
  },
  {
    task_name: "Set Communication Preferences",
    task_description: "Choose how you'd like to receive updates (email, SMS, portal)",
    task_order: 4,
    task_type: "setup",
    required: true
  },
  {
    task_name: "Schedule Initial Consultation",
    task_description: "Book your first meeting with your assigned project manager",
    task_order: 5,
    task_type: "action",
    required: true
  }
];

export default function OnboardingChecklist({ user }) {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['onboardingTasks', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      return await base44.entities.OnboardingTask.filter({ user_email: user.email });
    },
    enabled: !!user?.email,
    initialData: [],
  });

  const createTaskMutation = useMutation({
    mutationFn: (taskData) => base44.entities.OnboardingTask.create(taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingTasks'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.OnboardingTask.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['onboardingTasks'] });
    },
  });

  // Initialize tasks if none exist
  useEffect(() => {
    if (user?.email && tasks.length === 0 && !isLoading) {
      DEFAULT_TASKS.forEach(task => {
        createTaskMutation.mutate({
          ...task,
          user_email: user.email
        });
      });
    }
  }, [user?.email, tasks.length, isLoading]);

  const handleCompleteTask = (task) => {
    updateTaskMutation.mutate({
      id: task.id,
      data: {
        completed: true,
        completed_date: new Date().toISOString()
      }
    });
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="bg-gradient-to-br from-white to-slate-50 border-2 border-[#c8a559]/30 shadow-xl">
      <CardHeader className="border-b border-[#c8a559]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#c8a559] to-[#d4af37] p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-[#0b1d3a]">
                Welcome to Apex Construction!
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">
                Complete these steps to get started with your project
              </p>
            </div>
          </div>
          <Badge className="bg-[#c8a559] text-white">
            {completedTasks}/{totalTasks} Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600 font-medium">Overall Progress</span>
            <span className="text-[#c8a559] font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gradient-to-r from-[#c8a559] to-[#d4af37] h-3 rounded-full"
            />
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <AnimatePresence>
            {tasks.sort((a, b) => a.task_order - b.task_order).map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  task.completed
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200 hover:border-[#c8a559]/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {task.completed ? (
                      <CheckCircle className="w-6 h-6 text-emerald-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={`font-bold ${task.completed ? 'text-emerald-900 line-through' : 'text-slate-900'}`}>
                        {task.task_name}
                      </h4>
                      {task.required && !task.completed && (
                        <Badge variant="outline" className="text-xs border-red-300 text-red-700">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className={`text-sm ${task.completed ? 'text-emerald-700' : 'text-slate-600'}`}>
                      {task.task_description}
                    </p>
                    {task.guide_url && (
                      <a
                        href={task.guide_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#c8a559] hover:text-[#d4af37] flex items-center gap-1 mt-2"
                      >
                        View Guide <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                  {!task.completed && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteTask(task)}
                      className="bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a]"
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Completion Message */}
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 text-white text-center"
          >
            <CheckCircle className="w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-bold mb-2">Congratulations!</h3>
            <p className="text-emerald-100">
              You've completed all onboarding tasks. Your project manager will be in touch soon!
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}