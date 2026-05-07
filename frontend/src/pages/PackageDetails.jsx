import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);
  const [guests, setGuests] = useState(2);
  const [travelDate, setTravelDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingEmail, setBookingEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackage();
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (user) {
      setBookingName(user.name);
      setBookingEmail(user.email);
    }
  }, []);

  const fetchPackage = async () => {
    const res = await fetch("http://localhost:5000/packages");
    const data = await res.json();

    const found = data.find((p) => p._id === id);
    setPkg(found);
  };

  const handleBookNowClick = () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    if (!user) {
      alert("Please 'Login' or 'Continue as Guest' from the top menu first!");
      window.scrollTo(0, 0);
      return;
    }
    if (!travelDate) {
      alert("Please select a travel date!");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      packageId: pkg._id,
      packageName: pkg.title,
      userName: bookingName,
      userEmail: bookingEmail,
      phone,
      travelDate,
      guests,
      totalPrice: pkg.price * guests
    };

    try {
      const res = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        alert("Booking Confirmed! Our team will contact you shortly.");
        setIsModalOpen(false);
        const user = JSON.parse(localStorage.getItem("user") || "null");
        navigate(user && user.role === "user" ? "/dashboard" : "/");
      } else {
        const errData = await res.json();
        alert(errData.message || "Failed to book.");
      }
    } catch (err) {
      console.error("Booking error", err);
      alert("Something went wrong while booking.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!pkg) return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 dark:text-gray-400 font-medium tracking-wide">Loading your dream destination...</p>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">

      {/* HERO SECTION */}
      <div className="relative h-[60vh] w-full bg-cover bg-center" style={{ backgroundImage: `url(${pkg.image})` }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900 to-transparent p-12 text-white">
          <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-end">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Top Rated</span>
                <span className="bg-white/20 backdrop-blur-md text-xs font-bold px-3 py-1 rounded-full flex items-center"><svg className="w-3 h-3 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg> 4.8 (124 Reviews)</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg mb-2">{pkg.title}</h1>
              <p className="text-lg md:text-xl font-medium text-gray-200 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                India
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN - DETAILS */}
        <div className="lg:col-span-2 space-y-12">
          {/* Tour Overview */}
          <section>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Tour Overview</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              {pkg.description || `Embark on an unforgettable journey to ${pkg.title}. This premium travel package is meticulously crafted to offer you the perfect blend of breathtaking landscapes, vibrant local culture, and ultimate comfort. Whether you are looking for a peaceful retreat or a thrilling adventure, our expert guides and handpicked accommodations ensure a seamless and enriching experience.`}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Duration</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{pkg.duration || "5 Days / 4 Nights"}</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Group Size</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Max 12 People</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg></div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Languages</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">English, Hindi</span>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center text-center">
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg></div>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Hotel</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">4-Star Premium</span>
              </div>
            </div>
          </section>

          {/* What's Included */}
          <section>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">What's Included</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium"><svg className="w-6 h-6 text-green-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Premium 4-Star Accommodation</div>
              <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium"><svg className="w-6 h-6 text-green-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Daily Buffet Breakfast & Dinner</div>
              <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium"><svg className="w-6 h-6 text-green-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Airport Pick-up & Drop-off</div>
              <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium"><svg className="w-6 h-6 text-green-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Professional English-speaking Guide</div>
              <div className="flex items-center text-gray-400 dark:text-gray-500 line-through"><svg className="w-6 h-6 text-red-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Flights and Airfare</div>
              <div className="flex items-center text-gray-400 dark:text-gray-500 line-through"><svg className="w-6 h-6 text-red-400 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Personal Expenses & Tips</div>
            </div>
          </section>

          {/* Itinerary */}
          <section>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-6">Sample Itinerary</h2>
            <div className="border-l-2 border-blue-200 ml-3 space-y-8 pb-4">
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1 w-5 h-5 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 shadow"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Day 1: Arrival & Welcome</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Arrive at the destination. Our representative will pick you up from the airport and transfer you to your premium hotel. Spend the evening relaxing and enjoying the welcome dinner.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1 w-5 h-5 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 shadow"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Day 2: City Sightseeing Tour</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">After breakfast, embark on a full-day guided tour covering major cultural and historical landmarks. Evening free for local shopping and leisure.</p>
              </div>
              <div className="relative pl-8">
                <div className="absolute -left-[11px] top-1 w-5 h-5 bg-blue-600 rounded-full border-4 border-white dark:border-gray-900 shadow"></div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Day 3: Nature & Adventure</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">Head out for an excursion to nearby natural wonders. Participate in optional adventure activities or simply soak in the breathtaking views.</p>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN - BOOKING WIDGET */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 sticky top-32 transition-colors duration-300">
            <div className="mb-6">
              <span className="text-3xl font-extrabold text-gray-900 dark:text-white">₹{pkg.price.toLocaleString("en-IN")}</span>
              <span className="text-gray-500 dark:text-gray-400 font-medium"> / person</span>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden flex flex-col">
                <div className="flex flex-col p-3 border-b border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Travel Date</label>
                  <input type="date" value={travelDate} onChange={(e) => setTravelDate(e.target.value)} min={new Date().toISOString().split("T")[0]} className="outline-none py-1 text-gray-900 dark:text-white font-bold cursor-pointer bg-transparent dark:[color-scheme:dark]" />
                </div>
                <div className="flex flex-col p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Guests</label>
                  <select className="outline-none py-1 text-gray-900 dark:text-white font-bold cursor-pointer bg-transparent" value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}>
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mb-6 text-lg font-bold text-gray-900 dark:text-white">
              <span>Total Price</span>
              <span className="text-blue-600 dark:text-blue-400 text-2xl">₹{(pkg.price * guests).toLocaleString("en-IN")}</span>
            </div>

            <button onClick={handleBookNowClick} className="w-full bg-blue-600 text-white font-extrabold py-4 rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none">
              Book Now
            </button>
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4 font-medium">You won't be charged yet</p>
          </div>
        </div>

      </div>

      {/* CHECKOUT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity px-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md p-8 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Complete Booking</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Confirm your details for {pkg.title}.</p>
            
            <form onSubmit={handleConfirmBooking} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Full Name</label>
                <input type="text" required value={bookingName} onChange={(e) => setBookingName(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Email Address</label>
                <input type="email" required value={bookingEmail} onChange={(e) => setBookingEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Phone Number</label>
                <input type="tel" required placeholder="+91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              
              <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-xl mt-6">
                <div className="flex justify-between text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
                  <span>Total Amount:</span>
                  <span className="text-blue-600 dark:text-blue-400">₹{(pkg.price * guests).toLocaleString("en-IN")}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Pay later when our agent contacts you.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold py-3.5 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-700 transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 transition disabled:opacity-70">
                  {isSubmitting ? "Processing..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PackageDetails;