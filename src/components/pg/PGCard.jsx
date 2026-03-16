import React from "react";
import { Link } from "react-router-dom";

const PGCard = ({ pg }) => {
  return (
    <div className="bg-[#111827] rounded-[2rem] overflow-hidden border border-[#1f2937] group hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-900/10">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={pg.images?.[0]?.url || `/placeholder.png`}
          alt={pg.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-xl text-white px-4 py-2 rounded-2xl text-xs font-bold ring-1 ring-white/10 uppercase tracking-widest">
          Verified
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-white font-black text-2xl mb-1 group-hover:text-blue-500 transition-colors">{pg.name}</h3>
            <p className="text-gray-500 text-sm flex items-center gap-2">
              <span className="text-lg">📍</span> {pg.address?.city}, {pg.address?.state}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {pg.amenities?.slice(0, 3).map((amenity, idx) => (
            <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] font-bold text-blue-400 uppercase tracking-tighter">
              {amenity}
            </span>
          ))}
          {pg.amenities?.length > 3 && (
            <span className="px-3 py-1.5 rounded-xl bg-[#0b0f19] border border-[#1f2937] text-[10px] font-bold text-gray-500">
              +{pg.amenities.length - 3} More
            </span>
          )}
        </div>

        <Link
          to={`/pg/${pg._id}`}
          className="flex items-center justify-center gap-3 w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.2rem] text-sm font-black transition-all shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98]"
        >
          View Property
          <span className="text-xl">→</span>
        </Link>
      </div>
    </div>
  );
};

export default PGCard;
