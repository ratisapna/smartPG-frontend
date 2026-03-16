import React, { useState, useEffect } from "react";
import StatsCard from "../../components/dashboard/StatsCard";
import { getOwnerDashboard } from "../../api/dashboardService";
import { Link } from "react-router-dom";

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getOwnerDashboard();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (data?.noPg) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <div className="w-32 h-32 bg-blue-600/10 rounded-full flex items-center justify-center text-6xl mb-8 animate-bounce">
          🏠
        </div>
        <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Welcome to SmartPG!</h1>
        <p className="text-gray-400 max-w-md text-lg leading-relaxed mb-10">
          You haven't listed your property yet. To start managing tenants and tracking revenue, please list your PG first.
        </p>
        <Link 
          to="/dashboard/settings" 
          className="px-12 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-blue-900/40 hover:scale-[1.05] active:scale-[0.95]"
        >
          🚀 List Your PG Now
        </Link>
      </div>
    );
  }

  const stats = [
    { title: "Total Revenue", value: `₹${data?.totalRevenue || "0"}`, icon: "💰", trend: "up", trendValue: "12%", color: "green" },
    { title: "Total Tenants", value: data?.totalTenants || "0", icon: "👥", trend: "up", trendValue: "8%", color: "blue" },
    { title: "Occupancy Rate", value: `${data?.occupancyRate || "0"}%`, icon: "🏠", trend: "down", trendValue: "2%", color: "yellow" },
    { title: "Active Complaints", value: data?.activeComplaints || "0", icon: "🛠️", trend: "down", trendValue: "5%", color: "red" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">
            Dashboard
            <span className="text-blue-500 block text-lg font-medium tracking-normal mt-1">{data?.pgName || "Your Property"}</span>
          </h1>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <StatsCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-[#111827]/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-[#1f2937]">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-white tracking-tight">Recent Activity</h2>
          </div>
          <div className="space-y-6">
            {data?.recentActivities?.length > 0 ? (
                data.recentActivities.map((activity, idx) => (
                    <div key={idx} className="flex items-center gap-6 p-5 rounded-[1.5rem] bg-[#0b0f19]/50 border border-[#1f2937] hover:border-blue-500/30 transition-all group">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                            {activity.type.includes("PAYMENT") ? "💵" : 
                             activity.type.includes("TENANT") ? "👥" : 
                             activity.type.includes("COMPLAINT") ? "🛠️" : "📋"}
                        </div>
                        <div className="flex-1">
                            <p className="text-white font-bold text-lg">{activity.message}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                <span>📅</span> {new Date(activity.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-20 bg-[#0b0f19]/30 rounded-[2rem] border-2 border-dashed border-[#1f2937]">
                    <span className="text-6xl block mb-4 opacity-20">🍃</span>
                    <p className="text-gray-500 font-medium italic mb-6">No recent activity detected.</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <Link to="/dashboard/rooms" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all">Add First Room</Link>
                        <Link to="/dashboard/tenants" className="px-6 py-3 bg-[#111827] text-white border border-[#1f2937] rounded-xl font-bold text-sm hover:bg-[#1f2937] transition-all">Add First Tenant</Link>
                    </div>
                </div>
            )}
          </div>
        </div>

        {/* Quick Actions / Summary */}
        <div className="space-y-8">
             <div className="bg-[#111827]/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-[#1f2937]">
                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest text-center">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-4">
                    <Link to="/dashboard/rooms" className="flex items-center gap-4 p-5 rounded-2xl bg-blue-600/10 border border-blue-500/20 hover:bg-blue-600/20 transition-all group">
                         <span className="text-2xl group-hover:scale-110 transition-transform">🛏️</span>
                         <div className="flex-1">
                             <p className="text-white font-bold">Manage Rooms</p>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Add or edit units</p>
                         </div>
                    </Link>
                    <Link to="/dashboard/tenants" className="flex items-center gap-4 p-5 rounded-2xl bg-emerald-600/10 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all group">
                         <span className="text-2xl group-hover:scale-110 transition-transform">👥</span>
                         <div className="flex-1">
                             <p className="text-white font-bold">Manage Tenants</p>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Add or verify residents</p>
                         </div>
                    </Link>
                    <Link to="/dashboard/complaints" className="flex items-center gap-4 p-5 rounded-2xl bg-red-600/10 border border-red-500/20 hover:bg-red-600/20 transition-all group">
                         <span className="text-2xl group-hover:scale-110 transition-transform">📋</span>
                         <div className="flex-1">
                             <p className="text-white font-bold">View Complaints</p>
                             <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Resolve issues</p>
                         </div>
                    </Link>
                </div>
             </div>

             <div className="bg-[#111827]/50 backdrop-blur-xl rounded-[2.5rem] p-8 border border-[#1f2937]">
                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest text-center">Action Required</h3>
                <div className="space-y-4">
                    {data?.pendingVisits > 0 && (
                      <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#0b0f19] border border-[#1f2937] hover:border-yellow-500/30 transition-all">
                          <div className="text-2xl">👀</div>
                          <div className="flex-1">
                            <p className="text-sm text-white font-bold">Visit Requests</p>
                            <span className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">{data.pendingVisits} PENDING</span>
                          </div>
                          <Link to="/dashboard/inquiries" className="px-3 py-1 bg-yellow-500/10 text-yellow-500 rounded-lg text-[10px] font-black uppercase hover:bg-yellow-500/20 transition-all">Manage</Link>
                      </div>
                    )}
                    {(!data?.pendingVisits) && (
                      <div className="text-center py-10 opacity-50">
                         <span className="text-4xl block mb-2">✅</span>
                         <p className="text-gray-500 text-xs font-black uppercase tracking-widest">All tasks completed</p>
                      </div>
                    )}
                </div>
             </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
