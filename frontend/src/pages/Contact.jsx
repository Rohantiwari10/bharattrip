import React, { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    try {
      // Replace this URL with your Formspree endpoint!
      const FORMSPREE_URL = "https://formspree.io/f/xlgzoeyz"; 
      const res = await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" }); // Clear the form
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Contact error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-32 pb-12 px-6 md:px-12 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2">Get in touch</h2>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white">Contact Us</h1>
        </div>

        <div className="grid md:grid-cols-5 gap-12 items-start">
          {/* CONTACT FORM */}
          <div className="md:col-span-3 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send us a message</h2>
            
            {status === "success" && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-bold text-center">
                Message sent successfully! We will get back to you soon.
              </div>
            )}
            {status === "error" && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl font-bold text-center">
                Failed to send message. Please try again later.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="john@example.com" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Message</label>
                <textarea rows="5" name="message" value={formData.message} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition" placeholder="How can we help you?"></textarea>
              </div>
              <button type="submit" disabled={status === "loading"} className="w-full bg-blue-600 text-white font-extrabold py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200 dark:shadow-none text-lg mt-2 disabled:opacity-70">
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* INFO DETAILS */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-6">Contact Information</h3>
              <div className="space-y-6 text-gray-600 dark:text-gray-400">
                <p className="flex items-center text-lg"><span className="text-2xl mr-4">📍</span> 123 Travel Plaza, Connaught Place<br/>New Delhi, India 110001</p>
                <p className="flex items-center text-lg"><span className="text-2xl mr-4">📞</span> +91 98765 43210</p>
                <p className="flex items-center text-lg"><span className="text-2xl mr-4">✉️</span> info@bharattrip.com</p>
                <p className="flex items-center text-lg"><span className="text-2xl mr-4">🕒</span> Mon - Sat: 9:00 AM - 7:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Contact;