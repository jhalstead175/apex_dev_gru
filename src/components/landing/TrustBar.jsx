import React from "react";
import { Award, Shield, Star, CheckCircle } from "lucide-react";

export default function TrustBar() {
  const partners = [
    { name: "National Roofing Certification", icon: Award },
    { name: "GAF Master Elite", icon: Shield },
    { name: "CertainTeed ShingleMaster", icon: Star },
    { name: "Local Insurance Group", icon: CheckCircle },
  ];

  return (
    <section className="bg-white border-y border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <p className="text-center text-gray-600 font-semibold text-sm tracking-wider uppercase mb-8">
          Trusted By Partners Like
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner, index) => {
            const Icon = partner.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center gap-3 p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all"
              >
                <Icon className="w-10 h-10 text-[#B48A3C]" />
                <p className="text-center text-sm font-medium text-gray-700">
                  {partner.name}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}