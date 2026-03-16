import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post("/auth/login", formData);
      const { token, user } = response.data;
      
      // Store auth info
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);
      
      // Navigate based on role
      if (user.role === "OWNER") {
        navigate("/dashboard");
      } else {
        localStorage.setItem("tenantId", user._id);
        navigate("/dashboard/tenant");
      }
    } catch (error) {
      console.error("Login failed", error);
      alert(error.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-slide-up">
        <div className="bg-[#111827] border border-[#1f2937] rounded-[2.5rem] p-10 shadow-2xl">
          <div className="text-center mb-10">
             <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-blue-900/40 mx-auto mb-6">S</div>
             <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
             <p className="text-gray-500 text-sm">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Email Address</label>
              <input 
                type="email" 
                required
                className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between px-1">
                <label className="text-xs text-gray-500 font-bold uppercase tracking-widest">Password</label>
                <a href="#" className="text-[10px] text-blue-500 font-bold uppercase hover:underline">Forgot?</a>
              </div>
              <input 
                type="password" 
                required
                className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-900/40 hover:-translate-y-1">
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
                Don't have an account? <Link to="/signup" className="text-blue-500 font-bold hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
