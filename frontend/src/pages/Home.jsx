import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [packages, setPackages] = useState([]);
  const [searchDestination, setSearchDestination] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await fetch("http://localhost:5000/packages");
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = () => {
    if (searchDestination) {
      navigate(`/packages?search=${searchDestination}`);
    } else {
      navigate(`/packages`);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">

      {/* HERO */}
      <div
        className="h-screen relative flex flex-col items-center justify-center text-white"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=2071&auto=format&fit=crop')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 text-center px-6 mt-20 w-full max-w-5xl">
          <h1 className="text-5xl md:text-7xl font-extrabold drop-shadow-lg leading-tight mb-6">
            Discover The Magic Of{" "}
            <span className="text-blue-400">BharatTrip</span>
          </h1>
          <p className="text-lg md:text-2xl font-medium drop-shadow-md mb-12 text-gray-100 max-w-2xl mx-auto">
            Experience handcrafted tours, breathtaking destinations, and unforgettable adventures across India.
          </p>

          {/* REALISTIC SEARCH BAR */}
          <div className="bg-white dark:bg-gray-800 p-3 md:p-4 rounded-2xl md:rounded-full shadow-2xl flex flex-col md:flex-row gap-4 items-center justify-between text-gray-800 dark:text-white w-full max-w-4xl mx-auto transition-colors duration-300">
            <div className="flex flex-col text-left px-4 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 pb-2 md:pb-0">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Destination</label>
              <select value={searchDestination} onChange={(e) => setSearchDestination(e.target.value)} className="outline-none py-1 text-base font-semibold bg-transparent w-full text-gray-900 dark:text-white dark:bg-gray-800 cursor-pointer">
                <option value="" disabled>Where to?</option>
                <option value="goa">Goa</option>
                <option value="jaipur">Jaipur</option>
                <option value="kerala">Kerala</option>
                <option value="manali">Manali</option>
                <option value="rishikesh">Rishikesh</option>
                <option value="somnath">Somnath</option>
              </select>
            </div>
            <div className="flex flex-col text-left px-4 w-full md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 pb-2 md:pb-0">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
              <input type="date" className="outline-none py-1 text-base font-semibold bg-transparent w-full cursor-pointer text-gray-900 dark:text-white dark:[color-scheme:dark]" />
            </div>
            <div className="flex flex-col text-left px-4 w-full md:w-1/4 pb-2 md:pb-0">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Guests</label>
              <input type="number" placeholder="Add guests" min="1" className="outline-none py-1 text-base font-semibold bg-transparent w-full text-gray-900 dark:text-white placeholder-gray-400" />
            </div>
            <button onClick={handleSearch} className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 md:py-4 rounded-xl md:rounded-full font-bold hover:bg-blue-700 transition shadow-lg shrink-0">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* PACKAGES SECTION */}
      <div className="bg-gray-50 dark:bg-gray-900 py-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2">Top Destinations</h2>
            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">Explore Popular Packages</h3>
          </div>

          {/* CLEAN GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
            {packages.slice(0, 6).map((p) => (
              <div
                key={p._id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-2xl dark:hover:shadow-blue-900/20 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer flex flex-col"
                onClick={() => navigate(`/packages/${p._id}`)}
              >
                {/* IMAGE */}
                <div className="relative overflow-hidden h-64">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-gray-900 dark:text-white shadow-sm">
                    ₹{p.price.toLocaleString("en-IN")}
                  </div>
                </div>

                {/* CONTENT */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
                    <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                    India
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{p.title}</h3>
                  
                  <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-6 mt-auto">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    5 Days / 4 Nights
                  </div>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-4 flex justify-between items-center">
                    <div className="flex items-center text-yellow-400 text-sm">
                       <span>★★★★☆</span> <span className="text-gray-400 ml-1 text-xs">(4.5)</span>
                    </div>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline">Explore →</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* VIEW MORE BUTTON */}
          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/packages")}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-bold px-8 py-3 rounded-full hover:bg-gray-900 hover:text-white dark:hover:bg-gray-700 transition-all shadow-sm"
            >
              View All Packages →
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="bg-white dark:bg-gray-800 py-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-center px-6 md:px-12">
          <div className="p-6">
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Best Price Guarantee</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">
              Affordable travel deals across India
            </p>
          </div>

          <div className="p-6">
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Trusted Agency</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">Over 10,000+ happy customers trust us with their vacations.</p>
          </div>

          <div className="p-6">
            <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">24/7 Support</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-4 leading-relaxed">Our travel experts are always here to help you, anytime, anywhere.</p>
          </div>
        </div>
      </div>

      {/* TESTIMONIALS (NEW) */}
      <div className="bg-gray-50 dark:bg-gray-900 py-24 transition-colors duration-300 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2">Testimonials</h2>
          <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-16">What Our Travelers Say</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Rahul Sharma", text: "BharatTrip made our Kerala vacation absolutely seamless. The houseboat experience was magical!", rating: 5, location: "New Delhi" },
              { name: "Priya Patel", text: "Highly recommend their Manali adventure package. Professional guides, premium hotels, and amazing food.", rating: 5, location: "Mumbai" },
              { name: "Amit Kumar", text: "The best travel agency for spiritual tours. Our Somnath Darshan was beautifully organized from start to finish.", rating: 4, location: "Ahmedabad" }
            ].map((review, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-left hover:shadow-lg transition-shadow">
                <div className="text-yellow-400 mb-4 text-lg">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-6">"{review.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-xl">{review.name.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{review.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{review.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NEWSLETTER SECTION */}
      <div className="bg-blue-600 dark:bg-blue-700 py-20 text-white text-center px-6 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Get Special Offers & Travel Inspiration</h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Subscribe to our newsletter and receive exclusive deals, travel guides, and early access to our premium packages directly in your inbox.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <input type="email" placeholder="Enter your email address" className="px-6 py-4 rounded-full w-full text-gray-900 dark:text-white dark:bg-gray-800 font-medium outline-none focus:ring-4 focus:ring-blue-400" />
            <button className="bg-gray-900 text-white font-bold px-8 py-4 rounded-full hover:bg-black transition-colors shadow-lg shrink-0">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
