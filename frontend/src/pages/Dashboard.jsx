import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  "https://team-task-manager-production-997b.up.railway.app";

function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  // PROJECT STATES
  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  // TASK STATES
  const [taskTitle, setTaskTitle] =
    useState("");

  const [taskDescription, setTaskDescription] =
    useState("");

  const [taskStatus, setTaskStatus] =
    useState("Pending");

  const [selectedProject, setSelectedProject] =
    useState("");

  const [assignedMember, setAssignedMember] =
    useState("");

  const [priority, setPriority] =
    useState("Medium");

  const [dueDate, setDueDate] = useState("");

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/projects`
      );

      setProjects(res.data);
    } catch (error) {
      console.log(
        "FETCH PROJECTS ERROR:",
        error
      );
    }
  };

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/tasks`
      );

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
  const createProject = async () => {
    if (!title.trim() || !description.trim()) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/projects`,
        {
          title: title,
          description: description,
        }
      );

      setProjects([
        response.data,
        ...projects,
      ]);

      setTitle("");
      setDescription("");

      alert("Project created successfully");
    } catch (error) {
      console.log(
        "CREATE PROJECT ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Project creation failed"
      );
    }
  };

  // DELETE PROJECT
  const deleteProject = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/projects/${id}`
      );

      setProjects(
        projects.filter(
          (project) => project._id !== id
        )
      );

      alert("Project deleted successfully");
    } catch (error) {
      console.log(
        "DELETE PROJECT ERROR:",
        error
      );

      alert("Delete failed");
    }
  };

  // CREATE TASK
  const createTask = async () => {
    if (!taskTitle.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/tasks`,
        {
          title: taskTitle,
          description: taskDescription,
          status: taskStatus,
          project: selectedProject,
          assignedTo: assignedMember,
          priority: priority,
          dueDate: dueDate,
        }
      );

      setTasks([
        response.data,
        ...tasks,
      ]);

      setTaskTitle("");
      setTaskDescription("");
      setTaskStatus("Pending");
      setSelectedProject("");
      setAssignedMember("");
      setPriority("Medium");
      setDueDate("");

      alert("Task created successfully");
    } catch (error) {
      console.log(
        "CREATE TASK ERROR:",
        error.response?.data || error
      );

      alert(
        error.response?.data?.message ||
          "Task creation failed"
      );
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/tasks/${id}`
      );

      setTasks(
        tasks.filter(
          (task) => task._id !== id
        )
      );

      alert("Task deleted successfully");
    } catch (error) {
      console.log(
        "DELETE TASK ERROR:",
        error
      );

      alert("Task deletion failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Team Task Dashboard</h1>

      <h2>Welcome Admin (Admin)</h2>

      <button>Logout</button>

      <hr />

      {/* CREATE PROJECT */}
      <h2>Create Project</h2>

      <div>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Project Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <br />
        <br />

        <button onClick={createProject}>
          Create Project
        </button>
      </div>

      <hr />

      {/* PROJECTS */}
      <h2>Projects</h2>

      {projects.length === 0 ? (
        <p>No projects found</p>
      ) : (
        projects.map((project) => (
          <div
            key={project._id}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{project.title}</h3>

            <p>{project.description}</p>

            <button
              onClick={() =>
                deleteProject(project._id)
              }
            >
              Delete
            </button>
          </div>
        ))
      )}

      <hr />

      {/* CREATE TASK */}
      <h2>Create Task</h2>

      <div>
        <input
          type="text"
          placeholder="Task Title"
          value={taskTitle}
          onChange={(e) =>
            setTaskTitle(e.target.value)
          }
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Description"
          value={taskDescription}
          onChange={(e) =>
            setTaskDescription(e.target.value)
          }
        />

        <br />
        <br />

        <select
          value={selectedProject}
          onChange={(e) =>
            setSelectedProject(
              e.target.value
            )
          }
        >
          <option value="">
            Select Project
          </option>

          {projects.map((project) => (
            <option
              key={project._id}
              value={project._id}
            >
              {project.title}
            </option>
          ))}
        </select>

        <br />
        <br />

        <input
          type="text"
          placeholder="Assign Member"
          value={assignedMember}
          onChange={(e) =>
            setAssignedMember(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <select
          value={taskStatus}
          onChange={(e) =>
            setTaskStatus(
              e.target.value
            )
          }
        >
          <option value="Pending">
            Pending
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Completed">
            Completed
          </option>
        </select>

        <br />
        <br />

        <select
          value={priority}
          onChange={(e) =>
            setPriority(
              e.target.value
            )
          }
        >
          <option value="Low">Low</option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">High</option>
        </select>

        <br />
        <br />

        <input
          type="date"
          value={dueDate}
          onChange={(e) =>
            setDueDate(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <button onClick={createTask}>
          Add Task
        </button>
      </div>

      <hr />

      {/* TASKS */}
      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks found</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border: "1px solid black",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{task.title}</h3>

            <p>
              Description:{" "}
              {task.description}
            </p>

            <p>Status: {task.status}</p>

            <p>
              Priority: {task.priority}
            </p>

            <button
              onClick={() =>
                deleteTask(task._id)
              }
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;