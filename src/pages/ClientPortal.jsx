import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText } from "lucide-react";
import { createPageUrl } from "@/utils";

import ProjectTimeline from "../components/portal/ProjectTimeline";
import FileRepository from "../components/portal/FileRepository";
import SecureMessaging from "../components/portal/SecureMessaging";

export default function ClientPortal() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        const userData = await base44.auth.me();
        setIsAuthenticated(true);
        return userData;
      } catch (error) {
        setIsAuthenticated(false);
        base44.auth.redirectToLogin(createPageUrl('ClientPortal'));
        return null;
      }
    },
    retry: false,
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['userProjects', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const allProjects = await base44.entities.Project.list();
      return allProjects.filter(p => p.created_by === user.email);
    },
    enabled: !!user?.email,
    initialData: [],
  });

  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);

  if (userLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Shield className="w-16 h-16 text-[#10b981] mx-auto mb-4 animate-pulse" />
          <p className="text-slate-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a85] rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-[#10b981] p-3 rounded-xl shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome, {user.full_name}
            </h1>
            <p className="text-emerald-300 text-lg">
              Your Secure Project Portal
            </p>
          </div>
        </div>

        {/* Project Selector */}
        {projects.length > 0 && (
          <div className="mt-6">
            <label className="text-white text-sm font-medium mb-2 block">
              Select Project:
            </label>
            <select
              className="w-full md:w-96 px-4 py-3 rounded-lg bg-white/10 text-white border border-white/20 backdrop-blur"
              value={selectedProject?.id || ''}
              onChange={(e) => setSelectedProject(projects.find(p => p.id === e.target.value))}
            >
              {projects.map(project => (
                <option key={project.id} value={project.id} className="text-slate-900">
                  {project.project_name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 mb-2">
              No Projects Yet
            </h3>
            <p className="text-slate-500">
              Your projects will appear here once they are created by our team.
            </p>
          </CardContent>
        </Card>
      ) : selectedProject ? (
        <div className="space-y-6">
          {/* Project Info Card */}
          <Card className="bg-white border-0 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <CardTitle className="text-xl font-bold text-[#1e3a5f]">
                {selectedProject.project_name}
              </CardTitle>
              <p className="text-slate-600 text-sm">{selectedProject.address}</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Project Value</p>
                  <p className="text-2xl font-bold text-[#1e3a5f]">
                    ${selectedProject.contract_value?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Status</p>
                  <p className="text-2xl font-bold text-[#10b981] capitalize">
                    {selectedProject.status?.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 mb-1">Progress</p>
                  <p className="text-2xl font-bold text-[#1e3a5f]">
                    {selectedProject.progress_percentage}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Project Timeline */}
          <ProjectTimeline project={selectedProject} />

          {/* File Repository and Messaging */}
          <div className="grid lg:grid-cols-2 gap-6">
            <FileRepository project={selectedProject} isClientView={true} />
            <SecureMessaging project={selectedProject} user={user} />
          </div>
        </div>
      ) : null}
    </div>
  );
}