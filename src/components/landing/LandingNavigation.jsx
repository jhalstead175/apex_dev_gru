import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Building2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import logo from "@/assets/apex-dev-gru-logo.png";

export default function LandingNavigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      try {
        return await base44.auth.me();
      } catch {
        return null;
      }
    },
    retry: false,
  });

  const navLinks = [
    { label: "Home", to: createPageUrl("Home") },
    { label: "Services", to: createPageUrl("Home") + "#services" },
    { label: "About", to: createPageUrl("Home") + "#about" },
    { label: "Partner Program", to: createPageUrl("ReferralLandingPage") },
  ];

  return (
    <nav className="bg-[#0b1d3a]/95 backdrop-blur-lg border-b border-[#c8a559]/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={createPageUrl("Home")} className="flex items-center gap-2">
            <img src={logo} alt="Apex Development Group Logo" className="w-10 h-10 rounded-lg object-contain bg-white p-1" />
            <span className="text-white font-bold text-lg hidden sm:block">
              Apex Development Group
            </span>
            <span className="text-white font-bold text-lg sm:hidden">
              Apex
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                className="text-slate-300 hover:text-[#c8a559] transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to={createPageUrl("Dashboard")}>
                <Button className="bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a] font-bold">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="text-white hover:text-[#c8a559]"
                  onClick={() => base44.auth.redirectToLogin(createPageUrl("Dashboard"))}
                >
                  Sign In
                </Button>
                <Button
                  className="bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a] font-bold"
                  onClick={() => base44.auth.redirectToLogin(createPageUrl("Dashboard"))}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0b1d3a] border-t border-[#c8a559]/20">
          <div className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.to}
                className="block text-slate-300 hover:text-[#c8a559] transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="pt-3 border-t border-[#c8a559]/20 space-y-2">
              {user ? (
                <Link to={createPageUrl("Dashboard")} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a] font-bold">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Button
                    variant="outline"
                    className="w-full border-white text-white hover:bg-white/10"
                    onClick={() => {
                      base44.auth.redirectToLogin(createPageUrl("Dashboard"));
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="w-full bg-[#c8a559] hover:bg-[#d4af37] text-[#0b1d3a] font-bold"
                    onClick={() => {
                      base44.auth.redirectToLogin(createPageUrl("Dashboard"));
                      setMobileMenuOpen(false);
                    }}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}