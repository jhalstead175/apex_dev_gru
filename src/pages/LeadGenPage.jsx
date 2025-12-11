import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, CheckCircle2, Home, Phone, Mail, Calendar, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import logo from "@/assets/apex-dev-gru-logo.png";
import { supabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import { toast } from "sonner";
import {
  sendLeadNotificationEmail,
  sendLeadNotificationSMS,
  sendWelcomeEmail,
  scheduleFollowUpSequence,
} from "@/lib/notifications";
import {
  trackLeadSubmission,
  trackFacebookLead,
  trackFormStep,
  trackCalendarBooking,
} from "@/lib/analytics";

export default function LeadGenPage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Contact Info
    fullName: "",
    phone: "",
    email: "",
    address: "",

    // Step 2: Property & Roof Info
    propertyType: "",
    roofAge: "",
    roofCondition: "",
    visibleDamage: "",
    recentStorm: "",
    activeLeaks: "",
    timeline: "",
    hasQuotes: "",
    hasBudget: "",
  });

  const [leadScore, setLeadScore] = useState(null);
  const [leadTier, setLeadTier] = useState(null);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateLeadScore = () => {
    let score = 0;

    // Roof age scoring (30 points max)
    if (formData.roofAge === "20+") score += 30;
    else if (formData.roofAge === "15-20") score += 25;
    else if (formData.roofAge === "10-15") score += 15;
    else if (formData.roofAge === "5-10") score += 8;
    else if (formData.roofAge === "0-5") score += 3;

    // Roof condition (25 points max)
    if (formData.roofCondition === "poor") score += 25;
    else if (formData.roofCondition === "fair") score += 15;
    else if (formData.roofCondition === "good") score += 5;

    // Visible damage (15 points max)
    if (formData.visibleDamage === "yes") score += 15;
    else if (formData.visibleDamage === "unsure") score += 8;

    // Recent storm damage (10 points max)
    if (formData.recentStorm === "yes") score += 10;
    else if (formData.recentStorm === "unsure") score += 5;

    // Active leaks (10 points max)
    if (formData.activeLeaks === "yes") score += 10;

    // Timeline urgency (15 points max)
    if (formData.timeline === "immediate") score += 15;
    else if (formData.timeline === "1-3months") score += 12;
    else if (formData.timeline === "3-6months") score += 8;
    else if (formData.timeline === "6-12months") score += 4;

    // Has quotes already (10 points max)
    if (formData.hasQuotes === "yes") score += 10;
    else if (formData.hasQuotes === "no") score += 5;

    // Budget ready (10 points max)
    if (formData.hasBudget === "yes") score += 10;
    else if (formData.hasBudget === "no") score += 5;

    // Determine tier
    let tier = "PROSPECT";
    if (score >= 80) tier = "HOT";
    else if (score >= 60) tier = "WARM";
    else if (score >= 40) tier = "QUALIFIED";

    return { score, tier };
  };

  const saveLeadToSupabase = async (score, tier) => {
    if (!isSupabaseConfigured()) {
      console.warn("Supabase not configured. Lead data:", { ...formData, score, tier });
      toast.warning("Lead saved locally. Configure Supabase to save to database.");
      return { success: true, localOnly: true };
    }

    try {
      // Get UTM parameters from URL if available
      const urlParams = new URLSearchParams(window.location.search);

      const leadData = {
        full_name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        property_type: formData.propertyType,
        roof_age: formData.roofAge,
        roof_condition: formData.roofCondition,
        visible_damage: formData.visibleDamage,
        recent_storm: formData.recentStorm,
        active_leaks: formData.activeLeaks,
        timeline: formData.timeline,
        has_quotes: formData.hasQuotes,
        has_budget: formData.hasBudget,
        lead_score: score,
        lead_tier: tier,
        status: 'new',
        source: 'website',
        utm_source: urlParams.get('utm_source'),
        utm_medium: urlParams.get('utm_medium'),
        utm_campaign: urlParams.get('utm_campaign'),
        referrer: document.referrer || null,
      };

      const { data, error } = await supabase
        .from('leads')
        .insert([leadData])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        toast.error("Failed to save lead. Please try again.");
        return { success: false, error };
      }

      toast.success("Lead submitted successfully!");

      // If it's a HOT lead, show extra notification
      if (tier === "HOT") {
        toast.success("🔥 Priority lead! Our team will contact you within 24 hours.");
      }

      // Send notifications (don't block on these)
      const leadWithData = { ...leadData, id: data[0]?.id };

      // Send internal notifications
      sendLeadNotificationEmail(leadWithData).catch(err =>
        console.warn('Email notification failed:', err)
      );

      if (tier === "HOT") {
        sendLeadNotificationSMS(leadWithData).catch(err =>
          console.warn('SMS notification failed:', err)
        );
      }

      // Send welcome email to customer
      sendWelcomeEmail(leadWithData).catch(err =>
        console.warn('Welcome email failed:', err)
      );

      // Schedule follow-up sequence
      scheduleFollowUpSequence(leadWithData).catch(err =>
        console.warn('Follow-up sequence failed:', err)
      );

      // Track conversion in analytics
      trackLeadSubmission(leadWithData);
      trackFacebookLead(leadWithData);

      return { success: true, data };
    } catch (error) {
      console.error('Error saving lead:', error);
      toast.error("An error occurred. Please try again.");
      return { success: false, error };
    }
  };

  const handleNextStep = async () => {
    if (step === 1) {
      // Validate step 1
      if (!formData.fullName || !formData.phone || !formData.email || !formData.address) {
        toast.error("Please fill in all contact information.");
        return;
      }
      setStep(2);
      trackFormStep(2);
    } else if (step === 2) {
      // Validate step 2
      if (!formData.propertyType || !formData.roofAge || !formData.roofCondition ||
          !formData.visibleDamage || !formData.recentStorm || !formData.activeLeaks ||
          !formData.timeline || !formData.hasQuotes || !formData.hasBudget) {
        toast.error("Please answer all questions.");
        return;
      }

      setIsSubmitting(true);

      // Calculate score
      const { score, tier } = calculateLeadScore();
      setLeadScore(score);
      setLeadTier(tier);

      // Save to Supabase
      await saveLeadToSupabase(score, tier);

      setIsSubmitting(false);
      setStep(3);

      // Scroll to top to show results
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTierColor = (tier) => {
    switch(tier) {
      case "HOT": return "text-red-600 bg-red-50 border-red-200";
      case "WARM": return "text-orange-600 bg-orange-50 border-orange-200";
      case "QUALIFIED": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "PROSPECT": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getTierMessage = (tier) => {
    switch(tier) {
      case "HOT":
        return "Your property shows urgent roofing needs. We'll prioritize your inspection.";
      case "WARM":
        return "Your roof likely needs attention soon. Let's schedule an assessment.";
      case "QUALIFIED":
        return "It's a good time to evaluate your roofing options. We'll be in touch.";
      case "PROSPECT":
        return "Your roof is in decent shape. We'll follow up for future planning.";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A1A3A] via-[#1a2a4a] to-[#0A1A3A]">
      <style>{`
        :root {
          --navy: #0A1A3A;
          --gold: #B48A3C;
          --light-gray: #f8f9fa;
        }
        * {
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
        }
        h1, h2, h3 {
          font-family: 'Poppins', 'Inter', sans-serif;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A1A3A]/90 backdrop-blur-md shadow-xl">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to={createPageUrl("Home")} className="flex items-center gap-3">
              <img src={logo} alt="Apex Development Group Logo" className="w-12 h-12 rounded-lg shadow-lg object-contain" />
              <div>
                <h1 className="text-white font-bold text-xl tracking-tight">
                  Apex Development Group
                </h1>
                <p className="text-[#B48A3C] text-xs font-medium">
                  Building Excellence
                </p>
              </div>
            </Link>
            <Link to={createPageUrl("Home")}>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[#0A1A3A]">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <div className="bg-[#B48A3C]/20 backdrop-blur-sm border border-[#B48A3C] px-4 py-2 rounded-full">
                <p className="text-[#B48A3C] text-sm font-semibold tracking-wide">
                  FREE ROOF ASSESSMENT
                </p>
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Get Your Expert Roofing Evaluation
            </h1>
            <p className="text-xl text-gray-300">
              Answer a few quick questions to receive your personalized roof assessment
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step >= 1 ? 'bg-[#B48A3C] text-white' : 'bg-white/20 text-white/50'
              }`}>
                {step > 1 ? <CheckCircle2 className="w-6 h-6" /> : '1'}
              </div>
              <div className={`h-1 w-20 ${step >= 2 ? 'bg-[#B48A3C]' : 'bg-white/20'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step >= 2 ? 'bg-[#B48A3C] text-white' : 'bg-white/20 text-white/50'
              }`}>
                {step > 2 ? <CheckCircle2 className="w-6 h-6" /> : '2'}
              </div>
              <div className={`h-1 w-20 ${step >= 3 ? 'bg-[#B48A3C]' : 'bg-white/20'}`}></div>
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step >= 3 ? 'bg-[#B48A3C] text-white' : 'bg-white/20 text-white/50'
              }`}>
                {step > 3 ? <CheckCircle2 className="w-6 h-6" /> : '3'}
              </div>
            </div>
            <div className="flex justify-between text-white/70 text-sm mt-3 px-4">
              <span>Contact Info</span>
              <span>Property Details</span>
              <span>Your Results</span>
            </div>
          </div>

          {/* Form Card */}
          <Card className="bg-white/95 backdrop-blur-lg shadow-2xl border-0">
            <CardContent className="p-8">

              {/* Step 1: Contact Information */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#0A1A3A] mb-2">
                      Let's Get Started
                    </h2>
                    <p className="text-gray-600">
                      First, we need your contact information
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="fullName" className="text-[#0A1A3A] font-semibold flex items-center gap-2">
                        <Home className="w-4 h-4" /> Full Name *
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="John Smith"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-[#0A1A3A] font-semibold flex items-center gap-2">
                        <Phone className="w-4 h-4" /> Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-[#0A1A3A] font-semibold flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="address" className="text-[#0A1A3A] font-semibold flex items-center gap-2">
                        <Home className="w-4 h-4" /> Property Address *
                      </Label>
                      <Input
                        id="address"
                        placeholder="123 Main St, Pittsburgh, PA 15212"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Property & Roof Questions */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-[#0A1A3A] mb-2">
                      Tell Us About Your Roof
                    </h2>
                    <p className="text-gray-600">
                      This helps us provide the most accurate assessment
                    </p>
                  </div>

                  <div className="space-y-5">
                    {/* Property Type */}
                    <div>
                      <Label className="text-[#0A1A3A] font-semibold mb-2 block">
                        Property Type *
                      </Label>
                      <RadioGroup value={formData.propertyType} onValueChange={(val) => handleInputChange("propertyType", val)}>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="residential" id="residential" />
                          <Label htmlFor="residential" className="cursor-pointer flex-1">Residential (Single/Multi-Family Home)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="commercial" id="commercial" />
                          <Label htmlFor="commercial" className="cursor-pointer flex-1">Commercial Building</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Roof Age */}
                    <div>
                      <Label className="text-[#0A1A3A] font-semibold mb-2 block">
                        How old is your roof? *
                      </Label>
                      <RadioGroup value={formData.roofAge} onValueChange={(val) => handleInputChange("roofAge", val)}>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="0-5" id="age-0-5" />
                          <Label htmlFor="age-0-5" className="cursor-pointer flex-1">0-5 years</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="5-10" id="age-5-10" />
                          <Label htmlFor="age-5-10" className="cursor-pointer flex-1">5-10 years</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="10-15" id="age-10-15" />
                          <Label htmlFor="age-10-15" className="cursor-pointer flex-1">10-15 years</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="15-20" id="age-15-20" />
                          <Label htmlFor="age-15-20" className="cursor-pointer flex-1">15-20 years</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="20+" id="age-20+" />
                          <Label htmlFor="age-20+" className="cursor-pointer flex-1">20+ years</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="unknown" id="age-unknown" />
                          <Label htmlFor="age-unknown" className="cursor-pointer flex-1">I don't know</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Roof Condition */}
                    <div>
                      <Label className="text-[#0A1A3A] font-semibold mb-2 block">
                        Current roof condition? *
                      </Label>
                      <RadioGroup value={formData.roofCondition} onValueChange={(val) => handleInputChange("roofCondition", val)}>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="excellent" id="cond-excellent" />
                          <Label htmlFor="cond-excellent" className="cursor-pointer flex-1">Excellent (Like new)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="good" id="cond-good" />
                          <Label htmlFor="cond-good" className="cursor-pointer flex-1">Good (Minor wear)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="fair" id="cond-fair" />
                          <Label htmlFor="cond-fair" className="cursor-pointer flex-1">Fair (Noticeable aging)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="poor" id="cond-poor" />
                          <Label htmlFor="cond-poor" className="cursor-pointer flex-1">Poor (Significant damage)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Visible Damage */}
                    <div>
                      <Label className="text-[#0A1A3A] font-semibold mb-2 block">
                        Any visible damage (missing shingles, sagging, etc.)? *
                      </Label>
                      <RadioGroup value={formData.visibleDamage} onValueChange={(val) => handleInputChange("visibleDamage", val)}>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="yes" id="damage-yes" />
                          <Label htmlFor="damage-yes" className="cursor-pointer flex-1">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="no" id="damage-no" />
                          <Label htmlFor="damage-no" className="cursor-pointer flex-1">No</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="unsure" id="damage-unsure" />
                          <Label htmlFor="damage-unsure" className="cursor-pointer flex-1">Unsure</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Recent Storm */}
                    <div>
                      <Label className="text-[#0A1A3A] font-semibold mb-2 block">
                        Recent storm or hail damage? *
                      </Label>
                      <RadioGroup value={formData.recentStorm} onValueChange={(val) => handleInputChange("recentStorm", val)}>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="yes" id="storm-yes" />
                          <Label htmlFor="storm-yes" className="cursor-pointer flex-1">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="no" id="storm-no" />
                          <Label htmlFor="storm-no" className="cursor-pointer flex-1">No</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="unsure" id="storm-unsure" />
                          <Label htmlFor="storm-unsure" className="cursor-pointer flex-1">Unsure</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Active Leaks */}
                    <div>
                      <Label className="text-[#0A1A3A] font-semibold mb-2 block">
                        Any active leaks or water damage? *
                      </Label>
                      <RadioGroup value={formData.activeLeaks} onValueChange={(val) => handleInputChange("activeLeaks", val)}>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="yes" id="leaks-yes" />
                          <Label htmlFor="leaks-yes" className="cursor-pointer flex-1">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="no" id="leaks-no" />
                          <Label htmlFor="leaks-no" className="cursor-pointer flex-1">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Timeline */}
                    <div>
                      <Label className="text-[#0A1A3A] font-semibold mb-2 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> What's your timeline? *
                      </Label>
                      <RadioGroup value={formData.timeline} onValueChange={(val) => handleInputChange("timeline", val)}>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="immediate" id="timeline-immediate" />
                          <Label htmlFor="timeline-immediate" className="cursor-pointer flex-1">Immediate (ASAP)</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="1-3months" id="timeline-1-3" />
                          <Label htmlFor="timeline-1-3" className="cursor-pointer flex-1">1-3 months</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="3-6months" id="timeline-3-6" />
                          <Label htmlFor="timeline-3-6" className="cursor-pointer flex-1">3-6 months</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="6-12months" id="timeline-6-12" />
                          <Label htmlFor="timeline-6-12" className="cursor-pointer flex-1">6-12 months</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="just-looking" id="timeline-looking" />
                          <Label htmlFor="timeline-looking" className="cursor-pointer flex-1">Just gathering information</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Has Quotes */}
                    <div>
                      <Label className="text-[#0A1A3A] font-semibold mb-2 block">
                        Have you received other quotes? *
                      </Label>
                      <RadioGroup value={formData.hasQuotes} onValueChange={(val) => handleInputChange("hasQuotes", val)}>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="yes" id="quotes-yes" />
                          <Label htmlFor="quotes-yes" className="cursor-pointer flex-1">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="no" id="quotes-no" />
                          <Label htmlFor="quotes-no" className="cursor-pointer flex-1">No</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Budget Ready */}
                    <div>
                      <Label className="text-[#0A1A3A] font-semibold mb-2 block">
                        Do you have a budget in mind? *
                      </Label>
                      <RadioGroup value={formData.hasBudget} onValueChange={(val) => handleInputChange("hasBudget", val)}>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="yes" id="budget-yes" />
                          <Label htmlFor="budget-yes" className="cursor-pointer flex-1">Yes</Label>
                        </div>
                        <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                          <RadioGroupItem value="no" id="budget-no" />
                          <Label htmlFor="budget-no" className="cursor-pointer flex-1">No, need guidance</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Results */}
              {step === 3 && leadScore !== null && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[#B48A3C] to-[#9a7532] text-white text-4xl font-bold mb-4 shadow-2xl">
                      {leadScore}
                    </div>
                    <h2 className="text-3xl font-bold text-[#0A1A3A] mb-2">
                      Your Assessment Score
                    </h2>
                    <div className={`inline-block px-6 py-3 rounded-full font-bold text-lg border-2 ${getTierColor(leadTier)}`}>
                      {leadTier} LEAD
                    </div>
                  </div>

                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-bold text-blue-900 mb-2">What This Means:</h3>
                        <p className="text-blue-800">
                          {getTierMessage(leadTier)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                    <h3 className="font-bold text-[#0A1A3A] text-lg mb-4">Your Information:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-semibold text-gray-600">Name:</span>
                        <p className="text-gray-900">{formData.fullName}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Phone:</span>
                        <p className="text-gray-900">{formData.phone}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Email:</span>
                        <p className="text-gray-900">{formData.email}</p>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-600">Address:</span>
                        <p className="text-gray-900">{formData.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#0A1A3A] to-[#1a2a4a] rounded-lg p-6 text-white">
                    <h3 className="font-bold text-xl mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-6 h-6 text-[#B48A3C]" />
                      Next Steps
                    </h3>
                    <ul className="space-y-2 ml-8 list-disc">
                      <li>We'll review your assessment within 24 hours</li>
                      <li>A roofing specialist will contact you to schedule an inspection</li>
                      <li>We'll provide a detailed, no-obligation quote</li>
                      <li>You'll receive expert recommendations for your specific needs</li>
                    </ul>
                  </div>

                  {/* Calendar Booking */}
                  <div className="bg-gradient-to-r from-[#B48A3C] to-[#9a7532] rounded-lg p-6 text-white text-center">
                    <Calendar className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="font-bold text-2xl mb-2">Want to Schedule Your Inspection Now?</h3>
                    <p className="mb-4 text-white/90">
                      Skip the wait! Book your free roof inspection directly on our calendar.
                    </p>
                    <Button
                      onClick={() => {
                        // Track calendar booking
                        trackCalendarBooking();

                        // Open Calendly popup
                        const calendlyUrl = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/apexdevelopmentgroup';
                        window.open(calendlyUrl, '_blank', 'width=800,height=800');
                      }}
                      className="bg-white text-[#0A1A3A] hover:bg-gray-100 font-bold text-lg px-8 py-3"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      Schedule Free Inspection
                    </Button>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-gray-600 mb-4">
                      Questions? Call us directly at <strong className="text-[#0A1A3A]">(555) 123-4567</strong>
                    </p>
                    <Link to={createPageUrl("Home")}>
                      <Button className="bg-[#B48A3C] hover:bg-[#9a7532] text-white font-bold">
                        Back to Home
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              {step < 3 && (
                <div className="flex justify-between mt-8 pt-6 border-t">
                  {step > 1 && (
                    <Button
                      onClick={handlePrevStep}
                      variant="outline"
                      className="border-2 border-[#0A1A3A] text-[#0A1A3A] hover:bg-[#0A1A3A] hover:text-white font-semibold"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                  )}
                  <Button
                    onClick={handleNextStep}
                    className="bg-[#B48A3C] hover:bg-[#9a7532] text-white font-bold ml-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        {step === 1 ? 'Continue' : 'Get My Results'}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Trust Indicators */}
          {step < 3 && (
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-2xl font-bold text-[#B48A3C] mb-1">500+</p>
                <p className="text-sm text-white/80">Projects Completed</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-2xl font-bold text-[#B48A3C] mb-1">25+</p>
                <p className="text-sm text-white/80">Years Experience</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-2xl font-bold text-[#B48A3C] mb-1">98%</p>
                <p className="text-sm text-white/80">Satisfaction Rate</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0A1A3A] border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-white/60 text-sm">
          <p>&copy; 2024 Apex Development Group. All rights reserved.</p>
          <p className="mt-2">Building Excellence in Pennsylvania</p>
        </div>
      </footer>
    </div>
  );
}
