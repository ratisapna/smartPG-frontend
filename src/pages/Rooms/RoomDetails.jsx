import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import apiClient from "../../api/apiClient";

const RoomDetails = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVisitModal, setShowVisitModal] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await apiClient.get(`/rooms/${roomId}`);
        setRoom(response.data.room);
      } catch (error) {
        console.error("Error fetching room details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-white">Room not found</h2>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">Back to Home</Link>
      </div>
    );
  }

  const roomImages = (room.images || []).map(img => img.url || img.key).filter(Boolean);
  const pgImages = (room.pgId?.images || []).map(img => img.url || img.key).filter(Boolean);
  const allImages = roomImages.length > 0 ? roomImages : pgImages;

  const nextImage = () => {
    if (currentImageIndex < allImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 text-gray-400 mb-8 overflow-x-auto whitespace-nowrap">
        <Link to="/" className="hover:text-white">Home</Link>
        <span>/</span>
        <Link to="/rooms" className="hover:text-white">Rooms</Link>
        <span>/</span>
        <span className="text-white">Room {room.roomNumber}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Slider & Details */}
        <div className="lg:col-span-2 space-y-10">
          <div className="relative group">
            {allImages.length > 0 ? (
              <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden bg-[#111827] border border-[#1f2937]">
                <img
                  src={allImages[currentImageIndex]}
                  className="w-full h-full object-cover transition-opacity duration-500"
                  alt={`Room Image ${currentImageIndex + 1}`}
                />

                {/* Navigation Buttons */}
                {allImages.length > 1 && (
                  <>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={prevImage}
                        disabled={currentImageIndex === 0}
                        className={`p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white transition-all ${currentImageIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
                      >
                        <span className="text-2xl">←</span>
                      </button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={nextImage}
                        disabled={currentImageIndex === allImages.length - 1}
                        className={`p-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white transition-all ${currentImageIndex === allImages.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/70'}`}
                      >
                        <span className="text-2xl">→</span>
                      </button>
                    </div>

                    {/* Indicators */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {allImages.map((_, i) => (
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
              <div className="aspect-[16/9] rounded-[2.5rem] bg-[#111827] border border-[#1f2937] flex flex-col items-center justify-center text-gray-500 italic">
                <span className="text-4xl mb-4">📸</span>
                No images available for this property
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold ring-1 ring-emerald-500/20 uppercase tracking-tighter">{room.status || 'Available'}</span>
                  <span className="px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold ring-1 ring-blue-500/20 uppercase tracking-tighter">Premium</span>
                </div>
                <h1 className="text-4xl font-bold text-white tracking-tight">{room.pgId?.name} - Room {room.roomNumber}</h1>
                <p className="text-gray-500 mt-2 flex items-center gap-2">
                  <span>📍</span> {room.pgId?.address?.street}, {room.pgId?.address?.city}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-blue-500">₹{room.rentPerBed}<span className="text-gray-500 text-sm font-normal"> / month</span></p>
                <p className="text-xs text-gray-500 mt-1">Security Deposit: ₹{room.securityDeposit}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-[#1f2937]">
              <div className="space-y-1">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Type</p>
                <p className="text-white font-medium">{room.totalBeds === 1 ? 'Single' : `${room.totalBeds} Sharing`}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Floor</p>
                <p className="text-white font-medium">{room.floor || 'N/A'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Notice</p>
                <p className="text-white font-medium">30 Days</p>
              </div>
              <div className="space-y-1">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Availability</p>
                <p className="text-white font-medium">{room.status === 'AVAILABLE' ? 'Instant' : 'Check'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-4">About this room</h3>
              <p className="text-gray-400 leading-relaxed">
                {room.description || room.pgId?.description || "No description available for this property."}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6">Amenities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {room.pgId?.amenities?.length > 0 ? room.pgId.amenities.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-[#111827] border border-[#1f2937]">
                    <span className="text-xl">✨</span>
                    <span className="text-gray-300 text-sm font-medium">{a}</span>
                  </div>
                )) : (
                  <p className="text-gray-500 italic">No amenities listed.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-32 space-y-6">
            <div className="bg-[#111827] rounded-[2.5rem] p-8 border border-[#1f2937] shadow-2xl">
              <h3 className="text-xl font-bold text-white mb-2">Ready to move?</h3>
              <p className="text-gray-500 text-sm mb-8">Lock it in now with a booking or schedule a visit.</p>

              <div className="space-y-4">
                <button
                  onClick={() => setShowVisitModal(true)}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold transition-all shadow-xl shadow-blue-900/40"
                >
                  Request a Visit
                </button>
              </div>
            </div>

            <div className="bg-[#111827] rounded-3xl p-6 border border-[#1f2937]">
              <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-4">Managed By</p>
              <div className="flex items-center gap-4">
                <img src={`https://i.pravatar.cc/150?u=${room.pgId?.ownerId?._id}`} className="w-12 h-12 rounded-full border-2 border-blue-600/20" alt="Owner" />
                <div>
                  <p className="text-white font-bold">{room.pgId?.ownerId?.name || "Verified Owner"}</p>
                  <p className="text-xs text-blue-500">★ 4.9 <span className="text-gray-500">(Validated)</span></p>
                </div>
              </div>
              <a
                href={`mailto:${room.pgId?.ownerId?.email || 'support@smartpg.com'}?subject=Inquiry about Room ${room.roomNumber} at ${room.pgId?.name}`}
                className="w-full mt-6 py-2 text-center block text-sm text-gray-400 hover:text-white border border-[#1f2937] hover:bg-[#1f2937] rounded-xl transition-all"
              >
                Contact Owner
              </a>
            </div>

            <div className="px-4">
              <h4 className="text-sm font-bold text-white mb-3">● Important Rules</h4>
              <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                {room.pgId?.rules?.length > 0 ? room.pgId.rules.map((rule, i) => (
                  <li key={i}>{rule}</li>
                )) : (
                  <>
                    <li>No smoking inside the room</li>
                    <li>10 PM main gate entry restriction</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Visit Modal */}
      {showVisitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowVisitModal(false)}></div>
          <div className="relative bg-[#111827] border border-[#1f2937] rounded-[2.5rem] p-10 w-full max-w-lg animate-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-white mb-2">Request a Visit</h2>
            <p className="text-gray-500 text-sm mb-8">Fill in your details and preferred date.</p>

            <form className="space-y-4" onSubmit={async (e) => {
              e.preventDefault();
              const formData = {
                visitorName: e.target.name.value,
                visitorPhone: e.target.phone.value,
                preferredDate: e.target.date.value,
                pgId: room.pgId._id,
                roomId: room._id
              };
              try {
                await apiClient.post("/visits", formData);
                alert("Visit request submitted successfully!");
                setShowVisitModal(false);
              } catch (error) {
                console.error("Failed to submit visit request", error);
                alert("Failed to submit request. Please try again.");
              }
            }}>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Name</label>
                <input name="name" type="text" className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Phone</label>
                <input name="phone" type="tel" className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Preferred Date</label>
                <input name="date" type="date" className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-xl py-3 px-4 text-white focus:outline-none focus:ring-1 focus:ring-blue-500" required />
              </div>
              <button type="submit" className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-xl shadow-blue-900/40 transition-all">
                Confirm Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetails;
