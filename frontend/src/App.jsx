import { useState, useEffect } from "react";

function App() {
  const [packages, setPackages] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  // fetch packages
  useEffect(() => {
    fetch("http://localhost:5000/packages")
      .then(res => res.json())
      .then(data => setPackages(data));
  }, []);

  // add package
  const addPackage = async () => {
    await fetch("http://localhost:5000/packages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, price })
    });

    alert("Package Added");
    window.location.reload();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>BharatTrip Packages</h1>

      {/* FORM */}
      <input
        placeholder="Package Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={addPackage}>Add Package</button>

      <hr />

      {/* DISPLAY */}
      {packages.map((p, i) => (
        <div key={i}>
          <h3>{p.title}</h3>
          <p>₹{p.price}</p>
        </div>
      ))}
    </div>
  );
}

export default App;