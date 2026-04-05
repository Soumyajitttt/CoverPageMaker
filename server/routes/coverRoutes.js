const express = require("express");
const router = express.Router();
const CoverPage = require("../models/CoverPage");

// Save a cover page entry
router.post("/save", async (req, res) => {
  try {
    const cover = new CoverPage(req.body);
    const saved = await cover.save();
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get all saved cover pages
router.get("/all", async (req, res) => {
  try {
    const covers = await CoverPage.find().sort({ createdAt: -1 });
    res.json({ success: true, data: covers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get one by ID
router.get("/:id", async (req, res) => {
  try {
    const cover = await CoverPage.findById(req.params.id);
    if (!cover) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: cover });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Delete one by ID
router.delete("/:id", async (req, res) => {
  try {
    await CoverPage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
