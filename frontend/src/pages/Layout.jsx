import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";

function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Start transparent only on pages with large hero images (Home and Package Details)
  const isHeroPage = location.pathname === "/" || (location.pathname.startsWith("/packages/") && location.pathname !== "/packages");

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    // Instantly reset scroll position when the user changes pages
    window.scrollTo(0, 0);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // If it's not a hero page, the navbar should always be solid white
  const navSolid = !isHeroPage || isScrolled;

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-blue-500 selection:text-white">
      {/* GLOBAL NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${navSolid ? "bg-white shadow-lg py-4 text-gray-900" : "bg-transparent py-6 text-white"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <h1 className={`text-3xl font-extrabold cursor-pointer tracking-wider transition ${navSolid ? "text-gray-900" : "text-white"}`} onClick={() => navigate("/")}>
            BHARAT<span className={navSolid ? "text-blue-600" : "text-blue-400"}>TRIP</span>
          </h1>
          <div className="hidden md:flex gap-8 text-base font-semibold items-center">
            <button onClick={() => navigate("/")} className="hover:text-blue-500 transition">Home</button>
            <button onClick={() => navigate("/packages")} className="hover:text-blue-500 transition">Destinations</button>
            <button onClick={() => navigate("/packages")} className="hover:text-blue-500 transition">Packages</button>
            <button className="hover:text-blue-500 transition">About Us</button>
            <button className="hover:text-blue-500 transition">Contact</button>
          </div>
          <div className="hidden md:block">
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition shadow-md">
              Login / Signup
            </button>
          </div>
        </div>
      </nav>

      {/* DYNAMIC PAGE CONTENT INJECTED HERE */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <h2 className="text-3xl font-extrabold mb-4">BHARAT<span className="text-blue-500">TRIP</span></h2>
            <p className="text-gray-400 max-w-md">Your trusted partner for exploring the incredible landscapes, vibrant cultures, and hidden gems of India.</p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="text-gray-400 space-y-2">
              <li><button onClick={() => navigate("/")} className="hover:text-white transition">Home</button></li>
              <li><button onClick={() => navigate("/packages")} className="hover:text-white transition">Tour Packages</button></li>
              <li><button className="hover:text-white transition">About Us</button></li>
              <li><button className="hover:text-white transition">Contact Us</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Info</h4>
            <ul className="text-gray-400 space-y-2">
              <li>📞 +91 98765 43210</li>
              <li>✉️ info@bharattrip.com</li>
              <li>📍 New Delhi, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} BharatTrip. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;