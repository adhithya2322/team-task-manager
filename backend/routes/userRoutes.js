const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

router.get("/members", protect, adminOnly, async (req, res) => {
  try {
    const members = await User.find({ role: "Member" }).select("name email role").sort({ name: 1 });
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
