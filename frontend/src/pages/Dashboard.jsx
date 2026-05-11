import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://team-task-manager-production-997b.up.railway.app";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`);
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  // CREATE PROJECT
  const createProject = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/projects`, {
        title: projectTitle,
        description: projectDescription,
      });

      setProjects([res.data, ...projects]);

      setProjectTitle("");
      setProjectDescription("");

      alert("Project Created");
    } catch (error) {
      console.log(error);
      alert("Project creation failed");
    }
  };

  // DELETE PROJECT
  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`);

      setProjects(
        projects.filter((project) => project._id !== id)
      );

      alert("Project Deleted");
    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <hr />

      <h2>Create Project</h2>

      {/* IMPORTANT FORM */}
      <form onSubmit={createProject}>
        <input
          type="text"
          placeholder="Project Title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
          required
        />

        <br />
        <br />

        <textarea
          placeholder="Project Description"
          value={projectDescription}
          onChange={(e) =>
            setProjectDescription(e.target.value)
          }
          required
        />

        <br />
        <br />

        {/* IMPORTANT */}
        <button type="submit">
          Create Project
        </button>
      </form>

      <hr />

      <h1>Projects</h1>

      {projects.map((project) => (
        <div
          key={project._id}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h2>{project.title}</h2>

          <p>{project.description}</p>

          <button
            onClick={() => deleteProject(project._id)}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;