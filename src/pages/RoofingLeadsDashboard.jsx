import React, { useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Users,
  TrendingUp,
  Calendar,
  Download,
  Search,
  Phone,
  Mail,
  Home,
  AlertCircle,
  Loader2,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

export default function RoofingLeadsDashboard() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [analytics, setAnalytics] = useState({
    total: 0,
    hot: 0,
    warm: 0,
    qualified: 0,
    prospect: 0,
    avgScore: 0,
  });

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      toast.error("Supabase is not configured. Please check your environment variables.");
      setIsLoading(false);
      return;
    }
    fetchLeads();
  }, []);

  useEffect(() => {
    filterLeads();
  }, [leads, searchTerm, filterTier, filterStatus]);

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching leads:', error);
        toast.error("Failed to fetch leads");
        return;
      }

      setLeads(data || []);
      calculateAnalytics(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error("An error occurred while fetching leads");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAnalytics = (leadsData) => {
    const total = leadsData.length;
    const hot = leadsData.filter(l => l.lead_tier === 'HOT').length;
    const warm = leadsData.filter(l => l.lead_tier === 'WARM').length;
    const qualified = leadsData.filter(l => l.lead_tier === 'QUALIFIED').length;
    const prospect = leadsData.filter(l => l.lead_tier === 'PROSPECT').length;
    const avgScore = total > 0
      ? Math.round(leadsData.reduce((sum, l) => sum + l.lead_score, 0) / total)
      : 0;

    setAnalytics({ total, hot, warm, qualified, prospect, avgScore });
  };

  const filterLeads = () => {
    let filtered = [...leads];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        lead =>
          lead.full_name?.toLowerCase().includes(search) ||
          lead.email?.toLowerCase().includes(search) ||
          lead.phone?.includes(search) ||
          lead.address?.toLowerCase().includes(search)
      );
    }

    // Tier filter
    if (filterTier !== 'all') {
      filtered = filtered.filter(lead => lead.lead_tier === filterTier);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(lead => lead.status === filterStatus);
    }

    setFilteredLeads(filtered);
  };

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ status: newStatus })
        .eq('id', leadId);

      if (error) {
        toast.error("Failed to update lead status");
        return;
      }

      toast.success("Lead status updated");
      fetchLeads();
      if (selectedLead?.id === leadId) {
        setSelectedLead(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating lead:', error);
      toast.error("An error occurred");
    }
  };

  const exportToCSV = () => {
    if (filteredLeads.length === 0) {
      toast.warning("No leads to export");
      return;
    }

    const headers = [
      'Name', 'Phone', 'Email', 'Address', 'Score', 'Tier', 'Status',
      'Property Type', 'Roof Age', 'Condition', 'Timeline', 'Created At'
    ];

    const rows = filteredLeads.map(lead => [
      lead.full_name,
      lead.phone,
      lead.email,
      lead.address,
      lead.lead_score,
      lead.lead_tier,
      lead.status,
      lead.property_type,
      lead.roof_age,
      lead.roof_condition,
      lead.timeline,
      new Date(lead.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `apex-leads-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(`Exported ${filteredLeads.length} leads to CSV`);
  };

  const getTierBadge = (tier) => {
    const colors = {
      HOT: 'bg-red-100 text-red-800 border-red-300',
      WARM: 'bg-orange-100 text-orange-800 border-orange-300',
      QUALIFIED: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      PROSPECT: 'bg-blue-100 text-blue-800 border-blue-300',
    };
    return (
      <Badge className={`${colors[tier]} border`}>
        {tier}
      </Badge>
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-purple-100 text-purple-800',
      qualified: 'bg-green-100 text-green-800',
      converted: 'bg-emerald-100 text-emerald-800',
      lost: 'bg-gray-100 text-gray-800',
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status?.toUpperCase()}
      </Badge>
    );
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="p-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Supabase Not Configured</h2>
            <p className="text-gray-600 mb-4">
              To view leads, you need to set up Supabase. Check the SUPABASE_SETUP.md file for instructions.
            </p>
            <Button variant="outline" onClick={() => window.open('/SUPABASE_SETUP.md', '_blank')}>
              View Setup Instructions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1e3a5f]">
              Roofing Leads Dashboard
            </h1>
            <p className="text-slate-600">
              Manage and track your lead generation
            </p>
          </div>
        </div>
        <Button onClick={exportToCSV} className="bg-emerald-600 hover:bg-emerald-700">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#1e3a5f]">{analytics.total}</div>
            <div className="text-sm text-slate-600">Total Leads</div>
          </CardContent>
        </Card>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{analytics.hot}</div>
            <div className="text-sm text-red-700">🔥 HOT</div>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{analytics.warm}</div>
            <div className="text-sm text-orange-700">WARM</div>
          </CardContent>
        </Card>
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{analytics.qualified}</div>
            <div className="text-sm text-yellow-700">QUALIFIED</div>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{analytics.prospect}</div>
            <div className="text-sm text-blue-700">PROSPECT</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-[#1e3a5f]">{analytics.avgScore}</div>
            <div className="text-sm text-slate-600">Avg Score</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, email, phone, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="HOT">HOT</SelectItem>
                <SelectItem value="WARM">WARM</SelectItem>
                <SelectItem value="QUALIFIED">QUALIFIED</SelectItem>
                <SelectItem value="PROSPECT">PROSPECT</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Leads ({filteredLeads.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Score</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Address</TableHead>
                    <TableHead>Timeline</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeads.map((lead) => (
                    <TableRow key={lead.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <div className="font-bold text-lg">{lead.lead_score}</div>
                      </TableCell>
                      <TableCell>{getTierBadge(lead.lead_tier)}</TableCell>
                      <TableCell className="font-medium">{lead.full_name}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {lead.phone}
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{lead.address}</TableCell>
                      <TableCell>{lead.timeline}</TableCell>
                      <TableCell>{getStatusBadge(lead.status)}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedLead(lead)}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <span>{selectedLead?.full_name}</span>
              {selectedLead && getTierBadge(selectedLead.lead_tier)}
              <span className="text-2xl font-bold ml-auto">{selectedLead?.lead_score}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-4">
              {/* Contact Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <h3 className="font-semibold text-lg mb-3">Contact Information</h3>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-600" />
                  <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">
                    {selectedLead.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">
                    {selectedLead.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-gray-600" />
                  <span>{selectedLead.address}</span>
                </div>
              </div>

              {/* Property Details */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Property & Roof Details</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-600">Property Type:</span>
                    <p className="font-medium">{selectedLead.property_type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Roof Age:</span>
                    <p className="font-medium">{selectedLead.roof_age} years</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Condition:</span>
                    <p className="font-medium capitalize">{selectedLead.roof_condition}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Visible Damage:</span>
                    <p className="font-medium capitalize">{selectedLead.visible_damage}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Recent Storm:</span>
                    <p className="font-medium capitalize">{selectedLead.recent_storm}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Active Leaks:</span>
                    <p className="font-medium capitalize">{selectedLead.active_leaks}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Timeline:</span>
                    <p className="font-medium">{selectedLead.timeline}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Has Quotes:</span>
                    <p className="font-medium capitalize">{selectedLead.has_quotes}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Budget Ready:</span>
                    <p className="font-medium capitalize">{selectedLead.has_budget}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Created:</span>
                    <p className="font-medium">{new Date(selectedLead.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Status Update */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Lead Status</h3>
                <Select
                  value={selectedLead.status}
                  onValueChange={(value) => updateLeadStatus(selectedLead.id, value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Source Tracking */}
              {(selectedLead.utm_source || selectedLead.utm_medium || selectedLead.referrer) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-3">Source Tracking</h3>
                  <div className="text-sm space-y-1">
                    {selectedLead.utm_source && (
                      <p><span className="text-gray-600">UTM Source:</span> {selectedLead.utm_source}</p>
                    )}
                    {selectedLead.utm_medium && (
                      <p><span className="text-gray-600">UTM Medium:</span> {selectedLead.utm_medium}</p>
                    )}
                    {selectedLead.utm_campaign && (
                      <p><span className="text-gray-600">UTM Campaign:</span> {selectedLead.utm_campaign}</p>
                    )}
                    {selectedLead.referrer && (
                      <p><span className="text-gray-600">Referrer:</span> {selectedLead.referrer}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
