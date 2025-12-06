import React from "react";
import { Card } from "@/components/ui/card";
import { Home, ClipboardCheck, Layers } from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Home,
      title: "Roofing & Waterproofing",
      description:
        "From material specification and insurance claim advocacy to precision installation and long-term performance auditing.",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: ClipboardCheck,
      title: "Building Envelope Consulting",
      description:
        "Independent analysis, performance specs, and project management for new construction and remediation projects.",
      color: "from-[#B48A3C] to-[#9a7532]",
    },
    {
      icon: Layers,
      title: "Exterior Systems",
      description:
        "Siding, windows, and insulation specification to ensure aesthetic harmony, durability, and optimal energy efficiency.",
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  return (
    <section id="services" className="py-24 bg-[#f8f9fa]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0A1A3A] mb-4">
            Our Specialized Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Moving beyond construction to comprehensive specification and
            management
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card
                key={index}
                className="bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden group"
              >
                <div className="p-8 space-y-4">
                  <div
                    className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0A1A3A]">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div
                  className={`h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
                ></div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}