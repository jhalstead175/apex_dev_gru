import React from "react";
import Navigation from "../components/landing/Navigation";
import Hero from "../components/landing/Hero";
import TrustBar from "../components/landing/TrustBar";
import Services from "../components/landing/Services";
import Process from "../components/landing/Process";
import Testimonials from "../components/landing/Testimonials";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      <style>{`
        :root {
          --navy: #0A1A3A;
          --gold: #B48A3C;
          --light-gray: #f8f9fa;
        }
        * {
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
        }
        h1, h2, h3 {
          font-family: 'Poppins', 'Inter', sans-serif;
        }
      `}</style>

      <Navigation />
      <Hero />
      <TrustBar />
      <Services />
      <Process />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}