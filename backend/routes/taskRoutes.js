const express = require("express");
const router = express.Router();

const Task = require("../models/Task");

// CREATE TASK
router.post("/", async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      project: req.body.project,
      assignedTo: req.body.assignedTo,
      status: req.body.status,
      priority: req.body.priority,
      dueDate: req.body.dueDate,
    });

    await newTask.save();

    res.status(201).json(newTask);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ALL TASKS
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("project")
      .sort({ createdAt: -1 });

    res.json(tasks);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// GET SINGLE TASK
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findById(
      req.params.id
    ).populate("project");

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(task);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// UPDATE TASK
router.put("/:id", async (req, res) => {
  try {
    const updatedTask =
      await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    if (!updatedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json(updatedTask);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    const deletedTask =
      await Task.findByIdAndDelete(
        req.params.id
      );

    if (!deletedTask) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;