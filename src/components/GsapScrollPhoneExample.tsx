'use client';

import React from 'react';
import GsapScrollPhone from './GsapScrollPhone';

/**
 * Example usage of GsapScrollPhone component
 * 
 * This demonstrates how to integrate the cinematic scroll phone
 * into your page with custom content before and after.
 */
const GsapScrollPhoneExample: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <header className="bg-white px-32 py-6 relative z-50">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-black">
            BondsIndia
          </h1>
          
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6 text-sm font-medium tracking-tight text-black">
              <a href="#" className="hover:opacity-70 transition-opacity">
                Bonds
              </a>
              <a href="#" className="hover:opacity-70 transition-opacity">
                Resources
              </a>
            </nav>
            
            <a href="#" className="text-sm font-medium tracking-tight text-black hover:opacity-70 transition-opacity">
              Download App
            </a>
            
            <button className="flex items-center justify-center gap-1.5 rounded bg-[#3be2e4] px-3 py-2.5 text-sm font-medium tracking-tight text-black transition-all hover:bg-[#2dd1d3]">
              <span>Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Content */}
      <section className="px-32 py-20 text-center">
        <h2 className="text-6xl font-bold mb-4">
          Invest in bonds with
        </h2>
        <div className="text-6xl font-bold bg-gradient-to-b from-[#06C3C5] to-[#035E5F] bg-clip-text text-transparent">
          9-12% fixed returns
        </div>
        <div className="flex items-center justify-center gap-6 mt-8">
          <span className="text-lg font-medium">SEBI Registered</span>
          <span>⭐</span>
          <span className="text-lg font-medium">Invest as low as ₹1,000</span>
          <span>⭐</span>
          <span className="text-lg font-medium">Zero brokerage</span>
        </div>
      </section>

      {/* Cinematic Scroll Phone Section */}
      <GsapScrollPhone
        phoneImage="/version 3/mobile-frame.png"
        contentImage="/version 3/app-scroll.png"
        phoneWidth={390}
        contentHeight={3500}
      />

      {/* Footer or Next Section */}
      <section className="px-32 py-20 bg-gray-50 text-center">
        <h3 className="text-4xl font-bold mb-4">
          Ready to start investing?
        </h3>
        <button className="px-8 py-4 bg-[#3be2e4] rounded-lg text-lg font-medium hover:bg-[#2dd1d3] transition-all">
          Get Started
        </button>
      </section>
    </div>
  );
};

export default GsapScrollPhoneExample;
