const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();
const validId = (id) => mongoose.Types.ObjectId.isValid(id);
async function memberEmail(email) { const user = await User.findOne({ email: email?.trim().toLowerCase(), role: "Member" }); if (!user) throw new Error("Member not found"); return user.email; }
async function projectTitle(id) { if (!validId(id)) throw new Error("Project not found"); const project = await Project.findById(id); if (!project) throw new Error("Project not found"); return project.title; }

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description = "", project, assignedTo, status = "Pending", priority = "Medium", dueDate } = req.body;
    if (!title?.trim() || !project || !assignedTo || !dueDate) return res.status(400).json({ message: "Title, project, assignee and due date are required" });
    const task = await Task.create({ title: title.trim(), description: description.trim(), project: await projectTitle(project), assignedTo: await memberEmail(assignedTo), status, priority, dueDate });
    res.status(201).json(task);
  } catch (error) { res.status(400).json({ message: error.message || "Task creation failed" }); }
});
router.get("/", protect, async (req, res) => { try { res.json(await Task.find(req.user.role === "Admin" ? {} : { assignedTo: req.user.email }).sort({ createdAt: -1 })); } catch { res.status(500).json({ message: "Failed to fetch tasks" }); } });
router.get("/:id", protect, async (req, res) => { if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid task ID" }); const task = await Task.findById(req.params.id); if (!task) return res.status(404).json({ message: "Task not found" }); if (req.user.role !== "Admin" && task.assignedTo !== req.user.email) return res.status(403).json({ message: "You are not authorized" }); res.json(task); });
router.put("/:id", protect, async (req, res) => {
  try {
    if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid task ID" });
    const existing = await Task.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Task not found" });
    if (req.user.role !== "Admin") {
      if (existing.assignedTo !== req.user.email || !req.body.status || Object.keys(req.body).some((key) => key !== "status")) return res.status(403).json({ message: "Members may only update their task status" });
      existing.status = req.body.status; await existing.save(); return res.json(existing);
    }
    const update = { ...req.body };
    if (update.assignedTo !== undefined) update.assignedTo = await memberEmail(update.assignedTo);
    if (update.project !== undefined) update.project = await projectTitle(update.project);
    const task = await Task.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    res.json(task);
  } catch (error) { res.status(400).json({ message: error.message || "Task update failed" }); }
});
router.delete("/:id", protect, adminOnly, async (req, res) => { if (!validId(req.params.id)) return res.status(400).json({ message: "Invalid task ID" }); const task = await Task.findByIdAndDelete(req.params.id); if (!task) return res.status(404).json({ message: "Task not found" }); res.json({ message: "Task deleted successfully" }); });
module.exports = router;
