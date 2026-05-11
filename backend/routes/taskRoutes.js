const express = require("express");

const router = express.Router();

const Task = require("../models/Task");

const {
  protect,
} = require("../middleware/authMiddleware");

// GET TASKS
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find();

    res.json(tasks);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

// CREATE TASK
router.post("/", protect, async (req, res) => {
  try {
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      project: req.body.project,
      assignedTo: req.body.assignedTo,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
    });

    res.status(201).json(task);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Task creation failed",
    });
  }
});

// DELETE TASK
router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      await Task.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Task deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: "Delete failed",
      });
    }
  }
);

module.exports = router;