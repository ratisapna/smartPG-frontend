import React from "react";

const Navbar = ({ toggleSidebar, user }) => {
  return (
    <header className="fixed top-0 right-0 left-0 bg-[#0b0f19]/80 backdrop-blur-md border-b border-[#1f2937] z-30 md:left-64">
      <div className="px-4 py-3 flex items-center justify-between">
        <button
          onClick={toggleSidebar}
          className="p-2 mr-2 text-gray-400 md:hidden hover:bg-[#1f2937] rounded-lg transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="hidden md:block">
          <h2 className="text-lg font-semibold text-white">Dashboard</h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-[#1f2937] rounded-full relative transition-all">
             <span className="text-xl">🔔</span>
             <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-[#0b0f19] rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-2 border-l border-[#1f2937]">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user?.name || "Owner"}</p>
              <p className="text-xs text-gray-500">{user?.role || "Admin"}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer ring-2 ring-blue-600/20 hover:ring-blue-600/40 transition-all">
              {user?.name?.charAt(0) || "O"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
