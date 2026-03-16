import React, { useState, useEffect } from "react";
import { getRooms, deleteRoom, createRoom, getRoomUploadUrl } from "../../api/roomService";
import { toast } from "react-toastify";
import axios from "axios";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newRoom, setNewRoom] = useState({
        roomNumber: "",
        floor: "",
        totalBeds: "",
        rentPerBed: "",
        description: "",
        images: []
    });
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const res = await getRooms();
            setRooms(res.rooms || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this room? This will also delete all beds and cannot be undone.")) {
            try {
                await deleteRoom(id);
                toast.success("Room deleted successfully");
                fetchRooms();
            } catch (err) {
                toast.error("Failed to delete room");
            }
        }
    };

    const handleAddRoom = async (e) => {
        e.preventDefault();
        try {
            await createRoom(newRoom);
            toast.success("Room added successfully!");
            setShowModal(false);
            setNewRoom({ roomNumber: "", floor: "", totalBeds: "", rentPerBed: "", description: "", images: [] });
            fetchRooms();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add room");
        }
    };

    const handleRoomImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const { uploadUrl, key } = await getRoomUploadUrl(file.name, file.type);
            await axios.put(uploadUrl, file, {
                headers: { "Content-Type": file.type }
            });
            
            setNewRoom({ ...newRoom, images: [...newRoom.images, { key }] });
            toast.success("Room image uploaded!");
        } catch (err) {
            toast.error("Failed to upload room image");
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

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                   <h1 className="text-4xl font-black text-white tracking-tighter">Manage Rooms</h1>
                   <p className="text-gray-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Manage your floors and beds</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-blue-600 px-8 py-3 rounded-2xl font-black text-white hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/40 hover:scale-[1.05] active:scale-[0.95]"
                >
                    + Add New Room
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rooms.map((room) => (
                    <div key={room._id} className="bg-[#111827]/50 backdrop-blur-xl border border-[#1f2937] rounded-[2.5rem] overflow-hidden group hover:border-blue-500/50 transition-all duration-500 shadow-xl">
                        <div className="h-48 overflow-hidden relative">
                            <img 
                                src={room.images?.[0]?.url || `/placeholder.png`} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                alt="Room" 
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <span className={`px-4 py-2 rounded-2xl text-[10px] font-black shadow-2xl backdrop-blur-xl uppercase tracking-widest ${room.status === "AVAILABLE" ? "bg-emerald-500/80 text-white" : "bg-red-500/80 text-white"}`}>
                                    {room.status}
                                </span>
                            </div>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-black text-white tracking-tight">Room {room.roomNumber}</h3>
                                    <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{room.floor === 0 ? "Ground" : `${room.floor}${room.floor === 1 ? 'st' : room.floor === 2 ? 'nd' : room.floor === 3 ? 'rd' : 'th'}`} Floor</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-blue-500 font-black text-xl">₹{room.rentPerBed}</p>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase">per bed</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-[#0b0f19] p-4 rounded-2xl border border-[#1f2937]">
                                    <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Total Beds</p>
                                    <p className="text-white font-black text-lg">{room.totalBeds}</p>
                                </div>
                                <div className="bg-[#0b0f19] p-4 rounded-2xl border border-[#1f2937]">
                                    <p className="text-gray-500 text-[10px] font-bold uppercase mb-1">Vacant</p>
                                    <p className="text-emerald-500 font-black text-lg">{room.vacantBeds}</p>
                                </div>
                            </div>

                            {room.occupiedBeds?.length > 0 && (
                                <div className="mb-8 space-y-2">
                                    <p className="text-gray-500 text-[10px] font-bold uppercase ml-1">Current Residents</p>
                                    <div className="flex flex-wrap gap-2">
                                        {room.occupiedBeds.map((bed, i) => (
                                            <div key={i} className="px-3 py-1.5 bg-blue-600/10 text-blue-500 rounded-lg text-xs font-bold border border-blue-500/20 flex items-center gap-2">
                                                <span>👤 {bed.residentId?.name || "Occupied"}</span>
                                                <span className="opacity-50 text-[10px]">#B{bed.bedNumber}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button className="flex-1 bg-white/5 py-4 rounded-2xl text-xs font-black text-white hover:bg-white/10 transition-all uppercase tracking-widest">Edit</button>
                                <button 
                                    onClick={() => handleDelete(room._id)}
                                    className="flex-1 bg-red-500/10 text-red-500 py-4 rounded-2xl text-xs font-black hover:bg-red-500/20 transition-all uppercase tracking-widest"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                
                {rooms.length === 0 && (
                  <div className="col-span-full py-20 text-center border-4 border-dashed border-[#1f2937] rounded-[3rem]">
                      <span className="text-6xl block mb-6 opacity-20">🛏️</span>
                      <p className="text-gray-500 text-xl font-medium italic">No rooms added yet. Click "+ Add New Room" to start.</p>
                  </div>
                )}
            </div>

            {/* Add Room Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#111827] w-full max-w-lg rounded-[2.5rem] border border-[#1f2937] shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-8 border-b border-[#1f2937]">
                            <h2 className="text-3xl font-black text-white tracking-tighter">Add New Room</h2>
                            <p className="text-gray-500 text-sm mt-1">Fill in the details to generate beds automatically.</p>
                        </div>
                        <form onSubmit={handleAddRoom} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Number</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                                        placeholder="e.g. 101"
                                        value={newRoom.roomNumber}
                                        onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Floor</label>
                                    <input 
                                        required
                                        type="number" 
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                                        placeholder="0 for Ground"
                                        value={newRoom.floor}
                                        onChange={(e) => setNewRoom({...newRoom, floor: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Total Beds</label>
                                    <input 
                                        required
                                        type="number" 
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                                        placeholder="No. of sharing"
                                        value={newRoom.totalBeds}
                                        onChange={(e) => setNewRoom({...newRoom, totalBeds: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Rent Per Bed</label>
                                    <input 
                                        required
                                        type="number" 
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                                        placeholder="Monthly amount"
                                        value={newRoom.rentPerBed}
                                        onChange={(e) => setNewRoom({...newRoom, rentPerBed: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Room Images</label>
                                <div className="grid grid-cols-4 gap-3">
                                    {newRoom.images.map((img, idx) => (
                                        <div key={idx} className="aspect-square bg-[#0b0f19] rounded-xl border border-[#1f2937] flex items-center justify-center text-xs text-gray-500 overflow-hidden">
                                           <span className="text-lg">🖼️</span>
                                        </div>
                                    ))}
                                    <label className="aspect-square border-2 border-dashed border-[#1f2937] rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-500/50 hover:bg-blue-500/5 transition-all group">
                                        {uploading ? (
                                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <span className="text-xl group-hover:scale-110 transition-transform">📸</span>
                                        )}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleRoomImageUpload} disabled={uploading} />
                                    </label>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description (Optional)</label>
                                <textarea 
                                    className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all min-h-[80px]"
                                    placeholder="Room details, balcony, etc."
                                    value={newRoom.description}
                                    onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
                                />
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-4 bg-white/5 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all border border-[#1f2937]"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40"
                                >
                                    Confirm & Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Rooms;
