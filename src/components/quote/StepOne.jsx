import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, ArrowRight } from "lucide-react";

export default function StepOne({ data, onComplete }) {
  const [formData, setFormData] = useState({
    client_name: data.client_name || '',
    address: data.address || '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.client_name && formData.address) {
      onComplete(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-[#1e3a5f] mb-2">
          Property Information
        </h3>
        <p className="text-slate-600">
          Let's start with the basics
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="client_name" className="text-sm font-medium text-slate-700">
            Your Name
          </Label>
          <Input
            id="client_name"
            value={formData.client_name}
            onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
            placeholder="John Smith"
            className="mt-1 h-12 text-lg"
            required
          />
        </div>

        <div>
          <Label htmlFor="address" className="text-sm font-medium text-slate-700 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#10b981]" />
            Property Address
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            placeholder="123 Main St, Pittsburgh, PA 15201"
            className="mt-1 h-12 text-lg"
            required
          />
          <p className="text-xs text-slate-500 mt-1">
            Enter the full property address including city and zip code
          </p>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 bg-[#10b981] hover:bg-[#059669] text-white font-medium text-lg shadow-lg"
      >
        Continue
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </form>
  );
}