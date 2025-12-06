import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

import LeadCard from "../components/crm/LeadCard";
import LeadDetailPanel from "../components/crm/LeadDetailPanel";
import AddLeadDialog from "../components/crm/AddLeadDialog";

const stages = [
  { id: 'new_lead', label: 'New Leads', color: 'bg-blue-500' },
  { id: 'contacted', label: 'Contacted', color: 'bg-purple-500' },
  { id: 'quote_sent', label: 'Quote Sent', color: 'bg-yellow-500' },
  { id: 'negotiation', label: 'Negotiation', color: 'bg-orange-500' },
  { id: 'closed_won', label: 'Closed Won', color: 'bg-emerald-500' },
  { id: 'closed_lost', label: 'Closed Lost', color: 'bg-red-500' },
];

export default function CRM() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);

  const queryClient = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date'),
    initialData: [],
  });

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lead.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (projectData) => base44.entities.Project.create(projectData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const leadId = result.draggableId;
    const newStage = result.destination.droppableId;
    
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;

    await updateLeadMutation.mutateAsync({
      id: leadId,
      data: { stage: newStage }
    });

    // Auto-create project when moved to Closed Won
    if (newStage === 'closed_won') {
      await createProjectMutation.mutateAsync({
        project_name: `${lead.client_name} - Roofing Project`,
        client_name: lead.client_name,
        address: lead.address,
        contract_value: lead.quote_value || 0,
        status: 'planning',
        health_status: 'on_track',
        lead_id: lead.id,
        start_date: new Date().toISOString().split('T')[0],
      });

      // Send welcome email
      await base44.integrations.Core.SendEmail({
        to: lead.email,
        subject: 'Welcome to Apex Development Group - Project Kickoff',
        body: `Dear ${lead.client_name},\n\nCongratulations! We're excited to begin your roofing project at ${lead.address}.\n\nOur team will be in touch shortly to schedule the project kickoff.\n\nBest regards,\nApex Development Group Team`
      });
    }
  };

  const getLeadsByStage = (stageId) => {
    return leads.filter(lead => lead.stage === stageId);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-xl shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">
              CRM Pipeline
            </h1>
            <p className="text-slate-600">
              Manage your sales process from lead to close
            </p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddDialog(true)}
          className="bg-[#10b981] hover:bg-[#059669] shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Lead
        </Button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {stages.map((stage) => {
            const stageLeads = getLeadsByStage(stage.id);
            const totalValue = stageLeads.reduce((sum, lead) => sum + (lead.quote_value || 0), 0);

            return (
              <div key={stage.id} className="flex flex-col">
                <div className={`${stage.color} text-white p-4 rounded-t-xl shadow-lg`}>
                  <h3 className="font-bold mb-1">{stage.label}</h3>
                  <div className="flex items-center justify-between text-sm">
                    <span>{stageLeads.length} leads</span>
                    <span className="font-medium">${(totalValue / 1000).toFixed(0)}k</span>
                  </div>
                </div>

                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 bg-slate-100 p-2 rounded-b-xl min-h-[400px] ${
                        snapshot.isDraggingOver ? 'bg-slate-200' : ''
                      }`}
                    >
                      <div className="space-y-2">
                        {stageLeads.map((lead, index) => (
                          <Draggable key={lead.id} draggableId={lead.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <LeadCard
                                  lead={lead}
                                  onClick={() => setSelectedLead(lead)}
                                  isDragging={snapshot.isDragging}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      <LeadDetailPanel
        lead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />

      <AddLeadDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
      />
    </div>
  );
}