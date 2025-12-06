import React from "react";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      text: "Apex Development Group didn't just replace our roof; they managed the entire insurance process and specified a system that improved our building's energy rating. They are true consultants.",
      author: "Michael R.",
      role: "Property Portfolio Manager",
      rating: 5,
    },
    {
      text: "The level of detail and communication throughout the project was exceptional. We always knew what was happening and when. No surprises, just quality work.",
      author: "Sarah L.",
      role: "Homeowner in Lehigh Valley",
      rating: 5,
    },
    {
      text: "As a commercial developer, I need partners who understand the technical side. Apex Development Group brought engineering-level expertise to our building envelope remediation.",
      author: "James T.",
      role: "Commercial Real Estate Developer",
      rating: 5,
    },
    {
      text: "Their drone inspection caught issues that three other contractors missed. The detailed report gave us exactly what we needed for our insurance claim.",
      author: "Patricia M.",
      role: "Facility Manager",
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#0A1A3A] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#B48A3C] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by Property Professionals
          </h2>
          <p className="text-xl text-gray-400">
            See what our clients say about working with Apex Development Group
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 hover:bg-white/10 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Quote Icon */}
                <Quote className="w-10 h-10 text-[#B48A3C] opacity-50" />

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#B48A3C] text-[#B48A3C]"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-white text-lg leading-relaxed italic">
                  "{testimonial.text}"
                </p>

                {/* Author Info */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-white font-bold">{testimonial.author}</p>
                  <p className="text-[#B48A3C] text-sm">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}