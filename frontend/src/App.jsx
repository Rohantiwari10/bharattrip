import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/packages")
      .then(res => setPackages(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>BharatTrip Packages</h1>

      {packages.map((p, i) => (
        <div key={i} style={{ border: "1px solid black", margin: "10px", padding: "10px" }}>
          <h3>{p.title}</h3>
          <p>Price: ₹{p.price}</p>
        </div>
      ))}
    </div>
  );
}

export default App;