import React, { useState } from "react";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Rooms", path: "/" },
    { name: "Amenities", path: "/#amenities" },
    { name: "About Us", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm) {
        window.location.href = `/?search=${encodeURIComponent(searchTerm)}#rooms`;
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0b0f19]/80 backdrop-blur-lg border-b border-[#1f2937]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
              S
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Smart<span className="text-blue-500">PG</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-400 hover:text-white font-medium transition-colors"
                onClick={() => {
                   if (link.path.startsWith("/#")) {
                       const id = link.path.split("#")[1];
                       document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
                   }
                }}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search & Auth */}
          <div className="hidden md:flex items-center gap-6">
            <div className="relative group">
               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
               <input 
                 type="text" 
                 placeholder="Search location..." 
                 className="bg-[#111827] border border-[#1f2937] rounded-full py-2 pl-10 pr-4 text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-48 lg:w-64 transition-all"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 onKeyDown={handleSearch}
               />
            </div>
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-gray-300 hover:text-white font-bold text-sm">
                Login
              </Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold text-sm transition-all shadow-lg shadow-blue-900/40">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0b0f19] border-b border-[#1f2937] animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="block px-3 py-4 text-base font-medium text-gray-400 hover:text-white hover:bg-[#111827] rounded-xl"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 flex flex-col gap-3">
              <Link to="/login" className="px-3 py-4 text-center font-bold text-gray-300 hover:text-white border border-[#1f2937] rounded-xl">
                Login
              </Link>
              <Link to="/signup" className="px-3 py-4 text-center font-bold bg-blue-600 text-white rounded-xl">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
