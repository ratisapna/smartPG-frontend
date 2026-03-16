import { getAllPGs } from "../../api/pgService";
import PGCard from "../../components/pg/PGCard";
import { useState,useEffect } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [pgs, setPgs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPGs = async () => {
      try {
        const response = await getAllPGs();
        setPgs(response.pgs || []);
        
        // Handle URL search param
        const urlParams = new URLSearchParams(window.location.search);
        const search = urlParams.get("search");
        if (search) {
            setSearchQuery(search);
            setTimeout(() => {
                document.getElementById("rooms")?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
      } catch (error) {
        console.error("Error fetching PGs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPGs();
  }, []);

  // Derive unique amenities from PGs
  const allAmenities = pgs.reduce((acc, pg) => {
    if (pg.amenities) {
      pg.amenities.forEach(a => {
        if (!acc.includes(a)) acc.push(a);
      });
    }
    return acc;
  }, []);

  const amenityIcons = {
    "WiFi": "🌐",
    "AC": "❄️",
    "Food": "🍽️",
    "Laundry": "🧺",
    "Security": "🛡️",
    "Gym": "🏋️",
    "default": "✨"
  };

  const dynamicAmenities = allAmenities.slice(0, 6).map(name => ({
    name,
    icon: amenityIcons[Object.keys(amenityIcons).find(k => name.includes(k))] || amenityIcons.default,
    desc: "Available"
  }));


  const [searchQuery, setSearchQuery] = useState("");

  const filteredPGs = pgs.filter(pg => {
    const query = searchQuery.toLowerCase();
    return (
      pg.name?.toLowerCase().includes(query) ||
      pg.address?.city?.toLowerCase().includes(query) ||
      pg.address?.street?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 w-full relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-sm font-bold mb-8 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Over 500+ Premium Rooms Available
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter mb-8 animate-slide-up">
              Live Bold. <br />
              <span className="bg-gradient-to-r from-blue-500 via-indigo-400 to-blue-600 bg-clip-text text-transparent">Stay Smart.</span>
            </h1>
            
            <p className="text-xl text-gray-400 mb-12 animate-slide-up [animation-delay:200ms] leading-relaxed">
              Experience India's most premium PG network. Designer rooms, 
              world-class amenities, and a community that feels like home.
            </p>

            {/* Search Box */}
            <div className="flex flex-col md:flex-row gap-4 p-3 bg-[#111827]/80 backdrop-blur-2xl border border-[#1f2937] rounded-[2.5rem] shadow-2xl animate-slide-up [animation-delay:400ms]">
                <div className="flex-1 flex items-center gap-3 px-6 py-4 bg-[#0b0f19] rounded-[2rem] border border-[#1f2937] focus-within:border-blue-500/50 transition-all">
                    <span className="text-xl">🔍</span>
                    <input 
                      type="text" 
                      placeholder="Search by location, PG name..." 
                      className="w-full bg-transparent text-white outline-none placeholder:text-gray-600"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <button 
                    onClick={() => document.getElementById("rooms")?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-[2rem] transition-all shadow-xl shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98] text-center"
                >
                    Explore Now
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Room Listings */}
      <section id="rooms" className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight mb-4">Featured Spaces</h2>
                <p className="text-gray-500">Handpicked premium stays for you</p>
            </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#111827] rounded-3xl h-96 animate-pulse border border-[#1f2937]"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPGs.length > 0 ? (
              filteredPGs.map((pg) => <PGCard key={pg._id} pg={pg} />)
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-[#1f2937] rounded-[3rem]">
                 <p className="text-gray-500 text-lg italic">No matching rooms found.</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Role-Based CTA Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-blue-700 to-blue-900 rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-4">Become a Partner</h2>
              <p className="text-blue-100 mb-8 max-w-sm">Are you a property owner looking to automate your PG business? List your properties and manage tenants effortlessly.</p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-3 text-sm text-blue-50"><span className="text-blue-300">✓</span> Automated Rent Collection</li>
                <li className="flex items-center gap-3 text-sm text-blue-50"><span className="text-blue-300">✓</span> Tenant Verification Tools</li>
                <li className="flex items-center gap-3 text-sm text-blue-50"><span className="text-blue-300">✓</span> Maintenance Ticketing</li>
              </ul>
              <Link to="/signup?role=owner" className="inline-block px-8 py-3 bg-white text-blue-700 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-xl shadow-blue-900/20">
                Sign up as PG Owner
              </Link>
            </div>
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
          </div>

          <div className="bg-[#111827] rounded-[2.5rem] p-10 border-2 border-[#1f2937] relative overflow-hidden group">
            <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">Find Your Home</h3>
              <p className="text-gray-400 mb-8 max-w-sm">Looking for a hassle-free living experience? Join the SmartPG community and find the perfect room for your needs.</p>
              <ul className="space-y-3 mb-10">
                <li className="flex items-center gap-3 text-sm text-gray-300"><span className="text-blue-500">✓</span> Verified Listings Only</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><span className="text-blue-500">✓</span> Easy Digital Documentation</li>
                <li className="flex items-center gap-3 text-sm text-gray-300"><span className="text-blue-500">✓</span> Direct Owner Communication</li>
              </ul>
              <Link to="/signup?role=tenant" className="inline-block px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-900/40">
                Sign up as Tenant
              </Link>
            </div>
            <div className="absolute -right-10 -bottom-10 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform">
               <span className="text-[12rem]">🏠</span>
            </div>
          </div>
      </section>

      {/* Amenities Section */}
      <section id="amenities" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-20">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white">World-Class Amenities</h2>
          <p className="text-gray-500 mt-2">We provide more than just a room. Enjoy a lifestyle curated for modern urban living.</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {(dynamicAmenities.length > 0 ? dynamicAmenities : [
            { name: "WiFi", icon: "🌐", desc: "High Speed" },
            { name: "AC", icon: "❄️", desc: "Climate Control" },
            { name: "Food", icon: "🍽️", desc: "Home Style" },
            { name: "Laundry", icon: "🧺", desc: "Fresh" },
            { name: "Security", icon: "🛡️", desc: "24/7" },
            { name: "Gym", icon: "🏋️", desc: "Fitness" }
          ]).map((item, idx) => (
            <div key={idx} className="bg-[#111827] border border-[#1f2937] p-8 rounded-3xl hover:border-blue-500/50 transition-all group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
              <h4 className="text-white font-bold text-sm mb-1">{item.name}</h4>
              <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
