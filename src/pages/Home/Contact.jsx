import React from "react";

const Contact = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
            <h1 className="text-6xl font-black text-white">Get in <br /><span className="text-blue-500">Touch.</span></h1>
            <p className="text-gray-400 max-w-md leading-relaxed">
                Have questions about our properties or partnership? Drop us a message and our team will get back to you within 24 hours.
            </p>
            
            <div className="space-y-6 pt-8">
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-xl">📧</div>
                    <div>
                        <p className="text-white font-bold">Email Support</p>
                        <p className="text-gray-500 text-sm">support@smartpg.com</p>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-xl">📞</div>
                    <div>
                        <p className="text-white font-bold">Call Us</p>
                        <p className="text-gray-500 text-sm">+91 99000 12134</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="bg-[#111827] border border-[#1f2937] rounded-[3rem] p-10 shadow-2xl">
            <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! We'll get back to you shortly.");
                e.target.reset();
            }}>
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Full Name</label>
                    <input type="text" className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="John Doe" required />
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Email Address</label>
                    <input type="email" className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="john@example.com" required />
                </div>
                <div className="space-y-2">
                    <label className="text-xs text-gray-500 font-bold uppercase tracking-widest pl-1">Message</label>
                    <textarea className="w-full bg-[#0b0f19] border border-[#1f2937] rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 h-32" placeholder="How can we help?" required></textarea>
                </div>
                <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-900/40">
                    Send Message
                </button>
            </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
