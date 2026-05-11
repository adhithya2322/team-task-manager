import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://team-task-manager-production-997b.up.railway.app";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const [taskTitle, setTaskTitle] = useState("");
  const [taskStatus, setTaskStatus] = useState("Pending");

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/projects`);
      setProjects(res.data);
    } catch (error) {
      console.log("FETCH PROJECTS ERROR:", error);
    }
  };

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`);
      setTasks(res.data);
    } catch (error) {
      console.log("FETCH TASKS ERROR:", error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  
  // CREATE PROJECT
const createProject = async (e) => {
  e.preventDefault();

  if (!projectTitle || !projectDescription) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await axios.post(`${API_URL}/api/projects`, {
      title: projectTitle,
      description: projectDescription,
    });

    setProjects([res.data, ...projects]);

    setProjectTitle("");
    setProjectDescription("");

    alert("Project created successfully");
  } catch (error) {
    console.log("CREATE PROJECT ERROR:", error);
    alert("Project creation failed");
  }
};

  // DELETE PROJECT
  const deleteProject = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/projects/${id}`);

      setProjects(projects.filter((project) => project._id !== id));

      alert("Project deleted successfully");
    } catch (error) {
      console.log("DELETE PROJECT ERROR:", error);
      alert("Delete failed");
    }
  };

  // CREATE TASK
  const createTask = async (e) => {
    e.preventDefault();

    if (!taskTitle) {
      alert("Please enter task title");
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/tasks`, {
        title: taskTitle,
        status: taskStatus,
      });

      setTasks([res.data, ...tasks]);

      setTaskTitle("");
      setTaskStatus("Pending");

      alert("Task created successfully");
    } catch (error) {
      console.log("CREATE TASK ERROR:", error);
      alert("Task creation failed");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`);

      setTasks(tasks.filter((task) => task._id !== id));

      alert("Task deleted successfully");
    } catch (error) {
      console.log("DELETE TASK ERROR:", error);
      alert("Task deletion failed");
    }
  };

  // TASK COUNTS
  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <hr />

      <h3>Pending Tasks: {pendingTasks}</h3>
      <h3>Completed Tasks: {completedTasks}</h3>
      <h3>In Progress Tasks: {inProgressTasks}</h3>

      <hr />

      {/* CREATE PROJECT */}
      <h2>Create Project</h2>

      <form onSubmit={createProject}>
        <input
          type="text"
          placeholder="Project Title"
          value={projectTitle}
          onChange={(e) => setProjectTitle(e.target.value)}
        />

        <br />
        <br />

        <textarea
          placeholder="Project Description"
          value={projectDescription}
          onChange={(e) => setProjectDescription(e.target.value)}
        />

        <br />
        <br />

        <button type="submit">Create Project</button>
      </form>

      <hr />

      {/* PROJECTS */}
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

          <button onClick={() => deleteProject(project._id)}>
            Delete
          </button>
        </div>
      ))}

      <hr />

      {/* CREATE TASK */}
      <h2>Create Task</h2>

      <form onSubmit={createTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
        />

        <br />
        <br />

        <select
          value={taskStatus}
          onChange={(e) => setTaskStatus(e.target.value)}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <br />
        <br />

        <button type="submit">Create Task</button>
      </form>

      <hr />

      {/* TASKS */}
      <h1>Tasks</h1>

      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: "1px solid black",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h3>{task.title}</h3>

          <p>Status: {task.status}</p>

          <button onClick={() => deleteTask(task._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;