import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // SAFE USER LOAD
  let user = {
    name: "User",
    role: "Admin",
  };

  try {
    const storedUser =
      localStorage.getItem("user");

    if (
      storedUser &&
      storedUser !== "undefined"
    ) {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.log("Invalid user data");

    localStorage.removeItem("user");
  }

  const token = localStorage.getItem("token");

  const API =
    "https://team-task-manager-production-997b.up.railway.app/api";

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [projectName, setProjectName] =
    useState("");

  const [
    projectDescription,
    setProjectDescription,
  ] = useState("");

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [project, setProject] =
    useState("");

  const [assignedTo, setAssignedTo] =
    useState("");

  const [status, setStatus] =
    useState("Pending");

  const [priority, setPriority] =
    useState("Medium");

  const [dueDate, setDueDate] =
    useState("");

  // AUTH CONFIG
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // FETCH PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        `${API}/projects`,
        config
      );

      console.log("Projects:", res.data);

      setProjects(res.data || []);
    } catch (error) {
      console.log(
        "PROJECT FETCH ERROR",
        error
      );
    }
  };

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `${API}/tasks`,
        config
      );

      console.log("Tasks:", res.data);

      setTasks(res.data || []);
    } catch (error) {
      console.log(
        "TASK FETCH ERROR",
        error
      );
    }
  };

  // CREATE PROJECT
  const createProject = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API}/projects`,
        {
          name: projectName,
          description: projectDescription,
        },
        config
      );

      console.log(response.data);

      alert("Project Created Successfully");

      setProjects([
        ...projects,
        response.data,
      ]);

      setProjectName("");

      setProjectDescription("");

    } catch (error) {
      console.log(
        "PROJECT ERROR:",
        error
      );

      if (error.response) {
        console.log(error.response.data);

        alert(
          error.response.data.message ||
            "Project creation failed"
        );
      } else {
        alert("Server connection failed");
      }
    }
  };

  // CREATE TASK
  const createTask = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API}/tasks`,
        {
          title,
          description,
          project,
          assignedTo,
          status,
          priority,
          dueDate,
        },
        config
      );

      console.log(response.data);

      alert("Task Created Successfully");

      setTasks([
        ...tasks,
        response.data,
      ]);

      setTitle("");
      setDescription("");
      setProject("");
      setAssignedTo("");
      setStatus("Pending");
      setPriority("Medium");
      setDueDate("");

    } catch (error) {
      console.log(
        "TASK ERROR:",
        error
      );

      if (error.response) {
        console.log(error.response.data);

        alert(
          error.response.data.message ||
            "Task creation failed"
        );
      } else {
        alert("Server connection failed");
      }
    }
  };

  // DELETE PROJECT
  const deleteProject = async (id) => {
    try {
      const response = await axios.delete(
        `${API}/projects/${id}`,
        config
      );

      console.log(response.data);

      setProjects(
        projects.filter(
          (project) =>
            project._id !== id
        )
      );

      alert(
        "Project Deleted Successfully"
      );

    } catch (error) {
      console.log(
        "DELETE PROJECT ERROR:",
        error
      );

      if (error.response) {
        console.log(error.response.data);
      }

      alert("Delete failed");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      const response = await axios.delete(
        `${API}/tasks/${id}`,
        config
      );

      console.log(response.data);

      setTasks(
        tasks.filter(
          (task) => task._id !== id
        )
      );

      alert(
        "Task Deleted Successfully"
      );

    } catch (error) {
      console.log(
        "DELETE TASK ERROR:",
        error
      );

      if (error.response) {
        console.log(error.response.data);
      }

      alert("Delete failed");
    }
  };

  // LOAD DATA
  useEffect(() => {
    if (!token) {
      navigate("/");

      return;
    }

    fetchProjects();

    fetchTasks();
  }, []);

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");

    localStorage.removeItem("token");

    navigate("/");
  };

  // ANALYTICS
  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) =>
      task.status === "Completed"
  ).length;

  const pendingTasks = tasks.filter(
    (task) =>
      task.status === "Pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status === "In Progress"
  ).length;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Team Task Dashboard</h1>

      <h2>
        Welcome {user.name} (
        {user.role})
      </h2>

      <button onClick={logout}>
        Logout
      </button>

      <hr />

      {/* CREATE PROJECT */}
      <h2>Create Project</h2>

      <form onSubmit={createProject}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) =>
            setProjectName(
              e.target.value
            )
          }
          required
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Project Description"
          value={projectDescription}
          onChange={(e) =>
            setProjectDescription(
              e.target.value
            )
          }
          required
        />

        <br />
        <br />

        <button type="submit">
          Create Project
        </button>
      </form>

      <hr />

      {/* CREATE TASK */}
      <h2>Create Task</h2>

      <form onSubmit={createTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          required
        />

        <br />
        <br />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(
              e.target.value
            )
          }
          required
        />

        <br />
        <br />

        <select
          value={project}
          onChange={(e) =>
            setProject(
              e.target.value
            )
          }
          required
        >
          <option value="">
            Select Project
          </option>

          {projects.map((proj) => (
            <option
              key={proj._id}
              value={proj.name}
            >
              {proj.name}
            </option>
          ))}
        </select>

        <br />
        <br />

        <input
          type="text"
          placeholder="Assign Member"
          value={assignedTo}
          onChange={(e) =>
            setAssignedTo(
              e.target.value
            )
          }
        />

        <br />
        <br />

        <select
          value={status}
          onChange={(e) =>
            setStatus(
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
          <option value="Low">
            Low
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="High">
            High
          </option>
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

        <button type="submit">
          Add Task
        </button>
      </form>

      <hr />

      {/* ANALYTICS */}
      <h2>Task Analytics</h2>

      <p>Total Tasks: {totalTasks}</p>

      <p>
        Completed Tasks:{" "}
        {completedTasks}
      </p>

      <p>
        Pending Tasks: {pendingTasks}
      </p>

      <p>
        In Progress Tasks:{" "}
        {inProgressTasks}
      </p>

      <hr />

      {/* PROJECTS */}
      <h2>Projects</h2>

      {projects.length === 0 ? (
        <p>No Projects Found</p>
      ) : (
        projects.map((proj) => (
          <div
            key={proj._id}
            style={{
              border:
                "1px solid black",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{proj.name}</h3>

            <p>
              {proj.description}
            </p>

            <button
              onClick={() =>
                deleteProject(
                  proj._id
                )
              }
            >
              Delete
            </button>
          </div>
        ))
      )}

      <hr />

      {/* TASKS */}
      <h2>Tasks</h2>

      {tasks.length === 0 ? (
        <p>No Tasks Found</p>
      ) : (
        tasks.map((task) => (
          <div
            key={task._id}
            style={{
              border:
                "1px solid black",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <h3>{task.title}</h3>

            <p>
              {task.description}
            </p>

            <p>
              <b>Project:</b>{" "}
              {task.project}
            </p>

            <p>
              <b>Assigned To:</b>{" "}
              {task.assignedTo ||
                "Not Assigned"}
            </p>

            <p>
              <b>Status:</b>{" "}
              {task.status}
            </p>

            <p>
              <b>Priority:</b>{" "}
              {task.priority}
            </p>

            <p>
              <b>Due Date:</b>{" "}
              {task.dueDate}
            </p>

            <button
              onClick={() =>
                deleteTask(
                  task._id
                )
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