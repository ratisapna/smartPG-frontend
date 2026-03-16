import React from "react";

const StatsCard = ({ title, value, icon, trend, trendValue, color }) => {
  const colorMap = {
    blue: "from-blue-600/20 to-blue-600/5 text-blue-500 ring-blue-500/20",
    green: "from-emerald-600/20 to-emerald-600/5 text-emerald-500 ring-emerald-500/20",
    yellow: "from-amber-600/20 to-amber-600/5 text-amber-500 ring-amber-500/20",
    red: "from-rose-600/20 to-rose-600/5 text-rose-500 ring-rose-500/20",
  };

  return (
    <div className={`p-6 rounded-2xl bg-gradient-to-br ${colorMap[color]} ring-1 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-[#0b0f19] rounded-xl text-2xl ring-1 ring-[#1f2937]">
          {icon}
        </div>
        {trend && (
          <div className={`px-2 py-1 rounded-full text-xs font-bold ${trend === "up" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"}`}>
            {trend === "up" ? "↑" : "↓"} {trendValue}
          </div>
        )}
      </div>
      <div>
        <h3 className="text-gray-400 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
