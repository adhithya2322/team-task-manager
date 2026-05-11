import API from "./api";

// GET PROJECTS
export const getProjects = async () => {
  return await API.get("/projects");
};

// CREATE PROJECT
export const createProject = async (projectData) => {
  return await API.post("/projects", projectData);
};

// DELETE PROJECT
export const deleteProject = async (id) => {
  return await API.delete(`/projects/${id}`);
};