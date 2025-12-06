import React from "react";
import { Search, FileCheck, Settings, Shield } from "lucide-react";

export default function Process() {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Diagnostic Analysis",
      description:
        "We begin with a data-driven inspection, using drone technology and moisture mapping to go beyond the surface.",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      number: "02",
      icon: FileCheck,
      title: "Transparent Specification",
      description:
        "You receive a detailed scope of work and unbiased material recommendations, with clear pricing and a definitive timeline.",
      color: "text-[#B48A3C]",
      bgColor: "bg-amber-50",
    },
    {
      number: "03",
      icon: Settings,
      title: "Meticulous Execution",
      description:
        "Our vetted crews execute the project with precision, supported by our proprietary project management platform for seamless communication.",
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
    {
      number: "04",
      icon: Shield,
      title: "Long-Term Guardianship",
      description:
        "Your project includes a comprehensive warranty and a place in our long-term client care program.",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <section id="process" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-[#0A1A3A] mb-4">
            The Aegis Standard
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our proven process ensures excellence at every stage
          </p>
        </div>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-[#B48A3C] to-purple-500 transform -translate-x-1/2"></div>

          <div className="space-y-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={index}
                  className={`relative flex items-center ${
                    isEven ? "lg:flex-row" : "lg:flex-row-reverse"
                  } flex-col gap-8`}
                >
                  {/* Content */}
                  <div
                    className={`lg:w-5/12 ${
                      isEven ? "lg:text-right" : "lg:text-left"
                    } text-center`}
                  >
                    <div
                      className={`inline-block ${step.bgColor} px-4 py-2 rounded-full mb-4`}
                    >
                      <span
                        className={`${step.color} font-bold text-sm tracking-wider`}
                      >
                        STEP {step.number}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#0A1A3A] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Center Icon */}
                  <div className="lg:w-2/12 flex justify-center">
                    <div
                      className={`w-20 h-20 ${step.bgColor} rounded-full flex items-center justify-center shadow-xl border-4 border-white z-10`}
                    >
                      <Icon className={`w-10 h-10 ${step.color}`} />
                    </div>
                  </div>

                  {/* Spacer */}
                  <div className="lg:w-5/12"></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}