const express = require("express");

const router = express.Router();

const Project = require("../models/Project");

const {
  protect,
} = require("../middleware/authMiddleware");

// GET PROJECTS
router.get("/", protect, async (req, res) => {
  try {
    const projects = await Project.find();

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
});

// CREATE PROJECT
router.post("/", protect, async (req, res) => {
  try {
    const project = await Project.create({
      name: req.body.name,
      description: req.body.description,
    });

    res.status(201).json(project);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Project creation failed",
    });
  }
});

// DELETE PROJECT
router.delete(
  "/:id",
  protect,
  async (req, res) => {
    try {
      await Project.findByIdAndDelete(
        req.params.id
      );

      res.json({
        message: "Project deleted",
      });
    } catch (error) {
      res.status(500).json({
        message: "Delete failed",
      });
    }
  }
);

module.exports = router;