require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas connected"))
  .catch(err => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" } // 'user' or 'admin'
});
const User = mongoose.model("User", userSchema);

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

// --- AUTHENTICATION ROUTES ---

// Register User
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });
    
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Login User
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate Token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || "bharattrip_secret_key", { expiresIn: "1d" });
    
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});