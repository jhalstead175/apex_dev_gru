import React from "react";
import { Shield, MapPin, Phone, Mail, Facebook, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1e3a5f] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-8 h-8 text-[#10b981]" />
              <span className="text-xl font-bold">Aegis Spec Group</span>
            </div>
            <p className="text-slate-300 text-sm mb-4">
              Pennsylvania's trusted roofing and building envelope specialists. Licensed, insured, and committed to excellence.
            </p>
            <div className="flex gap-3">
              <a href="https://facebook.com/aegisspecgroup" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com/company/aegisspecgroup" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://instagram.com/aegisspecgroup" target="_blank" rel="noopener noreferrer" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-lg mb-4">Our Services</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li><a href="#services" className="hover:text-[#10b981] transition-colors">Commercial Roofing</a></li>
              <li><a href="#services" className="hover:text-[#10b981] transition-colors">Residential Roofing</a></li>
              <li><a href="#services" className="hover:text-[#10b981] transition-colors">Roof Repair & Replacement</a></li>
              <li><a href="#services" className="hover:text-[#10b981] transition-colors">Building Envelope Solutions</a></li>
              <li><a href="#services" className="hover:text-[#10b981] transition-colors">Emergency Roof Services</a></li>
              <li><a href="#services" className="hover:text-[#10b981] transition-colors">Roof Inspection</a></li>
              <li><a href="#services" className="hover:text-[#10b981] transition-colors">Insurance Claims Assistance</a></li>
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="font-bold text-lg mb-4">Service Areas</h3>
            <ul className="space-y-2 text-slate-300 text-sm">
              <li>Pittsburgh, PA</li>
              <li>Philadelphia, PA</li>
              <li>Harrisburg, PA</li>
              <li>Allentown, PA</li>
              <li>Erie, PA</li>
              <li>Reading, PA</li>
              <li>Scranton, PA</li>
              <li className="text-[#10b981]">+ All Pennsylvania</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <div className="space-y-3 text-slate-300 text-sm">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                <span>123 Main Street<br />Pittsburgh, PA 15222</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#10b981] flex-shrink-0" />
                <a href="tel:+15551234567" className="hover:text-[#10b981] transition-colors">
                  (555) 123-4567
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#10b981] flex-shrink-0" />
                <a href="mailto:info@aegisspecgroup.com" className="hover:text-[#10b981] transition-colors">
                  info@aegisspecgroup.com
                </a>
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-400">
              <p>Monday - Friday: 8:00 AM - 5:00 PM</p>
              <p>Saturday: 9:00 AM - 2:00 PM</p>
              <p>Sunday: Closed</p>
              <p className="text-[#10b981] mt-2">24/7 Emergency Services Available</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© {currentYear} Aegis Spec Group. All rights reserved. Licensed & Insured PA Roofing Contractor.</p>
            <div className="flex gap-6">
              <Link to={createPageUrl("ClientPortal")} className="hover:text-[#10b981] transition-colors">
                Client Portal
              </Link>
              <a href="#privacy" className="hover:text-[#10b981] transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-[#10b981] transition-colors">Terms of Service</a>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500 text-center">
            <p>PA License #123456 | Fully Insured & Bonded | GAF Master Elite Contractor | CertainTeed SELECT ShingleMaster</p>
          </div>
        </div>
      </div>
    </footer>
  );
}