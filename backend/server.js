require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// --- IMAGE UPLOAD CONFIGURATION ---
// Ensure uploads directory exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}
// Serve the uploads folder statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

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
  image: String,
  description: String,
  duration: String
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

// --- ADMIN PROTECTED ROUTES ---
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "bharattrip_secret_key");
    if (decoded.role !== "admin") return res.status(403).json({ message: "Not authorized. Admins only." });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Create a new package
app.post("/packages", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const packageData = { ...req.body };
    // If a file was uploaded, generate its public URL
    if (req.file) {
      packageData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    const newPackage = await Package.create(packageData);
    res.status(201).json(newPackage);
  } catch (error) {
    res.status(500).json({ message: "Error creating package", error: error.message });
  }
});

// Update a package
app.put("/packages/:id", verifyAdmin, upload.single("image"), async (req, res) => {
  try {
    const packageData = { ...req.body };
    // Only update the image if a new file was uploaded
    if (req.file) {
      packageData.image = `http://localhost:5000/uploads/${req.file.filename}`;
    }
    const updatedPackage = await Package.findByIdAndUpdate(req.params.id, packageData, { new: true });
    res.json(updatedPackage);
  } catch (error) {
    res.status(500).json({ message: "Error updating package", error: error.message });
  }
});

// Delete a package
app.delete("/packages/:id", verifyAdmin, async (req, res) => {
  try {
    await Package.findByIdAndDelete(req.params.id);
    res.json({ message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting package", error: error.message });
  }
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