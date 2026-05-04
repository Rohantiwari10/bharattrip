const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Test API
app.get("/", (req, res) => {
  res.send("Backend working");
});

// Packages API
app.get("/packages", (req, res) => {
  res.json([
    { title: "Goa Trip", price: 10000 },
    { title: "Manali Trip", price: 8000 }
  ]);
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});