
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  MapPin, 
  Mail, 
  Phone, 
  DollarSign, 
  Calendar,
  Save,
  Trash2,
  Home,
  Send
} from "lucide-react";
import { toast } from "sonner";

const stageColors = {
  new_lead: 'bg-blue-100 text-blue-700',
  contacted: 'bg-purple-100 text-purple-700',
  quote_sent: 'bg-yellow-100 text-yellow-700',
  negotiation: 'bg-orange-100 text-orange-700',
  closed_won: 'bg-emerald-100 text-emerald-700',
  closed_lost: 'bg-red-100 text-red-700',
};

export default function LeadDetailPanel({ lead, onClose }) {
  const [editData, setEditData] = useState(lead || {});
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (lead) {
      setEditData(lead);
    }
  }, [lead]);

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Lead.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const deleteLeadMutation = useMutation({
    mutationFn: (id) => base44.entities.Lead.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      onClose();
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (projectData) => base44.entities.Project.create(projectData),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      
      // Send notification email
      await base44.integrations.Core.SendEmail({
        to: lead.email,
        subject: 'Welcome to Apex Development Group - Project Kickoff',
        body: `Dear ${lead.client_name},\n\nCongratulations! We're excited to begin your roofing project at ${lead.address}.\n\nOur team will be in touch shortly to schedule the project kickoff.\n\nBest regards,\nApex Development Group Team`
      });
    },
  });

  const sendFollowUpMutation = useMutation({
    mutationFn: async (followUpType) => {
      return await base44.functions.invoke('salesAutomation', {
        action: 'send_followup',
        data: { leadId: lead.id, followUpType }
      });
    },
    onSuccess: () => {
      toast.success('Follow-up email sent successfully!');
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const handleSave = async () => {
    await updateLeadMutation.mutateAsync({
      id: lead.id,
      data: editData,
    });
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this lead?')) {
      await deleteLeadMutation.mutateAsync(lead.id);
    }
  };

  const handleConvertToProject = async () => {
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

    // Update lead stage to closed_won
    await updateLeadMutation.mutateAsync({
      id: lead.id,
      data: { stage: 'closed_won' },
    });
  };

  const getFollowUpType = () => {
    switch (lead.stage) {
      case 'new_lead':
        return 'initial_contact';
      case 'contacted':
        return 'quote_reminder';
      case 'quote_sent':
        return 'quote_followup';
      case 'negotiation':
        return 'negotiation_nudge';
      default:
        return 'general_followup';
    }
  };

  if (!lead) return null;

  return (
    <Sheet open={!!lead} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-[#1e3a5f] flex items-center gap-2">
            <Home className="w-6 h-6" />
            Lead Details
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Stage Badge */}
          <div>
            <Badge className={`${stageColors[lead.stage]} text-sm px-3 py-1`}>
              {lead.stage.replace('_', ' ').toUpperCase()}
            </Badge>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <Label>Client Name</Label>
              <Input
                value={editData.client_name || ''}
                onChange={(e) => setEditData({ ...editData, client_name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                type="email"
                value={editData.email || ''}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone
              </Label>
              <Input
                value={editData.phone || ''}
                onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                value={editData.address || ''}
                onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Quote Value
              </Label>
              <Input
                type="number"
                value={editData.quote_value || ''}
                onChange={(e) => setEditData({ ...editData, quote_value: parseFloat(e.target.value) })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Stage</Label>
              <Select
                value={editData.stage}
                onValueChange={(value) => setEditData({ ...editData, stage: value })}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new_lead">New Lead</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="quote_sent">Quote Sent</SelectItem>
                  <SelectItem value="negotiation">Negotiation</SelectItem>
                  <SelectItem value="closed_won">Closed Won</SelectItem>
                  <SelectItem value="closed_lost">Closed Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Notes</Label>
              <Textarea
                value={editData.notes || ''}
                onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                className="mt-1 resize-none"
                rows={4}
              />
            </div>
          </div>

          {/* Automated Follow-up Section */}
          {lead.email && lead.stage !== 'closed_won' && lead.stage !== 'closed_lost' && (
            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <h4 className="font-bold text-blue-900 mb-2">Automated Follow-Up</h4>
              <p className="text-sm text-blue-700 mb-3">
                Send an AI-optimized follow-up email based on the current stage
              </p>
              <Button
                onClick={() => sendFollowUpMutation.mutate(getFollowUpType())}
                disabled={sendFollowUpMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                {sendFollowUpMutation.isPending ? 'Sending...' : 'Send Follow-Up Email'}
              </Button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t">
            <Button
              onClick={handleSave}
              className="w-full bg-[#10b981] hover:bg-[#059669]"
              disabled={updateLeadMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>

            {lead.stage !== 'closed_won' && (
              <Button
                onClick={handleConvertToProject}
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={createProjectMutation.isPending}
              >
                Convert to Project
              </Button>
            )}

            <Button
              onClick={handleDelete}
              variant="destructive"
              className="w-full"
              disabled={deleteLeadMutation.isPending}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Lead
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
