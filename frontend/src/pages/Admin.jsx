import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({ title: "", price: "", image: "", description: "", duration: "" });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  useEffect(() => {
    // Protect the route: Kick out non-admins instantly
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      fetchPackages();
    }
  }, [navigate, user]);

  const fetchPackages = async () => {
    try {
      const res = await fetch("http://localhost:5000/packages");
      const data = await res.json();
      setPackages(data);
    } catch (err) {
      console.error("Failed to fetch packages", err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const url = editingId 
      ? `http://localhost:5000/packages/${editingId}`
      : "http://localhost:5000/packages";
      
    const method = editingId ? "PUT" : "POST";

    // We MUST use FormData instead of JSON for file uploads!
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("price", Number(formData.price));
    submitData.append("description", formData.description);
    submitData.append("duration", formData.duration);
    if (imageFile) {
      submitData.append("image", imageFile); // Attach the actual file
    }

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          "Authorization": `Bearer ${token}` // Send the admin badge!
        },
        body: submitData
      });

      if (res.ok) {
        setFormData({ title: "", price: "", image: "", description: "", duration: "" });
        setImageFile(null); // Reset the file picker
        setEditingId(null);
        fetchPackages(); // Refresh the list
      } else {
        const errData = await res.json();
        alert(errData.message);
      }
    } catch (err) {
      console.error("Action failed", err);
    }
  };

  const handleEdit = (pkg) => {
    setFormData({ 
      title: pkg.title || "", 
      price: pkg.price || "", 
      image: pkg.image || "",
      description: pkg.description || "",
      duration: pkg.duration || ""
    });
    setImageFile(null); // Clear any pending file upload
    setEditingId(pkg._id);
    window.scrollTo(0, 0); // Scroll up to the form
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this package?")) return;

    try {
      const res = await fetch(`http://localhost:5000/packages/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPackages();
      } else {
        alert("Failed to delete package.");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  if (!user || user.role !== "admin") return null; // Prevent flicker

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen pt-32 pb-12 px-6 md:px-12 font-sans transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 flex justify-between items-end">
          <div>
            <h2 className="text-blue-600 font-bold tracking-widest uppercase text-sm mb-2">Admin Dashboard</h2>
            <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">Manage Packages</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* ADD / EDIT FORM */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              {editingId ? "Update Destination" : "Add New Destination"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Title</label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Kashmir Valley" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Price (₹)</label>
                <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="15000" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Upload Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} required={!editingId} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" />
                {editingId && formData.image && !imageFile && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Current: <a href={formData.image} target="_blank" rel="noreferrer" className="text-blue-500 underline">View Image</a> (Upload to replace)</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Duration</label>
                <input type="text" name="duration" value={formData.duration} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. 5 Days / 4 Nights" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Description</label>
                <textarea rows="3" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describe the tour..."></textarea>
              </div>
              <div className="pt-4 flex gap-2">
                <button type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition">
                  {editingId ? "Save Changes" : "Create Package"}
                </button>
                {editingId && (
                  <button type="button" onClick={() => { setEditingId(null); setFormData({title: "", price: "", image: "", description: "", duration: ""}); setImageFile(null); }} className="px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition">Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* PACKAGE LIST TABLE */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            {packages.map((pkg) => (
              <div key={pkg._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col">
                <img src={pkg.image} alt={pkg.title} className="w-full h-40 object-cover" />
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-1">{pkg.title}</h3>
                    <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">₹{pkg.price.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="flex gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
                    <button onClick={() => handleEdit(pkg)} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm font-bold py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition">Edit</button>
                    <button onClick={() => handleDelete(pkg._id)} className="flex-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Admin;