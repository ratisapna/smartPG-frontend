import React, { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

const Payments = () => {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFees();
    }, []);

    const fetchFees = async () => {
        try {
            const res = await apiClient.get("/fees/my"); // Assuming this route exists or I'll add it
            setFees(res.data.fees || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayment = async (feeId) => {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

        try {
            const orderRes = await apiClient.post("/payments/create-order", { feesId: feeId });
            const { order } = orderRes.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY || "rzp_test_R8yNR9P8Xqnjkb",
                amount: order.amount,
                currency: "INR",
                name: "SmartPG",
                description: "Rent Payment",
                order_id: order.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await apiClient.post("/payments/verify", {
                            ...response,
                            feesId: feeId
                        });
                        if (verifyRes.data.success) {
                            alert("Payment Successful!");
                            fetchFees();
                        }
                    } catch (err) {
                        console.error("Verification failed", err);
                        alert("Payment verification failed. Please contact support.");
                    }
                },
                theme: { color: "#2563eb" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error(err);
            alert("Payment failed to initialize");
        }
    };

    if (loading) return <div className="text-white text-center py-10">Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">Rent & Payments</h1>
            
            <div className="bg-[#111827] border border-[#1f2937] rounded-3xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#1f2937] text-gray-400 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Month</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Due Date</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f2937]">
                        {fees.length > 0 ? fees.map((f) => (
                            <tr key={f._id} className="text-gray-300 hover:bg-[#111827]/50 transition-colors">
                                <td className="px-6 py-4 font-bold text-white">{f.month}</td>
                                <td className="px-6 py-4">₹{f.amount}</td>
                                <td className="px-6 py-4">{new Date(f.dueDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                                        f.status === "PAID" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                    }`}>
                                        {f.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {f.status !== "PAID" && (
                                        <button 
                                            onClick={() => handlePayment(f._id)}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-all shadow-lg shadow-blue-900/20"
                                        >
                                            Pay Now
                                        </button>
                                    )}
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-500">No pending or past bills found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Payments;
