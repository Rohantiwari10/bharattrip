import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Packages() {
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    const res = await fetch("http://localhost:5000/packages");
    const data = await res.json();
    setPackages(data);
  };

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold text-center mb-8">
        All Packages
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((p) => (
          <div key={p._id} className="bg-white p-4 shadow rounded">
            <img src={p.image} className="h-40 w-full object-cover" />
            <h3>{p.title}</h3>
            <p>₹{p.price}</p>

            <button
              onClick={() => navigate(`/packages/${p._id}`)}
              className="mt-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Packages;