import React, { useState, useEffect } from "react";
import { getComplaints, createComplaint, updateComplaintStatus } from "../../api/complaintService";
import { getMyTenantRecord } from "../../api/tenantService";
import { toast } from "react-toastify";

const Complaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newComplaint, setNewComplaint] = useState({ title: "", description: "" });
    const role = localStorage.getItem("role") || "TENANT";

    useEffect(() => {
        fetchComplaints();
        fetchTenantInfo();
    }, []);

    const fetchTenantInfo = async () => {
        if (role === "TENANT") {
            try {
                const res = await getMyTenantRecord();
                setNewComplaint(prev => ({ ...prev, tenantId: res.tenant?._id, pgId: res.tenant?.pgId?._id || res.tenant?.pgId }));
            } catch (err) {
                console.error("Error fetching tenant info", err);
            }
        }
    };

    const fetchComplaints = async () => {
        try {
            const res = await getComplaints();
            setComplaints(res.data?.complaints || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComplaint.tenantId || !newComplaint.pgId) {
            toast.error("Tenant information not loaded. Please refresh.");
            return;
        }
        try {
            await createComplaint(newComplaint);
            toast.success("Complaint submitted successfully!");
            setShowForm(false);
            setNewComplaint({ ...newComplaint, title: "", description: "" });
            fetchComplaints();
        } catch (err) {
            console.error(err);
            toast.error("Failed to submit complaint");
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateComplaintStatus(id, status);
            fetchComplaints();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="text-white text-center py-10">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-white">Complaints</h1>
                {role === "TENANT" && (
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-all font-black"
                    >
                        {showForm ? "Cancel" : "+ New Complaint"}
                    </button>
                )}
            </div>

            {showForm && (
                <div className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl animate-slide-down">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input 
                            placeholder="Title" 
                            className="w-full bg-[#0b0f19] border border-[#1f2937] p-3 rounded-lg text-white"
                            value={newComplaint.title}
                            onChange={(e) => setNewComplaint({...newComplaint, title: e.target.value})}
                        />
                        <textarea 
                            placeholder="Description" 
                            className="w-full bg-[#0b0f19] border border-[#1f2937] p-3 rounded-lg text-white h-24"
                            value={newComplaint.description}
                            onChange={(e) => setNewComplaint({...newComplaint, description: e.target.value})}
                        />
                        <button className="w-full bg-blue-600 py-3 rounded-lg font-bold">Submit Complaint</button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {complaints.map((c) => (
                    <div key={c._id} className="bg-[#111827] border border-[#1f2937] p-6 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-1">
                            <h3 className="text-lg font-bold text-white">{c.title}</h3>
                            <p className="text-gray-400 text-sm">{c.description}</p>
                            <p className="text-xs text-gray-600">Issued by: {c.tenantId?.userId?.name || "Unknown"} on {new Date(c.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                c.status === "RESOLVED" ? "bg-green-500/10 text-green-500" : 
                                c.status === "IN_PROGRESS" ? "bg-blue-500/10 text-blue-500" : 
                                "bg-amber-500/10 text-amber-500"
                            }`}>
                                {c.status}
                            </span>
                            {role === "OWNER" && c.status !== "RESOLVED" && (
                                <button 
                                    onClick={() => handleStatusUpdate(c._id, "RESOLVED")}
                                    className="bg-green-600/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20 hover:bg-green-500/20"
                                >
                                    Mark Resolved
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Complaints;
