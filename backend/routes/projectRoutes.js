const express = require("express");
const router = express.Router();

const Project = require("../models/Project");


// GET PROJECTS
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find();

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});


// CREATE PROJECT
router.post("/", async (req, res) => {
  try {
    const newProject = new Project({
      name: req.body.name,
      description: req.body.description,
    });

    const savedProject = await newProject.save();

    res.status(201).json(savedProject);
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