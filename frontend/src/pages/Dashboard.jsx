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

      if (user.role === "Member") {
        const filteredTasks = res.data.filter(
          (task) => task.assignedTo === user.email
        );

        setTasks(filteredTasks);
      } else {
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
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-2xl shadow-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">
              Team Task Dashboard
            </h1>

            <h2 className="text-lg mt-2">
              Welcome {user?.name} ({user?.role})
            </h2>
          </div>

          <button
            onClick={handleLogout}
            className="bg-white text-black px-5 py-2 rounded-lg font-semibold hover:bg-gray-200"
          >
            Logout
          </button>
        </div>
      </div>

      {/* COUNTS */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-yellow-400 p-5 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold">{pendingCount}</h2>
          <p className="font-semibold">Pending Tasks</p>
        </div>

        <div className="bg-green-500 text-white p-5 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold">{completedCount}</h2>
          <p className="font-semibold">Completed Tasks</p>
        </div>

        <div className="bg-blue-500 text-white p-5 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold">{progressCount}</h2>
          <p className="font-semibold">In Progress</p>
        </div>

        <div className="bg-red-500 text-white p-5 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold">{overdueCount}</h2>
          <p className="font-semibold">Overdue Tasks</p>
        </div>
      </div>

      {/* ADMIN ONLY PROJECT SECTION */}

      {user.role === "Admin" && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h1 className="text-3xl font-bold mb-5">
            Create Project
          </h1>

          <form
            onSubmit={handleCreateProject}
            className="space-y-4"
          >
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
              className="w-full border p-3 rounded-lg"
            />

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
              className="w-full border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
            >
              Create Project
            </button>
          </form>
        </div>
      )}

      {/* PROJECTS */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-5">Projects</h1>

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-white p-5 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold">
                {project.title}
              </h2>

              <p className="text-gray-600 mt-2">
                {project.description}
              </p>

              {user.role === "Admin" && (
                <button
                  onClick={() =>
                    handleDeleteProject(project._id)
                  }
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ADMIN ONLY TASK SECTION */}

      {user.role === "Admin" && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
          <h1 className="text-3xl font-bold mb-5">
            Create Task
          </h1>

          <form
            onSubmit={handleCreateTask}
            className="space-y-4"
          >
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
              className="w-full border p-3 rounded-lg"
            />

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
              className="w-full border p-3 rounded-lg"
            />

            <select
              value={taskData.project}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  project: e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
            >
              <option value="">Select Project</option>

              {projects.map((project) => (
                <option
                  key={project._id}
                  value={project.title}
                >
                  {project.title}
                </option>
              ))}
            </select>

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
              className="w-full border p-3 rounded-lg"
            />

            <select
              value={taskData.status}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  status: e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">
                In Progress
              </option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={taskData.priority}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  priority: e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <input
              type="date"
              value={taskData.dueDate}
              onChange={(e) =>
                setTaskData({
                  ...taskData,
                  dueDate: e.target.value,
                })
              }
              className="w-full border p-3 rounded-lg"
            />

            <button
              type="submit"
              className="bg-purple-600 text-white px-5 py-3 rounded-lg hover:bg-purple-700"
            >
              Add Task
            </button>
          </form>
        </div>
      )}

      {/* TASKS */}

      <div>
        <h1 className="text-3xl font-bold mb-5">Tasks</h1>

        <div className="grid md:grid-cols-2 gap-5">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-5 rounded-2xl shadow-lg"
            >
              <h2 className="text-2xl font-bold">
                {task.title}
              </h2>

              <p className="mt-3">
                <span className="font-semibold">
                  Description:
                </span>{" "}
                {task.description}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Status:
                </span>{" "}
                {task.status}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Priority:
                </span>{" "}
                {task.priority}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Assigned To:
                </span>{" "}
                {task.assignedTo}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Project:
                </span>{" "}
                {task.project}
              </p>

              <p className="mt-2">
                <span className="font-semibold">
                  Due Date:
                </span>{" "}
                {task.dueDate
                  ? new Date(
                      task.dueDate
                    ).toLocaleDateString()
                  : "No Date"}
              </p>

              <select
                value={task.status}
                onChange={(e) =>
                  handleStatusChange(
                    task._id,
                    e.target.value
                  )
                }
                className="border p-2 rounded-lg mt-4"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Completed">
                  Completed
                </option>
              </select>

              {user.role === "Admin" && (
                <button
                  onClick={() =>
                    handleDeleteTask(task._id)
                  }
                  className="ml-3 mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;