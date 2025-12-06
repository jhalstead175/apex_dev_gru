import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

import LandingNavigation from "../components/landing/LandingNavigation";
import Hero from "../components/landing/Hero";
import TrustBar from "../components/landing/TrustBar";
import Services from "../components/landing/Services";
import Process from "../components/landing/Process";
import Testimonials from "../components/landing/Testimonials";
import FinalCTA from "../components/landing/FinalCTA";
import LandingFooter from "../components/landing/LandingFooter";

export default function Home() {
  const navigate = useNavigate();

  const { data: user, isLoading } = useQuery({
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

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (!isLoading && user && (user.role === 'owner' || user.role === 'manager')) {
      navigate(createPageUrl('Dashboard'));
    } else if (!isLoading && user && user.role === 'client') {
      navigate(createPageUrl('ClientPortal'));
    }
  }, [user, isLoading, navigate]);

  useEffect(() => {
    // Set SEO meta tags
    document.title = "Apex Development Group | Premium Roofing & Building Envelope Contractors in PA";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Expert roofing contractors in Pennsylvania specializing in commercial & residential roof repair, replacement, and building envelope solutions. Licensed, insured, and trusted since 2020. Free inspections available.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Expert roofing contractors in Pennsylvania specializing in commercial & residential roof repair, replacement, and building envelope solutions. Licensed, insured, and trusted since 2020. Free inspections available.";
      document.head.appendChild(meta);
    }

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.setAttribute("content", "roofing contractor PA, Pennsylvania roofing company, commercial roofing, residential roofing, roof repair PA, roof replacement, building envelope, emergency roof repair, roofing inspection Pennsylvania");
    } else {
      const meta = document.createElement('meta');
      meta.name = "keywords";
      meta.content = "roofing contractor PA, Pennsylvania roofing company, commercial roofing, residential roofing, roof repair PA, roof replacement, building envelope, emergency roof repair, roofing inspection Pennsylvania";
      document.head.appendChild(meta);
    }

    const ogTags = [
      { property: "og:title", content: "Apex Development Group | Premium Roofing Contractors in Pennsylvania" },
      { property: "og:description", content: "Expert roofing and building envelope solutions in PA. Licensed, insured, and trusted. Free inspections available." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
    ];

    ogTags.forEach(tag => {
      let ogTag = document.querySelector(`meta[property="${tag.property}"]`);
      if (ogTag) {
        ogTag.setAttribute("content", tag.content);
      } else {
        const meta = document.createElement('meta');
        meta.setAttribute("property", tag.property);
        meta.content = tag.content;
        document.head.appendChild(meta);
      }
    });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = "canonical";
      canonical.href = window.location.origin + window.location.pathname;
      document.head.appendChild(canonical);
    }

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "RoofingContractor",
      "name": "Apex Development Group",
      "image": window.location.origin + "/logo.png",
      "@id": window.location.origin,
      "url": window.location.origin,
      "telephone": "+1-555-123-4567",
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "123 Main Street",
        "addressLocality": "Pittsburgh",
        "addressRegion": "PA",
        "postalCode": "15222",
        "addressCountry": "US"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 40.4406,
        "longitude": -79.9959
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "17:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": "Saturday",
          "opens": "09:00",
          "closes": "14:00"
        }
      ],
      "sameAs": [
        "https://www.facebook.com/apexconstructiongroup",
        "https://www.linkedin.com/company/apexconstructiongroup",
        "https://www.instagram.com/apexconstructiongroup"
      ],
      "areaServed": [
        {
          "@type": "State",
          "name": "Pennsylvania"
        }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Roofing Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Commercial Roofing",
              "description": "Professional commercial roofing installation, repair, and maintenance"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Residential Roofing",
              "description": "Expert residential roof repair and replacement services"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Building Envelope Solutions",
              "description": "Comprehensive building envelope consulting and waterproofing"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Emergency Roof Repair",
              "description": "24/7 emergency roofing services for urgent repairs"
            }
          }
        ]
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "127",
        "bestRating": "5",
        "worstRating": "1"
      }
    };

    let structuredDataScript = document.getElementById('structured-data');
    if (structuredDataScript) {
      structuredDataScript.textContent = JSON.stringify(structuredData);
    } else {
      structuredDataScript = document.createElement('script');
      structuredDataScript.id = 'structured-data';
      structuredDataScript.type = 'application/ld+json';
      structuredDataScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(structuredDataScript);
    }
  }, []);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#0b1d3a] to-[#1a3355]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#c8a559] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <LandingNavigation />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Trust Bar */}
        <TrustBar />

        {/* Services Section */}
        <Services />

        {/* Process Section */}
        <Process />

        {/* Testimonials */}
        <Testimonials />

        {/* Final CTA */}
        <FinalCTA />

        {/* SEO Content Section */}
        <section className="bg-slate-50 py-16" id="about">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none">
              <h2 className="text-3xl font-bold text-[#0b1d3a] mb-6">
                Pennsylvania's Premier Roofing Contractor & Building Envelope Specialists
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 text-slate-700">
                <div>
                  <h3 className="text-xl font-bold text-[#0b1d3a] mb-3">
                    Expert Roofing Services Across Pennsylvania
                  </h3>
                  <p className="mb-4">
                    Apex Development Group is Pennsylvania's trusted roofing contractor, serving residential and commercial properties throughout the state. Our licensed and insured team specializes in roof repair, roof replacement, emergency roofing services, and comprehensive building envelope solutions.
                  </p>
                  <p className="mb-4">
                    With years of experience serving Pittsburgh, Philadelphia, Harrisburg, and surrounding areas, we've built our reputation on quality workmanship, transparent pricing, and exceptional customer service. Whether you need a simple roof repair or a complete roofing system replacement, our expert technicians deliver results that last.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#0b1d3a] mb-3">
                    Why Choose Apex Development Group for Your Roofing Needs?
                  </h3>
                  <ul className="space-y-2">
                    <li>✓ <strong>Licensed & Insured</strong> - Fully certified Pennsylvania roofing contractors</li>
                    <li>✓ <strong>Free Inspections</strong> - Complimentary roof assessments and estimates</li>
                    <li>✓ <strong>5-Year Warranty</strong> - Industry-leading workmanship guarantee</li>
                    <li>✓ <strong>Emergency Services</strong> - 24/7 availability for urgent roof repairs</li>
                    <li>✓ <strong>Premium Materials</strong> - Top-quality roofing systems from trusted manufacturers</li>
                    <li>✓ <strong>Insurance Claims</strong> - Expert assistance with insurance claim processing</li>
                    <li>✓ <strong>Transparent Pricing</strong> - Detailed quotes with no hidden fees</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}