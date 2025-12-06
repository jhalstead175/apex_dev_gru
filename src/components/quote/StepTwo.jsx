import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, Home, AlertCircle } from "lucide-react";

export default function StepTwo({ data, onComplete, onBack }) {
  const [formData, setFormData] = useState({
    square_footage: data.square_footage || '',
    roof_pitch: data.roof_pitch || '',
    material_type: data.material_type || '',
    roof_age: data.roof_age || '',
    current_issues: data.current_issues || '',
    property_type: data.property_type || '',
    num_stories: data.num_stories || '',
    has_chimney: data.has_chimney || false,
    has_skylights: data.has_skylights || false,
    needs_tear_off: data.needs_tear_off || false,
    urgent_repairs: data.urgent_repairs || '',
    budget_range: data.budget_range || '',
    timeline: data.timeline || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.square_footage && formData.roof_pitch && formData.material_type && formData.property_type) {
      onComplete(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Home className="w-8 h-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">
          Property & Roof Details
        </h3>
        <p className="text-slate-600">
          Help us understand your specific needs for an accurate AI-powered estimate
        </p>
      </div>

      <div className="space-y-5 max-h-[500px] overflow-y-auto pr-2">
        {/* Property Type */}
        <div>
          <Label htmlFor="property_type" className="text-sm font-medium text-slate-700">
            Property Type *
          </Label>
          <Select
            value={formData.property_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, property_type: value }))}
            required
          >
            <SelectTrigger className="mt-1 h-12">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single_family">Single Family Home</SelectItem>
              <SelectItem value="multi_family">Multi-Family / Duplex</SelectItem>
              <SelectItem value="commercial">Commercial Building</SelectItem>
              <SelectItem value="industrial">Industrial Facility</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Square Footage */}
        <div>
          <Label htmlFor="square_footage" className="text-sm font-medium text-slate-700">
            Roof Square Footage *
          </Label>
          <Input
            id="square_footage"
            type="number"
            min="100"
            value={formData.square_footage}
            onChange={(e) => setFormData(prev => ({ ...prev, square_footage: e.target.value }))}
            placeholder="2000"
            className="mt-1 h-12"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            Not sure? Most homes are between 1,500 - 3,000 sq ft
          </p>
        </div>

        {/* Number of Stories */}
        <div>
          <Label htmlFor="num_stories" className="text-sm font-medium text-slate-700">
            Number of Stories
          </Label>
          <Select
            value={formData.num_stories}
            onValueChange={(value) => setFormData(prev => ({ ...prev, num_stories: value }))}
          >
            <SelectTrigger className="mt-1 h-12">
              <SelectValue placeholder="Select number of stories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 Story</SelectItem>
              <SelectItem value="2">2 Stories</SelectItem>
              <SelectItem value="3+">3+ Stories</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Roof Pitch */}
        <div>
          <Label htmlFor="roof_pitch" className="text-sm font-medium text-slate-700">
            Roof Pitch (Slope) *
          </Label>
          <Select
            value={formData.roof_pitch}
            onValueChange={(value) => setFormData(prev => ({ ...prev, roof_pitch: value }))}
            required
          >
            <SelectTrigger className="mt-1 h-12">
              <SelectValue placeholder="Select roof pitch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low_pitch">Low Pitch (3/12 - 4/12) - Easy Access</SelectItem>
              <SelectItem value="medium_pitch">Medium Pitch (5/12 - 7/12) - Standard</SelectItem>
              <SelectItem value="steep_pitch">Steep Pitch (8/12 - 10/12) - Challenging</SelectItem>
              <SelectItem value="very_steep">Very Steep (11/12+) - Complex</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Current Roof Age */}
        <div>
          <Label htmlFor="roof_age" className="text-sm font-medium text-slate-700">
            Current Roof Age
          </Label>
          <Select
            value={formData.roof_age}
            onValueChange={(value) => setFormData(prev => ({ ...prev, roof_age: value }))}
          >
            <SelectTrigger className="mt-1 h-12">
              <SelectValue placeholder="Select roof age" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-5">0-5 Years</SelectItem>
              <SelectItem value="6-10">6-10 Years</SelectItem>
              <SelectItem value="11-15">11-15 Years</SelectItem>
              <SelectItem value="16-20">16-20 Years</SelectItem>
              <SelectItem value="20+">20+ Years</SelectItem>
              <SelectItem value="unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Material Type */}
        <div>
          <Label htmlFor="material_type" className="text-sm font-medium text-slate-700">
            Desired Material *
          </Label>
          <Select
            value={formData.material_type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, material_type: value }))}
            required
          >
            <SelectTrigger className="mt-1 h-12">
              <SelectValue placeholder="Select roofing material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="asphalt_shingles">Asphalt Shingles - Most Popular</SelectItem>
              <SelectItem value="architectural_shingles">Architectural Shingles - Premium</SelectItem>
              <SelectItem value="metal_roofing">Metal Roofing - Long Lasting</SelectItem>
              <SelectItem value="tile">Tile - Traditional</SelectItem>
              <SelectItem value="slate">Slate - High End</SelectItem>
              <SelectItem value="wood_shakes">Wood Shakes - Natural</SelectItem>
              <SelectItem value="flat_membrane">Flat/Membrane - Commercial</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Special Features */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-slate-700">Special Features</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="has_chimney"
                checked={formData.has_chimney}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_chimney: checked }))}
              />
              <label htmlFor="has_chimney" className="text-sm text-slate-600">
                Has Chimney (requires flashing work)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="has_skylights"
                checked={formData.has_skylights}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, has_skylights: checked }))}
              />
              <label htmlFor="has_skylights" className="text-sm text-slate-600">
                Has Skylights (additional waterproofing)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="needs_tear_off"
                checked={formData.needs_tear_off}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, needs_tear_off: checked }))}
              />
              <label htmlFor="needs_tear_off" className="text-sm text-slate-600">
                Needs Complete Tear-Off (removal of old roofing)
              </label>
            </div>
          </div>
        </div>

        {/* Current Issues */}
        <div>
          <Label htmlFor="current_issues" className="text-sm font-medium text-slate-700">
            Current Issues or Concerns
          </Label>
          <Textarea
            id="current_issues"
            value={formData.current_issues}
            onChange={(e) => setFormData(prev => ({ ...prev, current_issues: e.target.value }))}
            placeholder="e.g., Active leaks in bedroom, missing shingles, water damage in attic, etc."
            className="mt-1 resize-none"
            rows={3}
          />
        </div>

        {/* Urgent Repairs */}
        <div>
          <Label htmlFor="urgent_repairs" className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            Any Urgent Repairs Needed?
          </Label>
          <Input
            id="urgent_repairs"
            value={formData.urgent_repairs}
            onChange={(e) => setFormData(prev => ({ ...prev, urgent_repairs: e.target.value }))}
            placeholder="e.g., Emergency leak repair needed"
            className="mt-1 h-12"
          />
        </div>

        {/* Budget Range */}
        <div>
          <Label htmlFor="budget_range" className="text-sm font-medium text-slate-700">
            Budget Range (Optional)
          </Label>
          <Select
            value={formData.budget_range}
            onValueChange={(value) => setFormData(prev => ({ ...prev, budget_range: value }))}
          >
            <SelectTrigger className="mt-1 h-12">
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under_10k">Under $10,000</SelectItem>
              <SelectItem value="10k-20k">$10,000 - $20,000</SelectItem>
              <SelectItem value="20k-35k">$20,000 - $35,000</SelectItem>
              <SelectItem value="35k-50k">$35,000 - $50,000</SelectItem>
              <SelectItem value="over_50k">Over $50,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Timeline */}
        <div>
          <Label htmlFor="timeline" className="text-sm font-medium text-slate-700">
            Desired Timeline
          </Label>
          <Select
            value={formData.timeline}
            onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
          >
            <SelectTrigger className="mt-1 h-12">
              <SelectValue placeholder="When do you need this done?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="emergency">Emergency / ASAP</SelectItem>
              <SelectItem value="within_month">Within 1 Month</SelectItem>
              <SelectItem value="1-3_months">1-3 Months</SelectItem>
              <SelectItem value="3-6_months">3-6 Months</SelectItem>
              <SelectItem value="planning">Just Planning / Research</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 h-12 text-lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          className="flex-1 h-12 bg-[#10b981] hover:bg-[#059669] text-white font-medium text-lg shadow-lg"
        >
          Generate AI Quote
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </form>
  );
}