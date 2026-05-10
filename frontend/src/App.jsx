import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API = "http://localhost:5000/api";

  /* =========================
     STATES
  ========================= */

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("Member");

  const [task, setTask] =
    useState("");

  const [assignedTo, setAssignedTo] =
    useState("");

  const [dueDate, setDueDate] =
    useState("");

  const [tasks, setTasks] =
    useState([]);

  const [isLoggedIn, setIsLoggedIn] =
    useState(false);

  const [user, setUser] =
    useState(null);

  /* =========================
     REGISTER
  ========================= */

  const register = async () => {
    try {
      await axios.post(
        `${API}/register`,
        {
          email,
          password,
          role,
        }
      );

      alert("Register Success");
    } catch (error) {
      console.log(error);

      alert("Register Failed");
    }
  };

  /* =========================
     LOGIN
  ========================= */

  const login = async () => {
    try {
      const response =
        await axios.post(
          `${API}/login`,
          {
            email,
            password,
          }
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
      );

      setUser(response.data.user);

      setIsLoggedIn(true);

      fetchTasks();

      alert("Login Success");
    } catch (error) {
      console.log(error);

      alert("Login Failed");
    }
  };

  /* =========================
     FETCH TASKS
  ========================= */

  const fetchTasks = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          `${API}/tasks`,
          {
            headers: {
              authorization:
                token,
            },
          }
        );

      setTasks(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     ADD TASK
  ========================= */

  const addTask = async () => {
    if (!task.trim()) return;

    try {
      const token =
        localStorage.getItem("token");

      await axios.post(
        `${API}/tasks`,
        {
          title: task,
          assignedTo,
          dueDate,
        },
        {
          headers: {
            authorization:
              token,
          },
        }
      );

      setTask("");

      setAssignedTo("");

      setDueDate("");

      fetchTasks();
    } catch (error) {
      console.log(error);

      alert("Task Add Failed");
    }
  };

  /* =========================
     DELETE TASK
  ========================= */

  const deleteTask = async (
    id
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.delete(
        `${API}/tasks/${id}`,
        {
          headers: {
            authorization:
              token,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.log(error);

      alert("Delete Failed");
    }
  };

  /* =========================
     UPDATE STATUS
  ========================= */

  const updateStatus = async (
    id,
    status
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      await axios.put(
        `${API}/tasks/${id}`,
        {
          status,
        },
        {
          headers: {
            authorization:
              token,
          },
        }
      );

      fetchTasks();
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     LOGOUT
  ========================= */

  const logout = () => {
    localStorage.clear();

    setIsLoggedIn(false);

    setTasks([]);

    setUser(null);
  };

  /* =========================
     AUTO LOGIN
  ========================= */

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    const storedUser =
      localStorage.getItem("user");

    if (token) {
      setIsLoggedIn(true);

      if (storedUser) {
        setUser(
          JSON.parse(
            storedUser
          )
        );
      }

      fetchTasks();
    }
  }, []);

  /* =========================
     DASHBOARD STATS
  ========================= */

  const completedTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "Completed"
    ).length;

  const pendingTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "Pending"
    ).length;

  const inProgressTasks =
    tasks.filter(
      (task) =>
        task.status ===
        "In Progress"
    ).length;

  /* =========================
     LOGIN PAGE
  ========================= */

  if (!isLoggedIn) {
    return (
      <div className="container">
        <div className="login-box">
          <h1>
            Team Task Manager
          </h1>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />

          <select
            value={role}
            onChange={(e) =>
              setRole(
                e.target.value
              )
            }
          >
            <option>
              Member
            </option>

            <option>
              Admin
            </option>
          </select>

          <div className="btn-group">
            <button
              onClick={register}
            >
              Register
            </button>

            <button
              onClick={login}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* =========================
     DASHBOARD
  ========================= */

  return (
    <div className="dashboard">
      <div className="top-bar">
        <div>
          <h1>
            Team Task Dashboard
          </h1>

          <p>
            Role:{" "}
            {user?.role}
          </p>
        </div>

        <button onClick={logout}>
          Logout
        </button>
      </div>

      {/* STATS */}

      <div className="stats">
        <div className="stat-card">
          <h2>
            {tasks.length}
          </h2>

          <p>Total Tasks</p>
        </div>

        <div className="stat-card">
          <h2>
            {completedTasks}
          </h2>

          <p>Completed</p>
        </div>

        <div className="stat-card">
          <h2>
            {pendingTasks}
          </h2>

          <p>Pending</p>
        </div>

        <div className="stat-card">
          <h2>
            {inProgressTasks}
          </h2>

          <p>In Progress</p>
        </div>
      </div>

      {/* ADMIN ONLY */}

      {user?.role ===
        "Admin" && (
        <div className="task-input">
          <input
            type="text"
            placeholder="Enter Task"
            value={task}
            onChange={(e) =>
              setTask(
                e.target.value
              )
            }
          />

          <input
            type="text"
            placeholder="Assign To"
            value={assignedTo}
            onChange={(e) =>
              setAssignedTo(
                e.target.value
              )
            }
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) =>
              setDueDate(
                e.target.value
              )
            }
          />

          <button
            onClick={addTask}
          >
            Add Task
          </button>
        </div>
      )}

      {/* TASK LIST */}

      <div className="task-list">
        {tasks.map((item) => (
          <div
            className="task-card"
            key={item._id}
          >
            <div>
              <h3>
                {item.title}
              </h3>

              <p>
                Status:{" "}
                {item.status}
              </p>

              <p>
                Assigned To:{" "}
                {
                  item.assignedTo
                }
              </p>

              <p>
                Due Date:{" "}
                {item.dueDate}
              </p>

              {/* OVERDUE */}

              {item.dueDate &&
                new Date(
                  item.dueDate
                ) <
                  new Date() &&
                item.status !==
                  "Completed" && (
                  <p
                    style={{
                      color:
                        "red",
                      fontWeight:
                        "bold",
                    }}
                  >
                    Overdue
                  </p>
                )}
            </div>

            {/* ADMIN ONLY */}

            {user?.role ===
              "Admin" && (
              <div className="task-actions">
                <select
                  value={
                    item.status
                  }
                  onChange={(e) =>
                    updateStatus(
                      item._id,
                      e.target
                        .value
                    )
                  }
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
                  className="delete-btn"
                  onClick={() =>
                    deleteTask(
                      item._id
                    )
                  }
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;