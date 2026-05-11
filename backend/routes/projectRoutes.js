const express = require("express");
const router = express.Router();

const Project = require("../models/Project");

// CREATE PROJECT
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    const newProject = new Project({
      title,
      description,
    });

    await newProject.save();

    res.status(201).json(newProject);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

// GET ALL PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({
      createdAt: -1,
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// DELETE PROJECT
router.delete("/:id", async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Project deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;