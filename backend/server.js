const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔗 MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.log(err));

// 📦 Package Model
const packageSchema = new mongoose.Schema({
  title: String,
  price: Number
});

const Package = mongoose.model("Package", packageSchema);

// 🧪 Test route
app.get("/", (req, res) => {
  res.send("Backend working");
});

// ➕ Add data (temporary API)
app.get("/add", async (req, res) => {
  await Package.create({ title: "Goa Trip", price: 10000 });
  await Package.create({ title: "Manali Trip", price: 8000 });

  res.send("Data added successfully");
});

// 📥 Get all packages
app.get("/packages", async (req, res) => {
  const data = await Package.find();
  res.json(data);
});

// 🚀 Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});