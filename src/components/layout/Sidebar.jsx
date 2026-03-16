import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();

  // Read role with fallback to user JSON
  const storedRole = localStorage.getItem("role");
  const role = storedRole || JSON.parse(localStorage.getItem("user") || "{}").role || "TENANT";

  const ownerItems = [
    { title: "Overview", path: "/dashboard", icon: "📊" },
    { title: "Rooms", path: "/dashboard/rooms", icon: "🛏️" },
    { title: "Tenants", path: "/dashboard/tenants", icon: "👥" },
    { title: "Complaint Logs", path: "/dashboard/complaints", icon: "📋" },
    { title: "Visit Requests", path: "/dashboard/inquiries", icon: "👀" },
    { title: "Property Settings", path: "/dashboard/settings", icon: "⚙️" },
  ];

  const tenantItems = [
    { title: "My Stay", path: "/dashboard/tenant", icon: "🏠" },
    { title: "Payments", path: "/dashboard/payments", icon: "💰" },
    { title: "Raise Complaint", path: "/dashboard/complaints", icon: "🛠️" },
  ];

  const menuItems = role === "OWNER" ? ownerItems : tenantItems;

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } bg-[#111827] border-r border-[#1f2937] md:translate-x-0`}
    >
      <div className="h-full px-4 py-6 overflow-y-auto flex flex-col">
        <Link to="/" className="flex items-center mb-10 pl-2 group">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform mr-2">
            S
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">
            Smart<span className="text-blue-500">PG</span>
          </span>
        </Link>
        
        <p className="text-[9px] font-black text-gray-600 uppercase tracking-[0.3em] px-3 mb-4">
          {role === "OWNER" ? "Property Manager" : "Resident Portal"}
        </p>

        <nav className="space-y-1.5 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 768) toggleSidebar?.();
                }}
                className={`flex items-center p-3.5 text-sm font-medium rounded-2xl transition-all duration-200 group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                    : "text-gray-400 hover:bg-[#1f2937] hover:text-white"
                }`}
              >
                <span className="text-lg mr-3">{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="pt-4 border-t border-[#1f2937]">
          <button 
            onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
            className="flex items-center w-full p-3.5 text-sm font-medium rounded-2xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span className="text-lg mr-3">🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
