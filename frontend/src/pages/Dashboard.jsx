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

  const [selectedProject, setSelectedProject] =
    useState("");

  const [assignedMember, setAssignedMember] =
    useState("");

  const [taskStatus, setTaskStatus] =
    useState("Pending");

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
      console.log(error);
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
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  // CREATE PROJECT
  const createProject = async () => {
    if (!title || !description) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/projects`,
        {
          title,
          description,
        }
      );

      setProjects([res.data, ...projects]);

      setTitle("");
      setDescription("");

      alert("Project created");
    } catch (error) {
      console.log(error);

      alert("Project creation failed");
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

      alert("Project deleted");
    } catch (error) {
      console.log(error);

      alert("Delete failed");
    }
  };

  // CREATE TASK
  const createTask = async () => {
    if (!taskTitle) {
      alert("Enter task title");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/tasks`,
        {
          title: taskTitle,
          description: taskDescription,
          project: selectedProject,
          assignedTo: assignedMember,
          status: taskStatus,
          priority,
          dueDate,
        }
      );

      setTasks([res.data, ...tasks]);

      setTaskTitle("");
      setTaskDescription("");
      setSelectedProject("");
      setAssignedMember("");
      setTaskStatus("Pending");
      setPriority("Medium");
      setDueDate("");

      alert("Task created");
    } catch (error) {
      console.log(error);

      alert("Task creation failed");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `${API_URL}/api/tasks/${id}`
      );

      setTasks(
        tasks.filter((task) => task._id !== id)
      );

      alert("Task deleted");
    } catch (error) {
      console.log(error);

      alert("Delete failed");
    }
  };

  // UPDATE TASK STATUS
  const updateTaskStatus = async (
    id,
    newStatus
  ) => {
    try {
      const res = await axios.put(
        `${API_URL}/api/tasks/${id}`,
        {
          status: newStatus,
        }
      );

      setTasks(
        tasks.map((task) =>
          task._id === id ? res.data : task
        )
      );
    } catch (error) {
      console.log(error);

      alert("Status update failed");
    }
  };

  // COUNTS
  const pendingCount = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const inProgressCount = tasks.filter(
    (task) =>
      task.status === "In Progress"
  ).length;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Team Task Dashboard</h1>

      <h2>Welcome Admin (Admin)</h2>

      <button>Logout</button>

      <hr />

      <h3>Pending Tasks: {pendingCount}</h3>

      <h3>
        Completed Tasks: {completedCount}
      </h3>

      <h3>
        In Progress Tasks: {inProgressCount}
      </h3>

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
            onClick={() =>
              deleteProject(project._id)
            }
          >
            Delete
          </button>
        </div>
      ))}

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
            setTaskDescription(
              e.target.value
            )
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
          <h2>{task.title}</h2>

          <p>
            Description: {task.description}
          </p>

          <p>Status: {task.status}</p>

          <p>Priority: {task.priority}</p>

          <p>
            Assigned To: {task.assignedTo}
          </p>

          <select
            value={task.status}
            onChange={(e) =>
              updateTaskStatus(
                task._id,
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

          <button
            onClick={() =>
              deleteTask(task._id)
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;