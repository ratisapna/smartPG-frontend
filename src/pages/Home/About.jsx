import React from "react";

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20 space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white">About <span className="text-blue-500">SmartPG</span></h1>
        <p className="text-gray-500 max-w-2xl mx-auto italic">Redefining modern living for professionals and students across India.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="rounded-[3rem] overflow-hidden border border-[#1f2937]">
          <img src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800" alt="Living space" />
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white">Our Mission</h2>
          <p className="text-gray-400 leading-relaxed">
            SmartPG was founded on a simple belief: finding a home away from home shouldn't be a hassle. 
            We've built a platform that bridges the gap between property owners and tenants, 
            ensuring transparency, safety, and comfort at every step.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
             <div className="p-4 bg-[#111827] rounded-2xl border border-[#1f2937]">
                <p className="text-3xl font-black text-blue-500">500+</p>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Properties</p>
             </div>
             <div className="p-4 bg-[#111827] rounded-2xl border border-[#1f2937]">
                <p className="text-3xl font-black text-blue-500">10k+</p>
                <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mt-1">Happy Tenants</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
