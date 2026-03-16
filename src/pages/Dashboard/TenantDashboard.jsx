import React, { useState, useEffect } from "react";
import StatsCard from "../../components/dashboard/StatsCard";
import { getTenantDashboard } from "../../api/dashboardService";
import { uploadDocument } from "../../api/documentService";
import { markFeeAsPaid } from "../../api/feeService";
import axios from "axios";
import { toast } from "react-toastify";

const TenantDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // For demo purposes, we'll use a hardcoded tenantId or get from localstorage/auth
  const tenantId = localStorage.getItem("tenantId") || "current";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getTenantDashboard();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching tenant dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleKYCUpload = async (type, e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const { uploadUrl } = await uploadDocument({
            type,
            fileName: file.name,
            fileType: file.type
        });

        await axios.put(uploadUrl, file, {
            headers: { "Content-Type": file.type }
        });

        toast.success(`${type} uploaded successfully!`);
        // Refresh data
        const result = await getTenantDashboard();
        setData(result.data);
    } catch (err) {
        toast.error("Upload failed");
        console.error(err);
    }
  };

  const handlePayRent = async () => {
      toast.info("Razorpay integration coming soon! For now, please pay via manual mode.");
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const stats = [
    { title: "Due Amount", value: `₹${data?.dueAmount || "0"}`, icon: "⌛", trend: data?.dueAmount > 0 ? "up" : "down", trendValue: "Cycle", color: "red" },
    { title: "Current Status", value: data?.status || "Active", icon: "✅", color: "green" },
    { title: "Last Payment", value: data?.lastPaymentDate ? new Date(data.lastPaymentDate).toLocaleDateString() : "None", icon: "📅", color: "blue" },
    { title: "Complaints", value: data?.openComplaints || "0", icon: "🛠️", color: "yellow" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tighter">My Dashboard</h1>
          <p className="text-gray-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Welcome to {data?.pgName || "your SmartPG portal"}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="relative group">
            <StatsCard {...stat} />
            {stat.title === "Due Amount" && data?.dueAmount > 0 && (
                <button 
                  onClick={() => window.location.href = '/dashboard/payments'}
                  className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-white/20 backdrop-blur-sm shadow-xl"
                >
                  Pay Now
                </button>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment History / Fees */}
        <div className="lg:col-span-2 bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
            <h2 className="text-xl font-bold text-white mb-6">Recent Payments</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-[#1f2937] text-gray-500 text-sm uppercase tracking-wider">
                            <th className="pb-4 font-medium">Month</th>
                            <th className="pb-4 font-medium">Amount</th>
                            <th className="pb-4 font-medium">Date</th>
                            <th className="pb-4 font-medium">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f2937]">
                        {data?.paymentHistory?.length > 0 ? (
                            data.paymentHistory.map((payment, idx) => (
                                <tr key={idx} className="group hover:bg-[#0b0f19] transition-colors">
                                    <td className="py-4 text-white font-medium">{payment.month}</td>
                                    <td className="py-4 text-gray-300">₹{payment.amount}</td>
                                    <td className="py-4 text-gray-400 text-sm">{new Date(payment.date).toLocaleDateString()}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-bold ${payment.status === "SUCCESS" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"}`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="py-10 text-center text-gray-500">No payment history available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Room Details & Documents */}
        <div className="space-y-6">
            <div className="bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
                <h3 className="text-lg font-bold text-white mb-4">Room Details</h3>
                <div className="p-4 rounded-2xl bg-[#0b0f19] border border-[#1f2937]">
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Room No</span>
                        <span className="text-white font-medium">{data?.roomInfo?.roomNumber || "N/A"}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span className="text-gray-500 text-sm">Bed No</span>
                        <span className="text-white font-medium">{data?.roomInfo?.bedNumber || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-500 text-sm">Monthly Rent</span>
                        <span className="text-blue-500 font-bold">₹{data?.roomInfo?.rent || "0"}</span>
                    </div>
                </div>
            </div>

            <div className="bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-white">KYC Documents</h3>
                    <span className="text-xs text-gray-500">{data?.documents?.length || 0}/2</span>
                </div>
                <div className="space-y-3">
                    {["AADHAAR", "COLLEGE_ID"].map((type) => {
                        const doc = data?.documents?.find(d => d.type === type);
                        return (
                            <div key={type} className="flex items-center justify-between p-3 rounded-xl bg-[#0b0f19] border border-[#1f2937]">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{type === "AADHAAR" ? "🪪" : "🎓"}</span>
                                    <div>
                                        <p className="text-sm text-gray-200">{type.replace('_', ' ')}</p>
                                    </div>
                                </div>
                                {!doc ? (
                                    <label className="text-xs bg-blue-600/10 text-blue-500 px-3 py-1.5 rounded-lg font-bold cursor-pointer hover:bg-blue-600/20 transition-all">
                                        Upload
                                        <input type="file" className="hidden" onChange={(e) => handleKYCUpload(type, e)} />
                                    </label>
                                ) : (
                                    <span className="text-emerald-500 text-sm">✓</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
