import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#0b0f19] border-t border-[#1f2937] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base">S</div>
              <span className="text-xl font-bold text-white tracking-tight">SmartPG</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Revolutionizing the PG and rental housing industry with technology and trust. Your home, managed better.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 italic">Quick Links</h4>
            <ul className="space-y-4">
              <li><Link to="/rooms" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">Find Rooms</Link></li>
              <li><Link to="/about" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-blue-500 text-sm transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 italic">Support</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-500 text-sm">
                <span>📧</span> support@smartpg.com
              </li>
              <li className="flex items-center gap-3 text-gray-500 text-sm">
                <span>📞</span> +91 99000 12134
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6 italic">Address</h4>
            <p className="text-gray-500 text-sm leading-relaxed">
              123 Tech Square, Phase 3,<br />
              Electronic City, Bangalore - 560100
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1f2937] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            © 2026 SmartPG Management System. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-xs">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white text-xs">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
