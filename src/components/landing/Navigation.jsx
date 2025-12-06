import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield } from "lucide-react";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0A1A3A] shadow-2xl"
          : "bg-[#0A1A3A]/80 backdrop-blur-md"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#B48A3C] to-[#9a7532] p-2 rounded-lg shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-xl tracking-tight">
                Aegis Spec Group
              </h1>
              <p className="text-[#B48A3C] text-xs font-medium">
                Building Excellence
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection("process")}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Our Process
            </button>
            <button
              onClick={() => scrollToSection("testimonials")}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Testimonials
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-300 hover:text-white transition-colors font-medium"
            >
              Contact
            </button>
          </div>

          {/* CTA Button */}
          <Link to={createPageUrl("QuoteGenerator")}>
            <Button className="bg-[#B48A3C] hover:bg-[#9a7532] text-white font-bold shadow-lg">
              Get Your Expert Quote
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}