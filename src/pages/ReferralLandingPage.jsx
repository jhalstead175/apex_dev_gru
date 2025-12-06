
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Gift, 
  DollarSign, 
  Users, 
  CheckCircle, 
  ArrowRight,
  Shield,
  Clock,
  TrendingUp
} from "lucide-react";
import LandingNavigation from "../components/landing/LandingNavigation";
import LandingFooter from "../components/landing/LandingFooter";

export default function ReferralLandingPage() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1d3a] via-[#1a3355] to-[#0b1d3a]">
      {/* Navigation */}
      <LandingNavigation />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-[#c8a559]/10 border border-[#c8a559]/30 rounded-full px-4 py-2 mb-6">
            <span className="text-[#c8a559] font-semibold text-sm">Partner-Profit Program</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Earn 4% On Every
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#c8a559] to-[#d4af37]">
              Successful Referral
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-10 max-w-3xl mx-auto">
            When your referral becomes a happy Apex customer, you earn 4% of the project value. 
            It's our way of saying thank you for trusting us with your network.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("ReferralPortal")}>
              <Button size="lg" className="bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a] font-bold h-14 px-8 text-lg">
                Submit a Referral
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-[#c8a559] text-[#c8a559] hover:bg-[#c8a559]/10 h-14 px-8 text-lg"
              onClick={() => scrollToSection('how')}
            >
              How It Works
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: DollarSign, label: "4% Commission", desc: "On project value" },
              { icon: Clock, label: "Fast Payouts", desc: "After completion" },
              { icon: Shield, label: "Trusted Partner", desc: "5-year warranty" },
              { icon: TrendingUp, label: "Track Earnings", desc: "Real-time portal" }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="bg-[#c8a559]/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-8 h-8 text-[#c8a559]" />
                </div>
                <p className="font-bold text-white">{item.label}</p>
                <p className="text-sm text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-[#0b1d3a] text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-slate-600 mb-16 text-lg">
            Three simple steps to start earning
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Share Your Referral",
                desc: "Submit your lead's information before they contact us. Make sure they're new to Apex and within Pennsylvania.",
                icon: Users
              },
              {
                step: "2",
                title: "We Do The Work",
                desc: "Our team contacts your referral, provides a quote, and completes the project with our 5-year warranty guarantee.",
                icon: CheckCircle
              },
              {
                step: "3",
                title: "You Get Paid",
                desc: "When the project is completed and paid in full, you receive 4% of the final contract value via your preferred method.",
                icon: DollarSign
              }
            ].map((item, idx) => (
              <Card key={idx} className="bg-white border-2 border-slate-200 hover:border-[#c8a559] transition-all shadow-lg">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-[#c8a559] to-[#d4af37] text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mb-6">
                    {item.step}
                  </div>
                  <item.icon className="w-12 h-12 text-[#c8a559] mb-4" />
                  <h3 className="text-xl font-bold text-[#0b1d3a] mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Rules Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-[#0b1d3a] text-center mb-4">
            Program Rules
          </h2>
          <p className="text-center text-slate-600 mb-12 text-lg">
            Simple, transparent guidelines
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-slate-200">
            <div className="space-y-4">
              {[
                "Eligible referrers: past customers & professional partners (not Apex employees)",
                "Lead must be new to Apex Construction Group with no prior contact",
                "Payment issued after project completion and full payment collection",
                "Referral must be submitted before the lead contacts us",
                "4% commission based on final contract value",
                "Service area: Pennsylvania only",
                "Program terms may change; all qualified submissions will be honored"
              ].map((rule, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#c8a559] flex-shrink-0 mt-0.5" />
                  <p className="text-slate-700">{rule}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-[#0b1d3a] text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-slate-600 mb-12 text-lg">
            Everything you need to know
          </p>
          
          <div className="space-y-4">
            {[
              {
                q: "How much do I earn per referral?",
                a: "You earn 4% of the final contract value. For example, a $25,000 project earns you $1,000."
              },
              {
                q: "When do I get paid?",
                a: "Payment is issued after the project is completed and paid in full by the client. This ensures quality completion and client satisfaction."
              },
              {
                q: "How do I submit a referral?",
                a: "Create an account in our Partner Portal and use the simple referral form. You'll be able to track your referrals and earnings in real-time."
              },
              {
                q: "What payment methods are available?",
                a: "We offer Check, Zelle, Venmo, PayPal, ACH transfer, and other methods. Choose your preference when you submit the referral."
              },
              {
                q: "Can I refer commercial projects?",
                a: "Absolutely! Commercial projects typically have higher values, meaning larger referral fees for you."
              },
              {
                q: "What if my referral doesn't move forward?",
                a: "No worries! You're only paid when a project is completed. There's no penalty if a lead doesn't convert."
              }
            ].map((faq, idx) => (
              <Card key={idx} className="bg-slate-50 border-2 border-slate-200 hover:border-[#c8a559] transition-all">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg text-[#0b1d3a] mb-2">{faq.q}</h3>
                  <p className="text-slate-600">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#0b1d3a] to-[#1a3355]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-slate-300 mb-10">
            Join our Partner-Profit Program today and turn your network into income.
          </p>
          <Link to={createPageUrl("ReferralPortal")}>
            <Button size="lg" className="bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a] font-bold h-16 px-10 text-xl">
              Submit Your First Referral
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
          </Link>
          <p className="text-sm text-slate-400 mt-6">
            Built on Trust. Rewarded by Results.
          </p>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
