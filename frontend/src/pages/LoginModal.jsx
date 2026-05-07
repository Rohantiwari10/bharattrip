import { useState } from "react";

export default function LoginModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const url = isLogin ? "http://localhost:5000/api/auth/login" : "http://localhost:5000/api/auth/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLogin ? { email: formData.email, password: formData.password } : formData)
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (isLogin) {
        // Save the session
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        alert("Welcome back to BharatTrip!");
        onClose();
      } else {
        alert("Account created successfully! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem("user", JSON.stringify({ id: "guest", name: "Guest Explorer", role: "guest", email: "guest@bharattrip.com" }));
    alert("Continuing as Guest!");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white dark:bg-gray-900 w-full max-w-md p-8 rounded-2xl shadow-2xl relative border border-gray-100 dark:border-gray-800">
        
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900 dark:hover:text-white transition">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>

        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
          {isLogin ? "Enter your details to access your bookings." : "Join us to book your dream destination."}
        </p>

        {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-xl text-sm font-medium mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="John Doe" />
            </div>
          )}
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-1">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-extrabold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none mt-2 disabled:opacity-70">
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="border-b border-gray-200 dark:border-gray-700 w-1/5 md:w-1/4"></span>
          <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Or</span>
          <span className="border-b border-gray-200 dark:border-gray-700 w-1/5 md:w-1/4"></span>
        </div>

        <button onClick={handleGuestLogin} className="w-full mt-6 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white font-bold py-3.5 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition">
          Continue as Guest
        </button>

        <div className="mt-6 text-center text-sm font-medium text-gray-600 dark:text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => { setIsLogin(!isLogin); setError(""); }} className="text-blue-600 dark:text-blue-400 hover:underline">
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </div>
      </div>
    </div>
  );
}