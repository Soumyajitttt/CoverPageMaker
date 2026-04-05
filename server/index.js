const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const coverRoutes = require("./routes/coverRoutes");
app.use("/api/covers", coverRoutes);

// Health check
app.get("/", (req, res) => res.json({ message: "Project Cover API running ✅" }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    console.log("⚠️  Starting server without DB (cover generation still works)");
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  });
