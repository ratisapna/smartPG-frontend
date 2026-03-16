import React from "react";
import { Link } from "react-router-dom";

const RoomCard = ({ room }) => {
  return (
    <div className="bg-[#111827] rounded-3xl overflow-hidden border border-[#1f2937] group hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={room.images?.[0]?.url || room.images?.[0]?.key || `/placeholder.png`} 
          alt={`Room ${room.roomNumber}`}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold ring-1 ring-white/20">
          ★ {room.rating || "4.8"}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-white font-bold text-lg">{room.pgId?.name || "Premium Room"}</h3>
          <div className="text-blue-500 font-bold">₹{room.rentPerBed}<span className="text-gray-500 text-xs font-normal">/mo</span></div>
        </div>
        
        <p className="text-gray-500 text-xs mb-4 flex items-center gap-1">
          <span>📍</span> {room.pgId?.address?.city || "Downtown Core"}
        </p>
        
        <div className="flex gap-2 mb-6">
           <span className="bg-[#0b0f19] px-2 py-1 rounded-md text-[10px] text-gray-400 border border-[#1f2937]">WiFi</span>
           <span className="bg-[#0b0f19] px-2 py-1 rounded-md text-[10px] text-gray-400 border border-[#1f2937]">Laundry</span>
           <span className="bg-[#0b0f19] px-2 py-1 rounded-md text-[10px] text-gray-400 border border-[#1f2937]">Food</span>
        </div>
        
        <Link 
          to={`/rooms/${room._id}`}
          className="block w-full text-center py-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white rounded-xl text-sm font-bold transition-all border border-blue-600/20 group-hover:border-blue-600"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
