import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function PackageDetails() {
  const { id } = useParams();
  const [pkg, setPkg] = useState(null);

  useEffect(() => {
    fetchPackage();
  }, []);

  const fetchPackage = async () => {
    const res = await fetch("http://localhost:5000/packages");
    const data = await res.json();

    const found = data.find((p) => p._id === id);
    setPkg(found);
  };

  if (!pkg) return <h2>Loading...</h2>;

  return (
    <div className="p-8">
      <img src={pkg.image} className="w-full h-80 object-cover" />

      <h1 className="text-3xl font-bold mt-4">{pkg.title}</h1>
      <p className="text-xl mt-2">₹{pkg.price}</p>

      <p className="mt-4 text-gray-600">
        This is a beautiful travel package. Enjoy your trip with full comfort.
      </p>

      <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded">
        Book Now
      </button>
    </div>
  );
}

export default PackageDetails;