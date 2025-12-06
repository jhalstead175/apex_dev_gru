import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Building2, Mail, Phone, MapPin, Facebook, Linkedin, Instagram } from "lucide-react";

export default function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0b1d3a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-[#c8a559] to-[#d4af37] p-2 rounded-lg">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">Apex Construction</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Premium roofing and building envelope solutions in Pennsylvania. 
              Built on trust, rewarded by results.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#c8a559] p-2 rounded-lg transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#c8a559] p-2 rounded-lg transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#c8a559] p-2 rounded-lg transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#c8a559]">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={createPageUrl("Home")} className="text-slate-400 hover:text-[#c8a559] transition-colors">
                  Commercial Roofing
                </Link>
              </li>
              <li>
                <Link to={createPageUrl("Home")} className="text-slate-400 hover:text-[#c8a559] transition-colors">
                  Residential Roofing
                </Link>
              </li>
              <li>
                <Link to={createPageUrl("Home")} className="text-slate-400 hover:text-[#c8a559] transition-colors">
                  Building Envelope
                </Link>
              </li>
              <li>
                <Link to={createPageUrl("Home")} className="text-slate-400 hover:text-[#c8a559] transition-colors">
                  Emergency Repairs
                </Link>
              </li>
              <li>
                <Link to={createPageUrl("QuoteGenerator")} className="text-slate-400 hover:text-[#c8a559] transition-colors">
                  Get a Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#c8a559]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to={createPageUrl("Home")} className="text-slate-400 hover:text-[#c8a559] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to={createPageUrl("ReferralLandingPage")} className="text-slate-400 hover:text-[#c8a559] transition-colors">
                  Partner Program
                </Link>
              </li>
              <li>
                <Link to={createPageUrl("ReferralPortal")} className="text-slate-400 hover:text-[#c8a559] transition-colors">
                  Partner Portal
                </Link>
              </li>
              <li>
                <Link to={createPageUrl("ClientPortal")} className="text-slate-400 hover:text-[#c8a559] transition-colors">
                  Client Portal
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-[#c8a559] transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-400 hover:text-[#c8a559] transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-[#c8a559]">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#c8a559]" />
                <span>123 Main Street<br />Pittsburgh, PA 15222</span>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Phone className="w-4 h-4 text-[#c8a559]" />
                <a href="tel:+15551234567" className="hover:text-[#c8a559] transition-colors">
                  (555) 123-4567
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-400">
                <Mail className="w-4 h-4 text-[#c8a559]" />
                <a href="mailto:info@apexcg.com" className="hover:text-[#c8a559] transition-colors">
                  info@apexcg.com
                </a>
              </li>
            </ul>
            <div className="mt-4 bg-[#c8a559]/10 border border-[#c8a559]/30 rounded-lg p-3">
              <p className="text-xs text-[#c8a559] font-bold mb-1">Business Hours</p>
              <p className="text-xs text-slate-400">Mon-Fri: 8:00 AM - 5:00 PM</p>
              <p className="text-xs text-slate-400">Sat: 9:00 AM - 2:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#c8a559]/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-slate-400">
              &copy; {currentYear} Apex Construction Group. All rights reserved.
            </p>
            <p className="text-sm text-slate-400">
              Pennsylvania Licensed Contractor | 5-Year Warranty on All Work
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}