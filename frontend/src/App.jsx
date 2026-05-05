import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function App() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const res = await fetch("http://localhost:5000/packages");
    const data = await res.json();
    setPackages(data);
  };

  const scrollToPackages = () => {
    document.getElementById("packages").scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">
      {/* NAVBAR */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">BharatTrip</h1>

        <div className="space-x-6">
          <button className="hover:text-blue-400">Home</button>
          <button onClick={scrollToPackages} className="hover:text-blue-400">
            Packages
          </button>
          <button className="hover:text-blue-400">Login</button>
        </div>
      </nav>

      {/* HERO */}
      <div
        className="h-[70vh] bg-cover bg-center relative flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/goa.jpg')",
        }}
      >
        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/50"></div>

        {/* CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center text-white px-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Explore India with BharatTrip
          </h1>

          <p className="mt-3 text-lg">
            Best travel packages at affordable prices
          </p>

          <button
            onClick={scrollToPackages}
            className="mt-5 bg-blue-500 px-6 py-3 rounded-lg hover:bg-blue-600 transition"
          >
            Explore Packages
          </button>
        </motion.div>
      </div>

      {/* PACKAGES */}
      <div id="packages" className="p-8">
        <h2 className="text-3xl font-bold text-center mb-10">
          Popular Packages
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((p, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl"
            >
              <img
                src={p.image}
                alt={p.title}
                className="h-48 w-full object-cover"
              />

              <div className="p-4">
                <h2 className="text-lg font-semibold">{p.title}</h2>

                <p className="text-gray-500 font-medium">₹{p.price}</p>

                <p className="text-sm text-gray-400">Explore India Tour</p>

                <button
                  onClick={() => alert(`Viewing ${p.title}`)}
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* WHY CHOOSE US */}
      <div className="mt-16 text-center p-8">
        <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Best Prices</h3>
            <p className="text-gray-500">Affordable travel deals</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">Trusted Agency</h3>
            <p className="text-gray-500">1000+ happy customers</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">24/7 Support</h3>
            <p className="text-gray-500">Always here to help</p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white text-center p-4 mt-10">
        © 2026 BharatTrip. All rights reserved.
      </footer>
    </div>
  );
}

export default App;
