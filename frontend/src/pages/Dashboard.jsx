import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProjects,
  createProject,
  deleteProject,
} from "../services/projectService";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTaskStatus,
} from "../services/taskService";

const Dashboard = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
  });

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    project: "",
    assignedTo: "",
    status: "Pending",
    priority: "Medium",
    dueDate: "",
  });

  // ================= FETCH PROJECTS =================

  const fetchProjects = async () => {
    try {
      const res = await getProjects();
      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= FETCH TASKS =================

  const fetchTasks = async () => {
    try {
      const res = await getTasks();

      // MEMBER -> ONLY ASSIGNED TASKS
      if (user.role === "Member") {
        const filteredTasks = res.data.filter(
          (task) => task.assignedTo === user.email
        );

        setTasks(filteredTasks);
      } else {
        // ADMIN -> ALL TASKS
        setTasks(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, []);

  // ================= LOGOUT =================

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ================= CREATE PROJECT =================

  const handleCreateProject = async (e) => {
    e.preventDefault();

    try {
      await createProject(projectData);

      setProjectData({
        title: "",
        description: "",
      });

      fetchProjects();

      alert("Project created successfully");
    } catch (error) {
      console.log(error);
      alert("Project creation failed");
    }
  };

  // ================= DELETE PROJECT =================

  const handleDeleteProject = async (id) => {
    try {
      await deleteProject(id);
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= CREATE TASK =================

  const handleCreateTask = async (e) => {
    e.preventDefault();

    try {
      await createTask(taskData);

      setTaskData({
        title: "",
        description: "",
        project: "",
        assignedTo: "",
        status: "Pending",
        priority: "Medium",
        dueDate: "",
      });

      fetchTasks();

      alert("Task created successfully");
    } catch (error) {
      console.log(error);
      alert("Task creation failed");
    }
  };

  // ================= DELETE TASK =================

  const handleDeleteTask = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= UPDATE STATUS =================

  const handleStatusChange = async (id, status) => {
    try {
      await updateTaskStatus(id, status);
      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // ================= COUNTS =================

  const pendingCount = tasks.filter(
    (task) => task.status === "Pending"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const progressCount = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const overdueCount = tasks.filter((task) => {
    return (
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "Completed"
    );
  }).length;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Team Task Dashboard</h1>

      <h2>
        Welcome {user?.name} ({user?.role})
      </h2>

      <button onClick={handleLogout}>Logout</button>

      <hr />

      <h2>Pending Tasks: {pendingCount}</h2>
      <h2>Completed Tasks: {completedCount}</h2>
      <h2>In Progress Tasks: {progressCount}</h2>
      <h2>Overdue Tasks: {overdueCount}</h2>

      <hr />

      {/* ================= ADMIN ONLY PROJECT SECTION ================= */}

      {user.role === "Admin" && (
        <>
          <h1>Create Project</h1>

          <form onSubmit={handleCreateProject}>
            <input
              type="text"
              placeholder="Project Title"
              value={projectData.title}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  title: e.target.value,
                })
              }
            />

            <br />
            <br />

            <input
              type="text"
              placeholder="Project Description"
              value={projectData.description}
              onChange={(e) =>
                setProjectData({
                  ...projectData,
                  description: e.target.value,
                })
              }
            />

            <br />
            <br />

            <button type="submit">Create Project</button>
          </form>

          <hr />
        </>
      )}

      {/* ================= PROJECTS ================= */}

      <h1>Projects</h1>

      {projects.map((project) => (
        <div
          key={project._id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
          }}
        >
          <h2>{project.title}</h2>

          <p>{project.description}</p>

          {user.role === "Admin" && (
            <button onClick={() => handleDeleteProject(project._id)}>
              Delete
            </button>
          )}
        </div>
      ))}

      <hr />

      {/* ================= ADMIN ONLY TASK SECTION ================= */}

      {user.role === "Admin" && (
        <>
          <h1>Create Task</h1>

          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Task Title"
              value={taskData.title}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  title: e.target.value,
                })
              }
            />

            <br />
            <br />

            <input
              type="text"
              placeholder="Description"
              value={taskData.description}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  description: e.target.value,
                })
              }
            />

            <br />
            <br />

            <select
              value={taskData.project}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  project: e.target.value,
                })
              }
            >
              <option value="">Select Project</option>

              {projects.map((project) => (
                <option key={project._id} value={project.title}>
                  {project.title}
                </option>
              ))}
            </select>

            <br />
            <br />

            <input
              type="text"
              placeholder="Assign Member Email"
              value={taskData.assignedTo}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  assignedTo: e.target.value,
                })
              }
            />

            <br />
            <br />

            <select
              value={taskData.status}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  status: e.target.value,
                })
              }
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>

            <br />
            <br />

            <select
              value={taskData.priority}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  priority: e.target.value,
                })
              }
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <br />
            <br />

            <input
              type="date"
              value={taskData.dueDate}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  dueDate: e.target.value,
                })
              }
            />

            <br />
            <br />

            <button type="submit">Add Task</button>
          </form>

          <hr />
        </>
      )}

      {/* ================= TASKS ================= */}

      <h1>Tasks</h1>

      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: "1px solid gray",
            margin: "10px",
            padding: "10px",
          }}
        >
          <h2>{task.title}</h2>

          <p>Description: {task.description}</p>

          <p>Status: {task.status}</p>

          <p>Priority: {task.priority}</p>

          <p>Assigned To: {task.assignedTo}</p>

          <p>Project: {task.project}</p>

          <p>
            Due Date:{" "}
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No Date"}
          </p>

          {/* STATUS UPDATE FOR BOTH ADMIN & MEMBER */}

          <select
            value={task.status}
            onChange={(e) =>
              handleStatusChange(task._id, e.target.value)
            }
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <br />
          <br />

          {/* DELETE ONLY FOR ADMIN */}

          {user.role === "Admin" && (
            <button onClick={() => handleDeleteTask(task._id)}>
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;