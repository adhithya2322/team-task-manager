import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [project, setProject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // FETCH TASKS
  const fetchTasks = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        "http://localhost:5000/api/tasks"
      );

      setTasks(response.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ADD TASK
  const addTask = async () => {
    if (
      !title ||
      !project ||
      !assignedTo ||
      !dueDate
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        {
          title,
          project,
          assignedTo,
          dueDate,
        }
      );

      alert("Task Added");

      setTitle("");
      setProject("");
      setAssignedTo("");
      setDueDate("");

      fetchTasks();
    } catch (error) {
      console.log(error);
      alert("Task creation failed");
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/tasks/${id}`
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // UPDATE STATUS
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/tasks/${id}`,
        {
          status,
        }
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  // COUNTS
  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  );

  const pendingTasks = tasks.filter(
    (task) => task.status === "Pending"
  );

  const progressTasks = tasks.filter(
    (task) => task.status === "In Progress"
  );

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <div
      style={{
        background: "#041138",
        minHeight: "100vh",
        color: "white",
        padding: "40px",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1>Team Task Dashboard</h1>

          <h3>
            Role: {user?.role}
          </h3>
        </div>

        <button
          onClick={logout}
          style={{
            background: "crimson",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>

      {/* CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <div className="card">
          <h1>{tasks.length}</h1>
          <h2>Total Tasks</h2>
        </div>

        <div className="card">
          <h1>
            {completedTasks.length}
          </h1>
          <h2>Completed</h2>
        </div>

        <div className="card">
          <h1>{pendingTasks.length}</h1>
          <h2>Pending</h2>
        </div>

        <div className="card">
          <h1>{progressTasks.length}</h1>
          <h2>In Progress</h2>
        </div>
      </div>

      {/* ADD TASK */}
      {user?.role === "Admin" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(5,1fr)",
            gap: "10px",
            marginTop: "30px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Task"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            className="input"
          />

          <input
            type="text"
            placeholder="Project Name"
            value={project}
            onChange={(e) =>
              setProject(e.target.value)
            }
            className="input"
          />

          <input
            type="text"
            placeholder="Assign To"
            value={assignedTo}
            onChange={(e) =>
              setAssignedTo(e.target.value)
            }
            className="input"
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(e.target.value)
            }
            className="input"
          />

          <button
            onClick={addTask}
            style={{
              background: "green",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Add Task
          </button>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <h2 style={{ marginTop: "20px" }}>
          Loading...
        </h2>
      )}

      {/* TASKS */}
      <div style={{ marginTop: "30px" }}>
        {tasks.map((task) => (
          <div
            key={task._id}
            style={{
              background: "#1b2a4a",
              padding: "20px",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <h2>{task.title}</h2>

            <p>
              Project: {task.project}
            </p>

            <p>
              Status: {task.status}
            </p>

            <p>
              Assigned To:{" "}
              {task.assignedTo}
            </p>

            <p>
              Due Date:{" "}
              {new Date(
                task.dueDate
              ).toLocaleDateString()}
            </p>

            {/* OVERDUE */}
            {new Date(task.dueDate) <
              new Date() &&
              task.status !==
                "Completed" && (
                <p
                  style={{
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  Overdue
                </p>
              )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "10px",
              }}
            >
              <select
                value={task.status}
                onChange={(e) =>
                  updateStatus(
                    task._id,
                    e.target.value
                  )
                }
                style={{
                  padding: "10px",
                  borderRadius: "6px",
                }}
              >
                <option>
                  Pending
                </option>

                <option>
                  In Progress
                </option>

                <option>
                  Completed
                </option>
              </select>

              <button
                onClick={() =>
                  deleteTask(task._id)
                }
                style={{
                  background: "crimson",
                  color: "white",
                  border: "none",
                  padding: "10px 15px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CSS */}
      <style>{`
        .card{
          background:#1b2a4a;
          padding:30px;
          border-radius:10px;
          text-align:center;
        }

        .input{
          padding:12px;
          border:none;
          border-radius:6px;
          width:100%;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;