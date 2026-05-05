import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function App() {
  const [packages, setPackages] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const res = await fetch("http://localhost:5000/packages");
    const data = await res.json();
    setPackages(data);
  };

  const addPackage = async () => {
    if (!title || !price) {
      alert("Please fill all fields");
      return;
    }

    await fetch("http://localhost:5000/packages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, price }),
    });

    setTitle("");
    setPrice("");
    fetchPackages();
  };

  // 🔥 Scroll function
  const scrollToPackages = () => {
    document
      .getElementById("packages-section")
      .scrollIntoView({ behavior: "smooth" });
  };

  // 🔥 Images
  const imageMap = {
    "Goa Trip":
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    "Manali Trip":
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
  };

  return (
    <div className="bg-gradient-to-b from-gray-100 to-gray-200 min-h-screen">

      {/* NAVBAR */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between">
        <h1 className="text-xl font-bold">BharatTrip</h1>
        <div className="space-x-6">
          <button className="hover:text-blue-400 transition">Home</button>
          <button
            onClick={scrollToPackages}
            className="hover:text-blue-400 transition"
          >
            Packages
          </button>
          <button className="hover:text-blue-400 transition">Login</button>
        </div>
      </nav>

      {/* HERO */}
      <div
        className="h-[60vh] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-black/70 p-10 rounded-xl text-center shadow-lg"
        >
          <h1 className="text-4xl font-bold">
            Explore India with BharatTrip
          </h1>
          <p className="mt-2">
            Best travel packages at affordable prices
          </p>

          <button
            onClick={scrollToPackages}
            className="mt-4 bg-blue-500 px-5 py-2 rounded hover:bg-blue-600 transition"
          >
            Explore Packages
          </button>
        </motion.div>
      </div>

      {/* MAIN */}
      <div id="packages-section" className="p-6">

        {/* SEARCH */}
        <div className="flex justify-center mb-6 mt-6">
          <input
            type="text"
            placeholder="Search packages..."
            className="p-2 border rounded w-1/3"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ADD PACKAGE */}
        <div className="flex gap-3 justify-center mb-8">
          <input
            className="p-2 border rounded"
            placeholder="Package Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="p-2 border rounded"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <button
            onClick={addPackage}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Package
          </button>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          Popular Packages
        </h2>

        {/* CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {packages
            .filter((p) =>
              p.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white p-4 rounded-xl shadow"
              >
                <img
                  src={
                    imageMap[p.title] ||
                    "https://images.unsplash.com/photo-1469474968028-56623f02e42e"
                  }
                  className="rounded-lg mb-3"
                />

                <h2 className="text-lg font-semibold">{p.title}</h2>
                <p className="text-gray-500">₹{p.price}</p>

                <button
                  onClick={() => alert(`Viewing ${p.title}`)}
                  className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  View Details
                </button>
              </motion.div>
            ))}
        </div>

        {/* WHY CHOOSE US */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
              <h3 className="font-semibold">Best Prices</h3>
              <p className="text-gray-500">Affordable travel deals</p>
            </div>

            <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
              <h3 className="font-semibold">Trusted Agency</h3>
              <p className="text-gray-500">1000+ happy customers</p>
            </div>

            <div className="bg-white p-4 rounded shadow hover:shadow-lg transition">
              <h3 className="font-semibold">24/7 Support</h3>
              <p className="text-gray-500">Always here to help</p>
            </div>
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