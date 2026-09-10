const express = require("express");
const mongoose = require("mongoose");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();
const validId = (id) => mongoose.Types.ObjectId.isValid(id);

async function memberEmails(emails = []) {
  const cleaned = [...new Set(emails.map((email) => email.trim().toLowerCase()).filter(Boolean))];
  for (const email of cleaned) {
    const member = await User.findOne({ email });
    if (!member || member.role !== "Member") throw new Error("Member not found");
  }
  return cleaned;
}

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, assignedMembers = [] } = req.body;
    if (!title?.trim() || !description?.trim()) return res.status(400).json({ message: "Title and description are required" });
    const project = await Project.create({ title: title.trim(), description: description.trim(), assignedMembers: await memberEmails(assignedMembers) });
    res.status(201).json(project);
  } catch (error) { res.status(400).json({ message: error.message || "Project creation failed" }); }
});

router.get("/", protect, async (req, res) => {
  try {
    const filter = req.user.role === "Admin" ? {} : { assignedMembers: req.user.email };
    res.json(await Project.find(filter).sort({ createdAt: -1 }));
  } catch { res.status(500).json({ message: "Failed to fetch projects" }); }
});

router.get("/:id", protect, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid project ID" });
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  if (req.user.role !== "Admin" && !project.assignedMembers.includes(req.user.email)) return res.status(403).json({ message: "You are not authorized" });
  res.json(project);
});

router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid project ID" });
    const { title, description, assignedMembers } = req.body, update = {};
    if (title !== undefined) update.title = title.trim();
    if (description !== undefined) update.description = description.trim();
    if (assignedMembers !== undefined) update.assignedMembers = await memberEmails(assignedMembers);
    const project = await Project.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (error) { res.status(400).json({ message: error.message || "Project update failed" }); }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid project ID" });
  const project = await Project.findByIdAndDelete(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  await Task.deleteMany({ project: project.title });
  res.json({ message: "Project deleted successfully" });
});

module.exports = router;
