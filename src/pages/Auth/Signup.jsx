import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get("role") || "tenant");

  const roles = [
    { id: "tenant", title: "Join as Tenant", icon: "🏠", desc: "Find your perfect stay today." },
    { id: "owner", title: "Become a Partner", icon: "🏢", desc: "Manage your property effortlessly." }
  ];

  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/auth/register", {
        ...formData,
        role: role.toUpperCase()
      });
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (error) {
      console.error("Signup failed", error);
      alert(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl animate-slide-up">
        <div className="bg-[#111827] border border-[#1f2937] rounded-[2.5rem] p-10 md:p-14 shadow-2xl">
          <div className="text-center mb-12">
             <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Create Account</h1>
             <p className="text-gray-500">Choose your path on SmartPG</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
             {roles.map((r) => (
                <div 
                  key={r.id}
                  onClick={() => setRole(r.id)}
                  className={`p-8 rounded-3xl border-2 transition-all cursor-pointer group flex flex-col items-center text-center ${
                    role === r.id 
                      ? "bg-blue-600/10 border-blue-600" 
                      : "bg-[#0b0f19] border-[#1f2937] hover:border-blue-500/30"
                  }`}
                >
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transition-all ${
                        role === r.id ? "bg-blue-600 text-white shadow-xl shadow-blue-900/40" : "bg-[#111827] text-gray-500"
                    }`}>
                        {r.icon}
                    </div>
                    <h3 className={`font-bold mb-2 ${role === r.id ? "text-white" : "text-gray-400"}`}>{r.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{r.desc}</p>
                </div>
             ))}
          </div>

          <form className="space-y-6 max-w-md mx-auto" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Full Name</label>
              <input 
                type="text" 
                required
                className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" 
                placeholder="John Doe" 
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Email</label>
              <input 
                type="email" 
                required
                className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" 
                placeholder="name@domain.com" 
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Phone Number</label>
              <input 
                type="tel" 
                required
                className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" 
                placeholder="9876543210" 
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Password</label>
              <input 
                type="password" 
                required
                className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
            
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-900/40 mt-8">
              Sign Up as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">
                Already have an account? <Link to="/login" className="text-blue-500 font-bold hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
