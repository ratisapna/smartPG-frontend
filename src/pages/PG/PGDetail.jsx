import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../../api/apiClient";

const PGDetail = () => {
  const { pgId } = useParams();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVisitModal, setShowVisitModal] = useState(false);

  useEffect(() => {
    const fetchPG = async () => {
      try {
        const res = await apiClient.get(`/pg/all`);
        const found = res.data.pgs?.find((p) => p._id === pgId);
        setPg(found || null);
      } catch (err) {
        console.error("Error fetching PG details", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPG();
  }, [pgId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (!pg)
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <span className="text-7xl mb-6 opacity-20">🏚️</span>
        <h2 className="text-3xl font-black text-white mb-3">Property Not Found</h2>
        <p className="text-gray-500 mb-8">The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all">
          ← Back to Home
        </Link>
      </div>
    );

  const images = (pg.images || []).map(img => img.url).filter(Boolean);

  const nextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-20 space-y-12 animate-fade-in">
      {/* Back Button */}
      <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest">
        <span>←</span> Back to listings
      </Link>

      {/* IG-style Image Slider */}
      <div className="relative group">
        {images.length > 0 ? (
          <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] overflow-hidden bg-[#111827] border border-[#1f2937]">
            <img
              src={images[currentImageIndex]}
              alt={pg.name}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            
            {/* Overlay Navigation */}
            {images.length > 1 && (
              <>
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={prevImage}
                    disabled={currentImageIndex === 0}
                    className={`p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white transition-all ${currentImageIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
                  >
                    <span className="text-2xl font-bold">←</span>
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={nextImage}
                    disabled={currentImageIndex === images.length - 1}
                    className={`p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white transition-all ${currentImageIndex === images.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
                  >
                    <span className="text-2xl font-bold">→</span>
                  </button>
                </div>
                
                {/* Dots Indicator */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all ${i === currentImageIndex ? 'w-6 bg-blue-500' : 'w-1.5 bg-white/30'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="aspect-[16/9] md:aspect-[21/9] rounded-[2.5rem] bg-[#111827] border border-[#1f2937] flex flex-col items-center justify-center text-gray-500 italic">
            <span className="text-4xl mb-4">📸</span>
            No images available for this property
          </div>
        )}
      </div>

      {/* Property Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-4 py-1.5 bg-blue-600/10 text-blue-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-500/20">
                Verified Property
              </span>
            </div>
            <h1 className="text-5xl font-black text-white tracking-tighter mb-4">{pg.name}</h1>
            <p className="text-gray-500 text-lg flex items-center gap-2">
              <span className="text-xl">📍</span> {pg.address?.street}, {pg.address?.city}, {pg.address?.state} - {pg.address?.zipCode}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white mb-4 tracking-tight">About This Property</h2>
            <p className="text-gray-400 leading-relaxed text-lg">
              {pg.description || "A premium PG accommodation with modern amenities and comfortable living spaces. Experience the best of urban living with our carefully designed interiors and world-class facilities."}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-black text-white mb-6 tracking-tight">Amenities</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {(pg.amenities || ["WiFi", "AC", "Food"]).map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 bg-[#111827]/50 border border-[#1f2937] rounded-2xl hover:border-blue-500/30 transition-all">
                  <span className="text-2xl">
                    {amenity.includes("WiFi") ? "🌐" :
                      amenity.includes("AC") ? "❄️" :
                        amenity.includes("Food") ? "🍽️" :
                          amenity.includes("Laundry") ? "🧺" :
                            amenity.includes("Security") ? "🛡️" :
                              amenity.includes("Gym") ? "🏋️" : "✨"}
                  </span>
                  <span className="text-white font-bold">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact / CTA Sidebar */}
        <div className="space-y-8">
          <div className="bg-[#111827]/50 backdrop-blur-xl border border-[#1f2937] rounded-[2.5rem] p-8 shadow-2xl sticky top-28">
            <h3 className="text-xl font-black text-white mb-6 uppercase tracking-widest text-center">Interested?</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between p-4 bg-[#0b0f19] rounded-2xl border border-[#1f2937]">
                <span className="text-gray-500 text-sm font-bold">Type</span>
                <span className="text-white font-black">{pg.pgType || "Co-Living"}</span>
              </div>
              <div className="flex justify-between p-4 bg-[#0b0f19] rounded-2xl border border-[#1f2937]">
                <span className="text-gray-500 text-sm font-bold">For</span>
                <span className="text-white font-black">{pg.gender || "Unisex"}</span>
              </div>
            </div>

            <button
              onClick={() => setShowVisitModal(true)}
              className="flex items-center justify-center gap-3 w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black transition-all shadow-2xl shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] text-sm uppercase tracking-widest"
            >
              Schedule a Visit
            </button>
            
            <p className="text-center text-gray-500 text-[10px] font-bold uppercase tracking-widest mt-6">
              Instant Scheduling Available
            </p>
          </div>
        </div>
      </div>

      {/* Visit Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowVisitModal(false)}></div>
          <div className="relative bg-[#111827] border border-[#1f2937] rounded-[2.5rem] p-10 w-full max-w-lg animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-white mb-2">Schedule a Visit</h2>
            <p className="text-gray-500 text-sm mb-8">See "{pg.name}" in person.</p>

            <form className="space-y-6" onSubmit={async (e) => {
              e.preventDefault();
              const formData = {
                visitorName: e.target.name.value,
                visitorPhone: e.target.phone.value,
                preferredDate: e.target.date.value,
                pgId: pg._id
              };
              try {
                await apiClient.post("/visits", formData);
                alert("Visit request submitted successfully! The owner will contact you shortly.");
                setShowVisitModal(false);
              } catch (error) {
                console.error("Failed to submit visit request", error);
                alert("Failed to submit request. Please try again.");
              }
            }}>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">Your Name</label>
                <input name="name" type="text" className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Enter your full name" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">Phone Number</label>
                <input name="phone" type="tel" className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" placeholder="Enter your phone" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-widest pl-1">Preferred Date</label>
                <input name="date" type="date" className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-4 px-5 text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all" required />
              </div>
              <button type="submit" className="w-full mt-6 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-900/40 transition-all active:scale-95">
                SUBMIT REQUEST
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PGDetail;
