import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ReferralForm({ onSubmit, onCancel, isSubmitting }) {
  const [formData, setFormData] = useState({
    lead_name: '',
    lead_email: '',
    lead_phone: '',
    lead_address: '',
    project_type: '',
    referrer_phone: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const projectTypes = [
    "Roof Replacement",
    "Roof Repair",
    "Gutters",
    "Siding",
    "Windows",
    "General Construction"
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="lead_name">Lead Name *</Label>
          <Input
            id="lead_name"
            value={formData.lead_name}
            onChange={(e) => setFormData({...formData, lead_name: e.target.value})}
            placeholder="John Smith"
            required
          />
        </div>

        <div>
          <Label htmlFor="lead_email">Lead Email *</Label>
          <Input
            id="lead_email"
            type="email"
            value={formData.lead_email}
            onChange={(e) => setFormData({...formData, lead_email: e.target.value})}
            placeholder="john@example.com"
            required
          />
        </div>

        <div>
          <Label htmlFor="lead_phone">Lead Phone *</Label>
          <Input
            id="lead_phone"
            type="tel"
            value={formData.lead_phone}
            onChange={(e) => setFormData({...formData, lead_phone: e.target.value})}
            placeholder="(555) 123-4567"
            required
          />
        </div>

        <div>
          <Label htmlFor="referrer_phone">Your Phone Number</Label>
          <Input
            id="referrer_phone"
            type="tel"
            value={formData.referrer_phone}
            onChange={(e) => setFormData({...formData, referrer_phone: e.target.value})}
            placeholder="(555) 987-6543"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="lead_address">Property Address *</Label>
        <Input
          id="lead_address"
          value={formData.lead_address}
          onChange={(e) => setFormData({...formData, lead_address: e.target.value})}
          placeholder="123 Main St, Pittsburgh, PA 15222"
          required
        />
      </div>

      <div>
        <Label htmlFor="project_type">Project Type *</Label>
        <Select
          value={formData.project_type}
          onValueChange={(value) => setFormData({...formData, project_type: value})}
          required
        >
          <SelectTrigger id="project_type">
            <SelectValue placeholder="Select project type..." />
          </SelectTrigger>
          <SelectContent>
            {projectTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          placeholder="Any additional information about the lead or project..."
          className="h-24"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a]"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Referral'}
        </Button>
      </div>
    </form>
  );
}