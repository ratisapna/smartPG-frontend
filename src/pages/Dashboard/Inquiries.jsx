import React, { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const Inquiries = () => {
    const [visits, setVisits] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchVisits();
    }, []);

    const fetchVisits = async () => {
        try {
            const res = await apiClient.get("/visits");
            setVisits(res.data.visits || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (id, status) => {
        try {
            await apiClient.patch(`/visits/${id}`, { status });
            fetchVisits();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-white text-center py-10">Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Visit Requests</h1>
            <div className="grid grid-cols-1 gap-4">
                {visits.length > 0 ? visits.map((v) => (
                    <div key={v._id} className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-white tracking-tight">{v.visitorName}</h3>
                            <p className="text-gray-400 text-sm font-medium">{v.visitorPhone}</p>
                            <p className="text-xs text-blue-500 font-black uppercase tracking-widest mt-2 px-3 py-1 bg-blue-500/10 rounded-full inline-block">
                                Visit Date: {v.preferredDate ? new Date(v.preferredDate).toLocaleDateString() : 'Not Set'}
                            </p>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                v.status === "CONTACTED" ? "bg-blue-500/10 text-blue-500 border border-blue-500/20" :
                                v.status === "CLOSED" ? "bg-gray-500/10 text-gray-500 border border-gray-500/20" :
                                "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                            }`}>
                                {v.status}
                            </span>
                            {v.status === "PENDING" && (
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleUpdate(v._id, "CONTACTED")}
                                        className="bg-blue-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40"
                                    >
                                        Mark Contacted
                                    </button>
                                    <button 
                                        onClick={() => handleUpdate(v._id, "CLOSED")}
                                        className="bg-[#1f2937] px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all border border-[#374151]"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                            {v.status === "CONTACTED" && (
                                <button 
                                    onClick={() => handleUpdate(v._id, "CLOSED")}
                                    className="bg-emerald-600 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/40"
                                >
                                    Finish / Close
                                </button>
                            )}
                        </div>
                    </div>
                )) : (
                    <div className="bg-[#111827] p-10 rounded-2xl text-center text-gray-500 border border-[#1f2937]">
                        No visit requests yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inquiries;
