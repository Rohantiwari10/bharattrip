import { useState, useEffect } from "react";

function App() {
  const [packages, setPackages] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");

  // Fetch packages
  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const res = await fetch("http://localhost:5000/packages");
    const data = await res.json();
    setPackages(data);
  };

  // Add package
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
    fetchPackages(); // refresh without reload
  };

  return (
    <div className="bg-gray-100 min-h-screen">

      {/* 🔥 NAVBAR */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">BharatTrip</h1>
        <div className="space-x-6">
          <button className="hover:text-blue-400">Home</button>
          <button className="hover:text-blue-400">Packages</button>
          <button className="hover:text-blue-400">Login</button>
        </div>
      </nav>

      {/* 🔥 MAIN CONTENT */}
      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Explore Travel Packages
        </h1>

        {/* 🔍 SEARCH */}
        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search packages..."
            className="p-2 border rounded w-1/3"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* ➕ ADD PACKAGE FORM */}
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

        {/* 📦 PACKAGE CARDS */}
        <div className="grid md:grid-cols-3 gap-6">
          {packages
            .filter((p) =>
              p.title.toLowerCase().includes(search.toLowerCase())
            )
            .map((p, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition"
              >
                <img
                  src="https://source.unsplash.com/400x250/?travel"
                  className="rounded-lg mb-3"
                />

                <h2 className="text-lg font-semibold">{p.title}</h2>
                <p className="text-gray-500">₹{p.price}</p>

                <button className="mt-3 bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  View Details
                </button>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;