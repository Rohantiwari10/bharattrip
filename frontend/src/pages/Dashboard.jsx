import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    if (!user || user.role !== "user") {
      navigate("/");
      return;
    }
    fetchMyBookings();
  }, [navigate, user]);

  const fetchMyBookings = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_URL}/api/bookings/user/${user.email}`);
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-32 pb-12 px-6 md:px-12 font-sans transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2">Welcome Back</h2>
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-12">{user.name}'s Dashboard</h1>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Bookings</h3>
        
        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-center">
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-lg">You don't have any bookings yet.</p>
            <button onClick={() => navigate("/packages")} className="bg-blue-600 text-white font-bold px-8 py-3 rounded-full hover:bg-blue-700 transition">Explore Destinations</button>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((b) => (
              <div key={b._id} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6 hover:shadow-md transition">
                <div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{b.packageName}</h4>
                  <div className="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <p><span className="font-semibold">Date:</span> {new Date(b.travelDate).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Guests:</span> {b.guests}</p>
                    <p><span className="font-semibold">Contact:</span> {b.phone}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mb-2">₹{b.totalPrice.toLocaleString("en-IN")}</div>
                  <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
                    {b.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;