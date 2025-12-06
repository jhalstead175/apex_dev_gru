import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Hero() {
  const scrollToProcess = () => {
    const element = document.getElementById("process");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A1A3A] via-[#1a2a4a] to-[#0A1A3A] animate-gradient-slow">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-[#B48A3C] rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8">
            <div className="inline-block">
              <div className="bg-[#B48A3C]/20 backdrop-blur-sm border border-[#B48A3C] px-4 py-2 rounded-full">
                <p className="text-[#B48A3C] text-sm font-semibold tracking-wide">
                  TRUSTED BUILDING ENVELOPE EXPERTS
                </p>
              </div>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Precision Building Envelope Solutions for{" "}
              <span className="text-[#B48A3C]">Pennsylvania</span>
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed">
              Apex Development Group leverages data-driven analysis and expert
              consultation to protect your most valuable asset.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={createPageUrl("QuoteGenerator")}>
                <Button
                  size="lg"
                  className="bg-[#B48A3C] hover:bg-[#9a7532] text-white font-bold text-lg h-14 px-8 shadow-2xl group"
                >
                  <Calendar className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Schedule Your Free Property Assessment
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                onClick={scrollToProcess}
                className="border-2 border-white text-white hover:bg-white hover:text-[#0A1A3A] font-bold text-lg h-14 px-8 group"
              >
                View Our Process
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <p className="text-3xl font-bold text-[#B48A3C]">500+</p>
                <p className="text-sm text-gray-400">Projects Completed</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#B48A3C]">25+</p>
                <p className="text-sm text-gray-400">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#B48A3C]">98%</p>
                <p className="text-sm text-gray-400">Client Satisfaction</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-[#B48A3C]/30">
              <div className="aspect-video bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <div className="text-center text-white/40">
                  <p className="text-sm mb-2">Video Placeholder</p>
                  <p className="text-xs">Drone footage of modern roofing project</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A1A3A]/50 to-transparent"></div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-2xl p-6 max-w-xs">
              <div className="flex items-center gap-3">
                <div className="bg-[#B48A3C] text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl">
                  A+
                </div>
                <div>
                  <p className="font-bold text-[#0A1A3A]">BBB Accredited</p>
                  <p className="text-sm text-gray-600">Since 1998</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}