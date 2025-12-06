
import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, CheckCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import StepOne from "../components/quote/StepOne";
import StepTwo from "../components/quote/StepTwo";
import StepThree from "../components/quote/StepThree";

export default function QuoteGenerator() {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [quoteData, setQuoteData] = React.useState({
    client_name: '',
    address: '',
    square_footage: '',
    roof_pitch: '',
    material_type: '',
    // New fields potentially coming from StepOne/StepTwo
    property_type: '',
    num_stories: '',
    roof_age: '',
    has_chimney: false,
    has_skylights: false,
    needs_tear_off: false,
    current_issues: '',
    urgent_repairs: '',
    budget_range: '',
    timeline: '',
    email: '',
    phone: '',
  });
  const [calculatedQuote, setCalculatedQuote] = React.useState(null);
  const [isCalculating, setIsCalculating] = React.useState(false);
  const [aiAnalysis, setAiAnalysis] = React.useState(null);

  const queryClient = useQueryClient();

  const createLeadMutation = useMutation({
    mutationFn: (leadData) => base44.entities.Lead.create(leadData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead created successfully!');
    },
  });

  const handleStepOneComplete = (data) => {
    setQuoteData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleStepTwoComplete = (data) => {
    setQuoteData(prev => ({ ...prev, ...data }));
    calculateAIPoweredQuote({ ...quoteData, ...data });
  };

  const calculateAIPoweredQuote = async (data) => {
    setIsCalculating(true);
    setCurrentStep(3);

    try {
      // Build detailed context for AI
      const projectContext = `
Property Details:
- Address: ${data.address}
- Property Type: ${data.property_type || 'Not specified'}
- Square Footage: ${data.square_footage} sq ft
- Number of Stories: ${data.num_stories || 'Not specified'}
- Roof Pitch: ${data.roof_pitch}
- Current Roof Age: ${data.roof_age || 'Unknown'}

Project Specifications:
- Desired Material: ${data.material_type}
- Has Chimney: ${data.has_chimney ? 'Yes' : 'No'}
- Has Skylights: ${data.has_skylights ? 'Yes' : 'No'}
- Needs Tear-Off: ${data.needs_tear_off ? 'Yes' : 'No'}

Current Issues: ${data.current_issues || 'None reported'}
Urgent Repairs: ${data.urgent_repairs || 'None'}
Budget Range: ${data.budget_range || 'Not specified'}
Timeline: ${data.timeline || 'Not specified'}

Location: Pennsylvania (use PA market rates for labor and materials)
`;

      // Use AI to analyze and generate quote
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a roofing estimation expert for Aegis Spec Group, a premium building envelope company in Pennsylvania.

${projectContext}

Please analyze this roofing project and provide:

1. A detailed cost breakdown including:
   - Material costs (based on specified material type and PA pricing)
   - Labor costs (considering roof pitch complexity, stories, and PA labor rates)
   - Additional costs (chimney flashing, skylights, tear-off if needed)
   - Overhead and profit margins (15% overhead, 20% profit for quality work)

2. Cost estimate range (low and high estimates with 10% variance)

3. Project timeline estimate in weeks

4. Key considerations and recommendations based on:
   - Current issues mentioned
   - Roof age and condition
   - Material selection appropriateness
   - Any urgent concerns

5. Scope of work summary

Provide realistic Pennsylvania market rates. Consider:
- Asphalt shingles: $3.5-4.5/sq ft material
- Architectural shingles: $4.5-6/sq ft material
- Metal roofing: $8-12/sq ft material
- Tile: $10-15/sq ft material
- Slate: $15-25/sq ft material
- Labor base: $2.5-3.5/sq ft (multiply by pitch difficulty)
- Tear-off: +$1-2/sq ft
- Chimney flashing: +$500-1000
- Skylights: +$300-600 each

Return a professional, detailed analysis.`,
        response_json_schema: {
          type: "object",
          properties: {
            cost_breakdown: {
              type: "object",
              properties: {
                material_cost: { type: "number" },
                labor_cost: { type: "number" },
                tear_off_cost: { type: "number" },
                additional_features_cost: { type: "number" },
                overhead: { type: "number" },
                profit: { type: "number" }
              }
            },
            estimate_low: { type: "number" },
            estimate_high: { type: "number" },
            estimated_timeline_weeks: { type: "number" },
            key_considerations: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            scope_summary: { type: "string" },
            urgency_level: {
              type: "string",
              enum: ["low", "medium", "high", "emergency"]
            }
          }
        }
      });

      setAiAnalysis(aiResponse);

      // Save quote to database
      await base44.entities.Quote.create({
        client_name: data.client_name,
        address: data.address,
        square_footage: parseFloat(data.square_footage),
        roof_pitch: data.roof_pitch,
        material_type: data.material_type,
        estimated_low: Math.round(aiResponse.estimate_low),
        estimated_high: Math.round(aiResponse.estimate_high),
        labor_cost: Math.round(aiResponse.cost_breakdown.labor_cost),
        material_cost: Math.round(aiResponse.cost_breakdown.material_cost),
        status: 'draft',
      });

      setCalculatedQuote({
        low: Math.round(aiResponse.estimate_low),
        high: Math.round(aiResponse.estimate_high),
        material_cost: Math.round(aiResponse.cost_breakdown.material_cost),
        labor_cost: Math.round(aiResponse.cost_breakdown.labor_cost),
        breakdown: aiResponse.cost_breakdown,
        timeline: aiResponse.estimated_timeline_weeks,
        considerations: aiResponse.key_considerations,
        recommendations: aiResponse.recommendations,
        scope: aiResponse.scope_summary,
        urgency: aiResponse.urgency_level,
      });

    } catch (error) {
      console.error('Error calculating AI quote:', error);
      toast.error('Failed to generate quote. Please try again.');
      setCurrentStep(2);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleScheduleInspection = async () => {
    await createLeadMutation.mutateAsync({
      client_name: quoteData.client_name,
      email: quoteData.email || '',
      phone: quoteData.phone || '',
      address: quoteData.address,
      quote_value: calculatedQuote.high,
      roof_square_footage: parseFloat(quoteData.square_footage),
      roof_pitch: quoteData.roof_pitch,
      material_type: quoteData.material_type,
      stage: 'new_lead',
      source: 'website',
      notes: `AI-Generated Quote: $${calculatedQuote.low.toLocaleString()} - $${calculatedQuote.high.toLocaleString()}
      
Property Type: ${quoteData.property_type || 'Not specified'}
Timeline: ${quoteData.timeline || 'Not specified'}
Current Issues: ${quoteData.current_issues || 'None'}
Urgent Repairs: ${quoteData.urgent_repairs || 'None'}

AI Urgency Level: ${calculatedQuote.urgency}
Estimated Timeline: ${calculatedQuote.timeline} weeks

Key Considerations:
${calculatedQuote.considerations?.join('\n') || 'None'}`,
    });

    // Reset form
    setCurrentStep(1);
    setQuoteData({
      client_name: '',
      address: '',
      square_footage: '',
      roof_pitch: '',
      material_type: '',
      property_type: '',
      num_stories: '',
      roof_age: '',
      has_chimney: false,
      has_skylights: false,
      needs_tear_off: false,
      current_issues: '',
      urgent_repairs: '',
      budget_range: '',
      timeline: '',
      email: '',
      phone: '',
    });
    setCalculatedQuote(null);
    setAiAnalysis(null);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setQuoteData({
      client_name: '',
      address: '',
      square_footage: '',
      roof_pitch: '',
      material_type: '',
      property_type: '',
      num_stories: '',
      roof_age: '',
      has_chimney: false,
      has_skylights: false,
      needs_tear_off: false,
      current_issues: '',
      urgent_repairs: '',
      budget_range: '',
      timeline: '',
      email: '',
      phone: '',
    });
    setCalculatedQuote(null);
    setAiAnalysis(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white border-0 shadow-2xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a85] text-white p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-[#10b981] p-3 rounded-xl shadow-lg">
              <Calculator className="w-8 h-8" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                AI-Powered Instant Quote
              </CardTitle>
              <p className="text-emerald-200 text-sm mt-1">
                Get a detailed, intelligent estimate in minutes
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2 mt-6">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex items-center gap-2 flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= step
                        ? 'bg-[#10b981] text-white shadow-lg'
                        : 'bg-white/20 text-white/60'
                    }`}
                  >
                    {currentStep > step ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div
                      className={`flex-1 h-1 rounded transition-all ${
                        currentStep > step ? 'bg-[#10b981]' : 'bg-white/20'
                      }`}
                    />
                  )}
                </div>
              </React.Fragment>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <StepOne 
                  data={quoteData} 
                  onComplete={handleStepOneComplete} 
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <StepTwo 
                  data={quoteData} 
                  onComplete={handleStepTwoComplete}
                  onBack={() => setCurrentStep(1)}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <StepThree
                  quote={calculatedQuote}
                  isCalculating={isCalculating}
                  onScheduleInspection={handleScheduleInspection}
                  onStartNew={resetForm}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
