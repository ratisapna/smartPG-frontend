import React, { useState, useEffect } from "react";
import { getPG, updatePG, createPG, getPGUploadUrl } from "../../api/pgService";
import { toast } from "react-toastify";
import axios from "axios";

const Settings = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const [pgData, setPgData] = useState({
        name: "",
        description: "",
        contactNumber: "",
        amenities: [],
        address: { street: "", city: "", state: "", pincode: "" }
    });
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [hasPg, setHasPg] = useState(false);
    const role = localStorage.getItem("role") || user.role || "TENANT";

    useEffect(() => {
        if (role === "OWNER") {
            fetchPGDetails();
        }
    }, [role]);

    const fetchPGDetails = async () => {
        try {
            const res = await getPG();
            if (res.pg) {
                setPgData(res.pg);
                setHasPg(true);
            }
        } catch (err) {
            console.error("No PG found or error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (hasPg) {
                await updatePG(pgData);
                toast.success("Property details updated!");
            } else {
                await createPG(pgData);
                toast.success("Property listed successfully!");
                setHasPg(true);
            }
        } catch (err) {
            console.error("Save PG error:", err?.response?.data || err);
            toast.error(err?.response?.data?.message || "Failed to save property details");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
        const { uploadUrl, key } = await getPGUploadUrl(file.name, file.type);
            await axios.put(uploadUrl, file, {
                headers: { "Content-Type": file.type }
            });
            
            // Add image key to pgData
            const updatedImages = [...(pgData.images || []), { key }];
            setPgData({ ...pgData, images: updatedImages });
            
            toast.success("Image uploaded successfully!");
        } catch (err) {
            toast.error("Failed to upload image");
            console.error(err);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (role === "TENANT") return (
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
            <div className="w-32 h-32 bg-blue-600/10 rounded-full flex items-center justify-center text-6xl mb-8">
                👤
            </div>
            <h1 className="text-4xl font-black text-white mb-4 tracking-tighter">Tenant Account</h1>
            <p className="text-gray-400 max-w-md text-lg leading-relaxed mb-10">
                You are registered as a tenant. Property settings and PG configurations are only available to owners and partners.
            </p>
            <div className="flex gap-4">
                <button 
                  onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                  className="px-8 py-4 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-red-600/20 transition-all"
                >
                    Logout
                </button>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-fade-in">
            <div className="flex justify-between items-end">
                <div>
                   <h1 className="text-4xl font-black text-white tracking-tighter">Property Profile</h1>
                   <p className="text-gray-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Configure your PG identity and logistics</p>
                </div>
                <button 
                  onClick={() => { localStorage.clear(); window.location.href = "/login"; }}
                  className="px-6 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-red-500/20 transition-all"
                >
                    System Logout
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Profile Card */}
                <div className="space-y-8">
                    <div className="bg-[#111827]/50 backdrop-blur-xl border border-[#1f2937] rounded-[2.5rem] p-8 space-y-8 shadow-2xl">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-blue-600/10 rounded-3xl flex items-center justify-center text-4xl text-blue-500 border border-blue-500/20 mb-6 shadow-inner">
                                {user.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <h2 className="text-2xl font-black text-white px-2 break-all">{user.name}</h2>
                            <span className="mt-2 px-4 py-1.5 bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
                                {user.role} Partner
                            </span>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-[#1f2937]">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500 font-bold uppercase tracking-widest">Phone</span>
                                <span className="text-gray-300">{user.phone}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-500 font-bold uppercase tracking-widest">Email</span>
                                <span className="text-gray-300">{user.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#111827]/50 backdrop-blur-xl border border-[#1f2937] rounded-[2.5rem] p-8 shadow-2xl overflow-hidden relative group">
                        <h3 className="text-white font-black uppercase tracking-widest text-xs mb-6">Property Images</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {pgData.images?.map((img, idx) => (
                                <div key={idx} className="aspect-square rounded-2xl overflow-hidden bg-[#0b0f19] border border-[#1f2937]">
                                    <img src={img.url || `/placeholder.png`} className="w-full h-full object-cover" alt="PG" />
                                </div>
                            ))}
                            <label className="aspect-square rounded-2xl border-2 border-dashed border-[#1f2937] flex flex-col items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group/upload">
                                {uploading ? (
                                    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <span className="text-2xl mb-1 group-hover/upload:scale-110 transition-transform">📸</span>
                                        <span className="text-[8px] font-black uppercase tracking-tighter text-gray-500">Upload</span>
                                    </>
                                )}
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Main Settings Form */}
                <div className="lg:col-span-2 space-y-8">
                     <form onSubmit={handleSave} className="bg-[#111827]/50 backdrop-blur-xl border border-[#1f2937] rounded-[2.5rem] p-10 space-y-10 shadow-2xl">
                        <div className="space-y-8">
                           <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs">PG Information</h3>
                           <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Company / PG Name</label>
                                    <input 
                                        required
                                        value={pgData.name}
                                        onChange={(e) => setPgData({...pgData, name: e.target.value})}
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-5 text-white focus:border-blue-500 outline-none transition-all font-bold"
                                        placeholder="e.g. Skyline Luxury PG"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">About Property</label>
                                    <textarea 
                                        rows="4"
                                        value={pgData.description}
                                        onChange={(e) => setPgData({...pgData, description: e.target.value})}
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-5 text-white focus:border-blue-500 outline-none transition-all font-medium resize-none"
                                        placeholder="Briefly describe your PG amenities and rules..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Contact Number</label>
                                    <input 
                                        required
                                        type="tel"
                                        value={pgData.contactNumber}
                                        onChange={(e) => setPgData({...pgData, contactNumber: e.target.value})}
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-5 text-white focus:border-blue-500 outline-none transition-all font-bold"
                                        placeholder="e.g. 9876543210"
                                    />
                                </div>
                           </div>
                        </div>

                        <div className="space-y-8">
                           <h3 className="text-white font-black uppercase tracking-[0.3em] text-xs">Logistic Address</h3>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Street / Area</label>
                                    <input 
                                        required
                                        value={pgData.address?.street}
                                        onChange={(e) => setPgData({...pgData, address: {...pgData.address, street: e.target.value}})}
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">City</label>
                                    <input 
                                        required
                                        value={pgData.address?.city}
                                        onChange={(e) => setPgData({...pgData, address: {...pgData.address, city: e.target.value}})}
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">State</label>
                                    <input 
                                        required
                                        value={pgData.address?.state}
                                        onChange={(e) => setPgData({...pgData, address: {...pgData.address, state: e.target.value}})}
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Pincode</label>
                                    <input 
                                        required
                                        value={pgData.address?.pincode}
                                        onChange={(e) => setPgData({...pgData, address: {...pgData.address, pincode: e.target.value}})}
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all font-bold"
                                        placeholder="e.g. 560001"
                                    />
                                </div>
                           </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-6 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-3xl transition-all shadow-2xl shadow-blue-900/40 uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {hasPg ? "Commit Changes" : "List Property Now"}
                        </button>
                     </form>
                </div>
            </div>
        </div>
    );
};

export default Settings;
