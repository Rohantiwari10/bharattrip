import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Packages() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchPackages();
  }, [location.search]);

  const fetchPackages = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/packages`);
      const data = await res.json();
  
      // Get the search query from the URL (e.g., ?search=goa)
      const searchParams = new URLSearchParams(location.search);
      const searchQuery = searchParams.get("search");
  
      if (searchQuery) {
        // Filter packages if a search query exists
        const filteredData = data.filter((p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setPackages(filteredData);
      } else {
        setPackages(data);
      }
    } catch (err) {
      console.error("Failed to fetch packages. Is your backend running?", err);
    }
  };

  // Get the current search word for the page title
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-24 pb-12 px-6 md:px-12 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2">Destinations</h2>
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            {searchQuery 
              ? `Search Results for "${searchQuery.charAt(0).toUpperCase() + searchQuery.slice(1)}"` 
              : "All Tour Packages"}
          </h3>
        </div>

        {packages.length === 0 ? (
          <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 max-w-2xl mx-auto mt-10 transition-colors duration-300">
            <h4 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">No packages found</h4>
            <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find any tours matching your destination. Try exploring our other popular packages!</p>
            <button onClick={() => navigate("/packages")} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition">View All Packages</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {packages.map((p) => (
              <div key={p._id} className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col" onClick={() => navigate(`/packages/${p._id}`)}>
                <div className="relative overflow-hidden h-64">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 dark:text-white shadow-sm">₹{p.price.toLocaleString("en-IN")}</div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3"><svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>India</div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.title}</h3>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-6 mt-auto"><svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>{p.duration || "5 Days / 4 Nights"}</div>
                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center">
                    <div className="flex items-center text-yellow-400 text-sm"><span>★★★★☆</span> <span className="text-gray-400 ml-1 text-xs">(4.5)</span></div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">View Details →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Packages;