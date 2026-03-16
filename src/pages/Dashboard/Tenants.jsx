import React, { useState, useEffect } from "react";
import { getTenants, createTenant, deleteTenant } from "../../api/tenantService";
import { getRooms, getRoomAvailability } from "../../api/roomService";
import { getFees, markFeeAsPaid } from "../../api/feeService";
import { getMyDocuments } from "../../api/documentService";

const DocumentList = ({ tenantId }) => {
    const [docs, setDocs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocs = async () => {
            try {
                const res = await getMyDocuments(tenantId);
                setDocs(res.documents || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDocs();
    }, [tenantId]);

    if (loading) return <div className="text-center py-4 text-gray-500 uppercase tracking-widest font-black text-[10px]">Loading Documents...</div>;

    if (docs.length === 0) return <div className="text-center py-10 text-gray-500 italic">No documents uploaded yet.</div>;

    return (
        <div className="space-y-4">
            {docs.map((doc) => (
                <div key={doc._id} className="p-6 bg-[#0b0f19] rounded-2xl border border-[#1f2937] flex justify-between items-center group hover:border-blue-500/30 transition-all">
                    <div>
                        <p className="text-white font-bold">{doc.type}</p>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1">Status: {doc.verificationStatus}</p>
                    </div>
                    <a 
                        href={doc.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-3 bg-blue-600/10 text-blue-500 rounded-xl hover:bg-blue-600 transition-all hover:text-white"
                    >
                        👁️
                    </a>
                </div>
            ))}
        </div>
    );
};
import { toast } from "react-toastify";

const TenantManagement = () => {
  const [tenants, setTenants] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [viewType, setViewType] = useState(null); // 'payments' or 'documents'
  const [newTenant, setNewTenant] = useState({
      name: "",
      email: "",
      phone: "",
      bedId: "",
      checkInDate: "",
      depositAmount: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tenantRes, bedRes, feeRes] = await Promise.all([
          getTenants(), 
          getRoomAvailability(),
          getFees()
      ]);
      setTenants(tenantRes.tenants || []);
      setAvailableBeds(bedRes.availableBeds || []);
      setFees(feeRes.fees || []);
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Failed to load residents data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTenant = async (e) => {
      e.preventDefault();
      try {
          await createTenant(newTenant);
          toast.success("Tenant added successfully!");
          setShowModal(false);
          setNewTenant({ name: "", email: "", phone: "", bedId: "", checkInDate: "", depositAmount: "" });
          fetchData();
      } catch (err) {
          toast.error(err.response?.data?.message || "Failed to add tenant");
      }
  };

  const handleMarkPaid = async (tenantId, amount) => {
      try {
          const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
          await markFeeAsPaid({ tenantId, amount, month: currentMonth });
          toast.success(`Rent for ${currentMonth} marked as paid`);
          fetchData();
      } catch (err) {
          toast.error(err.response?.data?.message || "Failed to mark as paid");
      }
  };

  const filteredTenants = Array.isArray(tenants) ? tenants.filter(tenant => {
    const name = tenant.userId?.name?.toLowerCase() || "";
    const phone = tenant.userId?.phone || "";
    const lowerSearch = searchTerm.toLowerCase();
    return name.includes(lowerSearch) || phone.includes(searchTerm);
  }) : [];

  return (
    <div className="space-y-10 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter">Residents</h1>
          <p className="text-gray-500 mt-1 uppercase tracking-widest text-[10px] font-bold">Manage and monitor your PG tenants</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-2xl shadow-blue-900/40 hover:scale-[1.05] active:scale-[0.95]"
        >
          + Add New Resident
        </button>
      </div>

      <div className="bg-[#111827]/50 backdrop-blur-xl rounded-[2.5rem] border border-[#1f2937] overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-[#1f2937] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative w-full md:w-96">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl">🔍</span>
            <input
              type="text"
              placeholder="Search by name or phone..."
              className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-4 pl-16 pr-6 text-white focus:outline-none focus:border-blue-500/50 transition-all font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4">
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#0b0f19]/80 text-gray-500 text-[10px] uppercase font-black tracking-[0.2em]">
                <th className="px-8 py-6">Resident Info</th>
                <th className="px-8 py-6">Allocated Unit</th>
                <th className="px-8 py-6">Onboarding Date</th>
                <th className="px-8 py-6">Financial Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2937]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <div className="flex justify-center"><div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div></div>
                  </td>
                </tr>
              ) : filteredTenants.length > 0 ? (
                filteredTenants.map((tenant) => (
                  <tr key={tenant._id} className="group hover:bg-[#0b0f19]/50 transition-colors">
                    <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-500 text-xl font-black">
                                {tenant.userId?.name?.charAt(0)}
                            </div>
                            <div>
                                <p className="text-white font-black text-lg group-hover:text-blue-500 transition-colors">{tenant.userId?.name}</p>
                                <p className="text-xs text-gray-500 font-medium">{tenant.userId?.phone}</p>
                            </div>
                        </div>
                    </td>
                    <td className="px-8 py-6">
                        <p className="text-white font-black text-sm uppercase tracking-tight">Room {tenant.bedId?.roomId?.roomNumber || "N/A"}</p>
                        <p className="text-[10px] text-gray-500 font-black uppercase mt-1">Bed Sequence #{tenant.bedId?.bedNumber || "N/A"}</p>
                    </td>
                    <td className="px-8 py-6">
                        <p className="text-gray-300 font-bold text-sm">{new Date(tenant.checkInDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                        <p className="text-[10px] text-gray-600 font-black uppercase mt-1">Confirmed</p>
                    </td>
                    <td className="px-8 py-6">
                      {(() => {
                          const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
                          const fee = fees.find(f => String(f.tenantId?._id || f.tenantId) === String(tenant._id) && f.month === currentMonth);
                          const isPaid = fee?.status === "PAID";
                          
                          return (
                              <div>
                                  <span className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${isPaid ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`}>
                                    {isPaid ? "PAID" : "PENDING"}
                                  </span>
                                  <p className="text-[10px] text-gray-500 font-bold mt-2">{currentMonth}</p>
                              </div>
                          );
                      })()}
                    </td>
                     <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                          {(() => {
                              const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
                              const fee = fees.find(f => String(f.tenantId?._id || f.tenantId) === String(tenant._id) && f.month === currentMonth);
                              if (fee?.status !== "PAID") {
                                  return (
                                      <button 
                                        onClick={() => handleMarkPaid(tenant._id, tenant.bedId?.roomId?.rentPerBed)}
                                        className="p-2.5 bg-emerald-600/10 text-emerald-500 rounded-xl hover:bg-emerald-600/20 transition-all text-sm font-black uppercase tracking-widest border border-emerald-500/20" 
                                        title="Mark as Paid"
                                      >💰 Paid</button>
                                  );
                              }
                              return null;
                          })()}
                          <button 
                            onClick={() => { setSelectedTenant(tenant); setViewType('payments'); }}
                            className="p-2.5 bg-[#1f2937] rounded-xl text-gray-400 hover:text-white transition-all text-sm" 
                            title="View History"
                          >📜</button>
                          <button 
                            onClick={() => { setSelectedTenant(tenant); setViewType('documents'); }}
                            className="p-2.5 bg-[#1f2937] rounded-xl text-gray-400 hover:text-white transition-all text-sm" 
                            title="View Documents"
                          >🆔</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                      <span className="text-6xl block mb-4 opacity-10">🕊️</span>
                      <p className="text-gray-500 font-black text-sm uppercase tracking-widest">No residents found in the database</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {/* Add Tenant Modal */}
       {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#111827] w-full max-w-lg rounded-[2.5rem] border border-[#1f2937] shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-8 border-b border-[#1f2937]">
                            <h2 className="text-3xl font-black text-white tracking-tighter">Add New Resident</h2>
                            <p className="text-gray-500 text-sm mt-1">Register a new tenant to an available bed.</p>
                        </div>
                        <form onSubmit={handleAddTenant} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                                        placeholder="Tenant Name"
                                        value={newTenant.name}
                                        onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                        <input 
                                            required
                                            type="email" 
                                            className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                                            placeholder="email@example.com"
                                            value={newTenant.email}
                                            onChange={(e) => setNewTenant({...newTenant, email: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input 
                                            required
                                            type="text" 
                                            className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                                            placeholder="10 digit number"
                                            value={newTenant.phone}
                                            onChange={(e) => setNewTenant({...newTenant, phone: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Available Bed</label>
                                    <select 
                                        required
                                        className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer"
                                        value={newTenant.bedId}
                                        onChange={(e) => setNewTenant({...newTenant, bedId: e.target.value})}
                                    >
                                        <option value="">Choose a bed...</option>
                                        {availableBeds.map(bed => (
                                            <option key={bed._id} value={bed._id}>
                                                {bed.roomId ? `Room ${bed.roomId.roomNumber} - Bed ${bed.bedNumber} (₹${bed.roomId.rentPerBed}/mo)` : `Bed ${bed.bedNumber} (Unlinked Room)`}
                                            </option>
                                        ))}
                                    </select>
                                    {availableBeds.length === 0 && (
                                        <p className="text-[10px] text-red-500 font-bold uppercase mt-1">No vacant beds found. Add rooms first.</p>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Check-in Date</label>
                                        <input 
                                            required
                                            type="date" 
                                            className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                                            value={newTenant.checkInDate}
                                            onChange={(e) => setNewTenant({...newTenant, checkInDate: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Deposit Amount</label>
                                        <input 
                                            required
                                            type="number" 
                                            className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl p-4 text-white focus:border-blue-500 outline-none transition-all"
                                            placeholder="₹"
                                            value={newTenant.depositAmount}
                                            onChange={(e) => setNewTenant({...newTenant, depositAmount: e.target.value})}
                                        />
                                    </div>
                                </div>
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
                                    Register Resident
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
             )}

             {/* View Modals (Payments/Documents) */}
             {viewType && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                    <div className="bg-[#111827] w-full max-w-2xl rounded-[2.5rem] border border-[#1f2937] shadow-2xl overflow-hidden animate-slide-up">
                        <div className="p-8 border-b border-[#1f2937] flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-black text-white tracking-tighter">{viewType === 'payments' ? 'Payment History' : 'ID Documents'}</h2>
                                <p className="text-gray-500 text-sm mt-1">{selectedTenant?.userId?.name}'s Records</p>
                            </div>
                            <button onClick={() => setViewType(null)} className="text-2xl opacity-50 hover:opacity-100 transition-opacity">✕</button>
                        </div>
                        <div className="p-8 max-h-[60vh] overflow-y-auto">
                            {viewType === 'payments' ? (
                                <div className="space-y-4">
                                    {/* Mocking for now, will link to real fee records if needed */}
                                    <div className="p-6 bg-[#0b0f19] rounded-2xl border border-[#1f2937] flex justify-between items-center">
                                        <div>
                                            <p className="text-white font-bold">Monthly Rent - March 2026</p>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Paid on Mar 10, 2026</p>
                                        </div>
                                        <p className="text-emerald-500 font-black text-xl">₹{selectedTenant?.bedId?.roomId?.rentPerBed}</p>
                                    </div>
                                    <div className="text-center py-10 opacity-30 italic text-gray-500 font-medium">No other transactions found</div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <DocumentList tenantId={selectedTenant._id} />
                                </div>
                            )}
                        </div>
                    </div>
                 </div>
             )}
    </div>
  );
};

export default TenantManagement;
