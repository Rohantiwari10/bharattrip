import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";

function Layout() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference on initial load
    return localStorage.getItem("theme") === "dark" || 
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  // Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload(); // Refresh to clear state
  };

  const navigate = useNavigate();
  const location = useLocation();

  // Silently wake up the backend as soon as any page on the website loads
  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
    // Fire and forget request to wake up Render/Vercel server in the background
    fetch(`${API_URL}/packages`).catch(() => {});
  }, []);

  // Start transparent only on pages with large hero images (Home and Package Details)
  const isHeroPage = location.pathname === "/" || (location.pathname.startsWith("/packages/") && location.pathname !== "/packages");

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    
    // Instantly reset scroll position when the user changes pages
    window.scrollTo(0, 0);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Nav should be solid if it's not a hero page or if scrolled
  const navSolid = !isHeroPage || isScrolled;

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-blue-500 selection:text-white dark:bg-gray-900 transition-colors duration-300">
      {/* GLOBAL NAVBAR */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${navSolid ? "bg-white dark:bg-gray-900 shadow-lg py-4 text-gray-900 dark:text-white" : "bg-transparent py-6 text-white"}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <h1 className={`text-3xl font-extrabold cursor-pointer tracking-wider transition ${navSolid ? "text-gray-900 dark:text-white" : "text-white"}`} onClick={() => navigate("/")}>
            BHARAT<span className={navSolid ? "text-blue-600" : "text-blue-400"}>TRIP</span>
          </h1>
          <div className="hidden md:flex gap-8 text-base font-semibold items-center">
            <button onClick={() => navigate("/")} className="hover:text-blue-500 transition">Home</button>
            <button onClick={() => navigate("/packages")} className="hover:text-blue-500 transition">Packages</button>
            <button onClick={() => navigate("/about")} className="hover:text-blue-500 transition">About Us</button>
            <button onClick={() => navigate("/contact")} className="hover:text-blue-500 transition">Contact</button>
          </div>
          
          {/* TOP RIGHT ACTIONS */}
          <div className="flex items-center gap-3 md:gap-6">
            {/* DARK MODE TOGGLE */}
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className={`p-2.5 rounded-full transition-all duration-300 ${
                darkMode 
                  ? "text-yellow-400 bg-gray-800 hover:bg-gray-700 shadow-inner" 
                  : navSolid 
                    ? "text-blue-600 bg-blue-50 hover:bg-blue-100 shadow-sm" 
                    : "text-white bg-white/20 hover:bg-white/30 backdrop-blur-md shadow-sm"
              }`}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
              ) : (
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
              )}
            </button>
            
            {/* DESKTOP USER ACTIONS */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <>
                  {user.role === "admin" && <button onClick={() => navigate("/admin")} className="text-sm font-bold hover:text-blue-500 transition">Admin Panel</button>}
                  {user.role === "user" && <button onClick={() => navigate("/dashboard")} className="text-sm font-bold hover:text-blue-500 transition">My Bookings</button>}
                  <button onClick={handleLogout} className="bg-red-500 text-white px-5 py-2 rounded-full font-bold hover:bg-red-600 transition shadow-md text-sm">
                    Logout ({user.name.split(" ")[0]})
                  </button>
                </>
              ) : (
                <button onClick={() => setIsAuthModalOpen(true)} className="bg-blue-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-blue-700 transition shadow-md">
                  Login / Signup
                </button>
              )}
            </div>

            {/* MOBILE LOGOUT BUTTON */}
            {user && (
              <button onClick={handleLogout} className="md:hidden p-2 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-full hover:bg-red-100 dark:hover:bg-red-500/20 transition" title="Logout">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex justify-around items-center py-1.5 z-[60] shadow-[0_-10px_40px_rgba(0,0,0,0.08)] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <button onClick={() => navigate("/")} className={`flex flex-col items-center p-2 w-16 transition-colors ${location.pathname === "/" ? "text-blue-600" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"}`}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => navigate("/packages")} className={`flex flex-col items-center p-2 w-16 transition-colors ${location.pathname.startsWith("/packages") ? "text-blue-600" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"}`}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
          <span className="text-[10px] font-bold">Explore</span>
        </button>
        <button onClick={() => navigate("/contact")} className={`flex flex-col items-center p-2 w-16 transition-colors ${location.pathname === "/contact" ? "text-blue-600" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"}`}>
          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <span className="text-[10px] font-bold">Contact</span>
        </button>
        {user ? (
          <button onClick={() => navigate(user.role === "admin" ? "/admin" : "/dashboard")} className={`flex flex-col items-center p-2 w-16 transition-colors ${location.pathname === "/dashboard" || location.pathname === "/admin" ? "text-blue-600" : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"}`}>
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        ) : (
          <button onClick={() => setIsAuthModalOpen(true)} className="flex flex-col items-center p-2 w-16 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            <span className="text-[10px] font-bold">Login</span>
          </button>
        )}
      </nav>

      {/* AUTHENTICATION MODAL */}
      <LoginModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* DYNAMIC PAGE CONTENT INJECTED HERE */}
      <main className="flex-grow pb-20 md:pb-0"> {/* Extra bottom padding added for mobile nav */}
        <Outlet />
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="bg-gray-900 dark:bg-black text-white pt-12 pb-24 md:pb-8 border-t border-gray-800 transition-colors duration-300 text-center md:text-left">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:grid md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-12">
          <div className="md:col-span-2 space-y-4 flex flex-col items-center md:items-start">
            <h2 className="text-3xl font-extrabold mb-4">BHARAT<span className="text-blue-500">TRIP</span></h2>
            <p className="text-gray-400 max-w-md text-sm md:text-base px-4 md:px-0">Your trusted partner for exploring the incredible landscapes, vibrant cultures, and hidden gems of India.</p>
          </div>
          <div className="w-full">
            <h4 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-100">Quick Links</h4>
            <ul className="text-gray-400 flex flex-wrap justify-center md:flex-col md:items-start gap-x-4 gap-y-2 md:space-y-2 text-sm md:text-base">
              <li><button onClick={() => navigate("/")} className="hover:text-white transition py-1 md:py-0">Home</button></li>
              <li><button onClick={() => navigate("/packages")} className="hover:text-white transition py-1 md:py-0">Tour Packages</button></li>
              <li><button onClick={() => navigate("/about")} className="hover:text-white transition py-1 md:py-0">About Us</button></li>
              <li><button onClick={() => navigate("/contact")} className="hover:text-white transition py-1 md:py-0">Contact Us</button></li>
            </ul>
          </div>
          <div className="w-full">
            <h4 className="text-base md:text-lg font-bold mb-3 md:mb-4 text-gray-100">Contact Info</h4>
            <ul className="text-gray-400 flex flex-wrap justify-center md:flex-col md:items-start gap-x-4 gap-y-2 md:space-y-2 text-sm md:text-base">
              <li>📞 +91 98765 43210</li>
              <li>✉️ info@bharattrip.com</li>
              <li>📍 New Delhi, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="max-w-7xl mx-auto px-6 md:px-12 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} BharatTrip. All rights reserved.</p>
            <p className="mt-2 text-gray-400">Designed & Built by <span className="font-bold text-blue-500">Rohan Tiwari</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;