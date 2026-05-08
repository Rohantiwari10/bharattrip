import React from "react";

function About() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-32 pb-12 px-6 md:px-12 font-sans transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2">Our Story</h2>
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">About BHARAT<span className="text-blue-500">TRIP</span></h1>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300 leading-relaxed space-y-6 text-lg">
          <p>
            Welcome to <strong>BharatTrip</strong>, your trusted companion for discovering the incredible landscapes, vibrant cultures, and hidden gems of India. 
          </p>
          <p>
            Founded with a deep passion for exploration, we aim to provide meticulously crafted tour packages that offer the perfect blend of adventure, comfort, and authenticity. We believe that traveling is not just about visiting places, but about collecting moments and creating memories that last a lifetime.
          </p>
          <p>
            Whether you are looking for the serene backwaters of Kerala, the spiritual aura of Rishikesh, the majestic forts of Rajasthan, or the lively beaches of Goa, our expert team ensures an unforgettable and seamless journey from start to finish.
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;