import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1A3A] via-slate-800 to-[#0A1A3A]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A1A3A]/95 to-[#0A1A3A]/80"></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-6 lg:px-8 text-center">
        <div className="inline-block mb-6">
          <div className="bg-[#B48A3C]/20 backdrop-blur-sm border border-[#B48A3C] px-6 py-3 rounded-full">
            <p className="text-[#B48A3C] text-sm font-bold tracking-wider">
              SCHEDULE YOUR CONSULTATION TODAY
            </p>
          </div>
        </div>

        <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          Ready to Invest in <span className="text-[#B48A3C]">Certainty?</span>
        </h2>

        <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Stop guessing about your property's health. Get a clear, AI-informed
          scope and quote today.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Link to={createPageUrl("QuoteGenerator")}>
            <Button
              size="lg"
              className="bg-[#B48A3C] hover:bg-[#9a7532] text-white font-bold text-xl h-16 px-10 shadow-2xl group"
            >
              Get Your Expert Quote
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <a href="tel:5551234567">
            <Button
              size="lg"
              variant="outline"
              className="border-3 border-white text-white hover:bg-white hover:text-[#0A1A3A] font-bold text-xl h-16 px-10"
            >
              <Phone className="w-6 h-6 mr-3" />
              Call Us: (555) 123-4567
            </Button>
          </a>
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 pt-12 border-t border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <p className="text-4xl font-bold text-[#B48A3C] mb-2">24hr</p>
              <p className="text-gray-400 text-sm">Response Time</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#B48A3C] mb-2">Free</p>
              <p className="text-gray-400 text-sm">Initial Assessment</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#B48A3C] mb-2">Licensed</p>
              <p className="text-gray-400 text-sm">& Fully Insured</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#B48A3C] mb-2">5-Year</p>
              <p className="text-gray-400 text-sm">Warranty Included</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}