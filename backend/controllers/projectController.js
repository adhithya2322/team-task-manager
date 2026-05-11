const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const project = await Project.create({
      name,
      description,
    });

    res.status(201).json(project);

  } catch (error) {
    console.log("CREATE PROJECT ERROR:", error);

    res.status(500).json({
      message: "Project creation failed",
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    res.status(200).json(projects);

  } catch (error) {
    console.log("GET PROJECTS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch projects",
    });
  }
};

module.exports = {
  createProject,
  getProjects,
};