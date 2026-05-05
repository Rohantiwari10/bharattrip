require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.log(err));

// Schema
const packageSchema = new mongoose.Schema({
  title: String,
  price: Number,
  image: String
});

const Package = mongoose.model("Package", packageSchema);

// Test
app.get("/", (req, res) => {
  res.send("Backend working");
});

// Get all packages
app.get("/packages", async (req, res) => {
  const data = await Package.find();
  res.json(data);
});

// Seed real data
app.get("/seed", async (req, res) => {
  await Package.deleteMany({});

  const data = [
    { title: "Kerala Backwaters", price: 15000, image: "/images/kerala.jpg" },
    { title: "Somnath Darshan", price: 9000, image: "/images/somnath.jpg" },
    { title: "Mahakaleshwar Darshan", price: 7000, image: "/images/mahakaleshwar.jpg" },
    { title: "Manali Adventure Trip", price: 12000, image: "/images/manali.jpg" },
    { title: "Goa Beach Trip", price: 10000, image: "/images/goa.jpg" },
    { title: "Rishikesh River Rafting", price: 9000, image: "/images/rishikesh.jpg" },
    { title: "Vaishno Devi Yatra", price: 8000, image: "/images/vaishnodevi.jpg" },
    { title: "Chittorgarh Heritage Tour", price: 8500, image: "/images/chittorgarh.jpg" },
    { title: "Jaipur Royal Tour", price: 11000, image: "/images/jaipur.jpg" },
    { title: "Kurukshetra Spiritual Tour", price: 6000, image: "/images/kurukshetra.jpg" },
  ];

  await Package.insertMany(data);

  res.send("Seed data added");
});

// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});