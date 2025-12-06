import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  ArrowUpCircle, 
  DollarSign, 
  Download,
  Filter,
  Search
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function AdminReferralTable({ referrals, isLoading }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showPayoutDialog, setShowPayoutDialog] = useState(false);
  
  const queryClient = useQueryClient();

  const updateReferralMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Referral.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allReferrals'] });
      setShowEditDialog(false);
      setShowPayoutDialog(false);
      toast.success('Referral updated successfully');
    },
  });

  const handleAdvanceStatus = (referral, newStatus) => {
    let updateData = { status: newStatus };
    
    if (newStatus === 'Completed' && referral.project_value > 0) {
      updateData.referral_fee = referral.project_value * 0.04;
      updateData.date_completed = new Date().toISOString().split('T')[0];
    }
    
    updateReferralMutation.mutate({
      id: referral.id,
      data: updateData
    });
  };

  const handleRecordPayout = (payoutData) => {
    updateReferralMutation.mutate({
      id: selectedReferral.id,
      data: {
        status: 'Paid',
        payout_method: payoutData.payout_method,
        payout_id_or_notes: payoutData.payout_id_or_notes,
        date_paid: new Date().toISOString().split('T')[0]
      }
    });
  };

  const handleExportCSV = () => {
    const filteredData = getFilteredReferrals();
    const csvContent = [
      ['Date Created', 'Referrer Name', 'Referrer Email', 'Lead Name', 'Lead Email', 'Project Type', 'Status', 'Project Value', 'Referral Fee', 'Date Paid'].join(','),
      ...filteredData.map(r => [
        format(new Date(r.created_date), 'yyyy-MM-dd'),
        r.referrer_name,
        r.referrer_email,
        r.lead_name,
        r.lead_email,
        r.project_type,
        r.status,
        r.project_value || 0,
        r.referral_fee || 0,
        r.date_paid || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `referrals-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const getFilteredReferrals = () => {
    return referrals.filter(r => {
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchesSearch = searchTerm === '' || 
        r.lead_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.referrer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.lead_email?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  };

  const statusColors = {
    'Received': 'bg-blue-500',
    'Contacted': 'bg-purple-500',
    'In Progress': 'bg-yellow-500',
    'Completed': 'bg-emerald-500',
    'Paid': 'bg-green-500'
  };

  const filteredReferrals = getFilteredReferrals();

  return (
    <Card className="bg-white border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl font-bold text-[#0b1d3a]">
            All Referrals
          </CardTitle>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="border-[#c8a559] text-[#c8a559] hover:bg-[#c8a559]/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="w-full md:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-[#c8a559] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-600">Loading referrals...</p>
          </div>
        ) : filteredReferrals.length === 0 ? (
          <div className="text-center py-12">
            <Filter className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-600">No referrals found matching your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left p-3 text-sm font-bold text-slate-700">Date</th>
                  <th className="text-left p-3 text-sm font-bold text-slate-700">Referrer</th>
                  <th className="text-left p-3 text-sm font-bold text-slate-700">Lead</th>
                  <th className="text-left p-3 text-sm font-bold text-slate-700">Project</th>
                  <th className="text-left p-3 text-sm font-bold text-slate-700">Status</th>
                  <th className="text-right p-3 text-sm font-bold text-slate-700">Value</th>
                  <th className="text-right p-3 text-sm font-bold text-slate-700">Fee</th>
                  <th className="text-center p-3 text-sm font-bold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReferrals.map((referral) => (
                  <tr key={referral.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="p-3 text-sm text-slate-600">
                      {format(new Date(referral.created_date), 'MMM d, yyyy')}
                    </td>
                    <td className="p-3">
                      <p className="text-sm font-medium text-slate-900">{referral.referrer_name}</p>
                      <p className="text-xs text-slate-500">{referral.referrer_email}</p>
                    </td>
                    <td className="p-3">
                      <p className="text-sm font-medium text-slate-900">{referral.lead_name}</p>
                      <p className="text-xs text-slate-500">{referral.lead_email}</p>
                    </td>
                    <td className="p-3 text-sm text-slate-600">
                      {referral.project_type}
                    </td>
                    <td className="p-3">
                      <Badge className={`${statusColors[referral.status]} text-white`}>
                        {referral.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right text-sm font-medium text-slate-900">
                      ${(referral.project_value || 0).toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-sm font-bold text-[#c8a559]">
                      ${(referral.referral_fee || 0).toLocaleString()}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-center gap-2">
                        {referral.status !== 'Paid' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedReferral(referral);
                              setShowEditDialog(true);
                            }}
                            className="text-xs"
                          >
                            <ArrowUpCircle className="w-3 h-3 mr-1" />
                            Advance
                          </Button>
                        )}
                        {referral.status === 'Completed' && (
                          <Button
                            size="sm"
                            className="bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a] text-xs"
                            onClick={() => {
                              setSelectedReferral(referral);
                              setShowPayoutDialog(true);
                            }}
                          >
                            <DollarSign className="w-3 h-3 mr-1" />
                            Pay
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Referral Status</DialogTitle>
          </DialogHeader>
          {selectedReferral && (
            <div className="space-y-4">
              <div>
                <Label>Lead Name</Label>
                <p className="text-sm font-medium">{selectedReferral.lead_name}</p>
              </div>
              <div>
                <Label>Current Status</Label>
                <p className="text-sm font-medium">{selectedReferral.status}</p>
              </div>
              <div>
                <Label>Project Value ($)</Label>
                <Input
                  type="number"
                  defaultValue={selectedReferral.project_value || 0}
                  onChange={(e) => {
                    setSelectedReferral({
                      ...selectedReferral,
                      project_value: parseFloat(e.target.value) || 0
                    });
                  }}
                />
              </div>
              <div>
                <Label>Advance to Status</Label>
                <Select
                  onValueChange={(value) => {
                    handleAdvanceStatus(selectedReferral, value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select new status..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Payout Dialog */}
      <Dialog open={showPayoutDialog} onOpenChange={setShowPayoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payout</DialogTitle>
          </DialogHeader>
          {selectedReferral && (
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              handleRecordPayout({
                payout_method: formData.get('payout_method'),
                payout_id_or_notes: formData.get('payout_id_or_notes')
              });
            }} className="space-y-4">
              <div>
                <Label>Referrer</Label>
                <p className="text-sm font-medium">{selectedReferral.referrer_name}</p>
              </div>
              <div>
                <Label>Payout Amount</Label>
                <p className="text-2xl font-bold text-[#c8a559]">
                  ${(selectedReferral.referral_fee || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <Label htmlFor="payout_method">Payout Method</Label>
                <Select name="payout_method" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select method..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Check">Check</SelectItem>
                    <SelectItem value="Zelle">Zelle</SelectItem>
                    <SelectItem value="Venmo">Venmo</SelectItem>
                    <SelectItem value="PayPal">PayPal</SelectItem>
                    <SelectItem value="ACH">ACH</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="payout_id_or_notes">Transaction ID / Notes</Label>
                <Input
                  id="payout_id_or_notes"
                  name="payout_id_or_notes"
                  placeholder="Transaction ID, check number, or notes..."
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a]"
                disabled={updateReferralMutation.isPending}
              >
                {updateReferralMutation.isPending ? 'Processing...' : 'Record Payout'}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}