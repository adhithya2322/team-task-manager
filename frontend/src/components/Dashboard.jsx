import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard() {

  const [tasks, setTasks] = useState([]);

  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] =
    useState("");

  const [assignedTo, setAssignedTo] =
    useState("");

  const [deadline, setDeadline] =
    useState("");

  const token =
    localStorage.getItem("token");

  // FETCH USERS
  const fetchUsers = async () => {

    try {

      const res = await API.get(
        "/auth/users",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  // FETCH TASKS
  const fetchTasks = async () => {

    try {

      const res = await API.get(
        "/tasks",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setTasks(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  // CREATE TASK
  const createTask = async () => {

    try {

      await API.post(
        "/tasks",
        {
          title,
          description,
          assignedTo,
          deadline,
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setTitle("");

      setDescription("");

      setAssignedTo("");

      setDeadline("");

      fetchTasks();

    } catch (error) {

      console.log(error);
    }
  };

  // COMPLETE TASK
  const completeTask = async (id) => {

    try {

      await API.put(
        `/tasks/${id}`,
        {
          status: "Completed",
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      fetchTasks();

    } catch (error) {

      console.log(error);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {

    try {

      await API.delete(
        `/tasks/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      fetchTasks();

    } catch (error) {

      console.log(error);
    }
  };

  // LOGOUT
  const logout = () => {

    localStorage.removeItem("token");

    window.location.reload();
  };

  useEffect(() => {

    fetchTasks();

    fetchUsers();

  }, []);

  return (

    <div style={{ padding: "30px" }}>

      <h1>Task Dashboard</h1>

      <button onClick={logout}>
        Logout
      </button>

      <br /><br />

      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) =>
          setTitle(e.target.value)
        }
      />

      <br /><br />

      <input
        type="text"
        placeholder="Task Description"
        value={description}
        onChange={(e) =>
          setDescription(e.target.value)
        }
      />

      <br /><br />

      <input
        type="date"
        value={deadline}
        onChange={(e) =>
          setDeadline(e.target.value)
        }
      />

      <br /><br />

      <select
        value={assignedTo}
        onChange={(e) =>
          setAssignedTo(e.target.value)
        }
      >

        <option value="">
          Select Member
        </option>

        {users.map((user) => (

          <option
            key={user._id}
            value={user._id}
          >
            {user.name} ({user.role})
          </option>

        ))}
      </select>

      <br /><br />

      <button onClick={createTask}>
        Create Task
      </button>

      <hr />

      {tasks.map((task) => (

        <div
          key={task._id}
          style={{
            border: "1px solid gray",
            padding: "15px",
            marginBottom: "15px",
          }}
        >

          <h3>{task.title}</h3>

          <p>{task.description}</p>

          <p>
            Status: {task.status}
          </p>

          <p>
            Deadline:
            {" "}
            {task.deadline
              ? new Date(
                  task.deadline
                ).toLocaleDateString()
              : "No Deadline"}
          </p>

          {
            task.status !==
              "Completed" &&
            task.deadline &&
            new Date(task.deadline) <
              new Date() && (

              <p
                style={{
                  color: "red",
                  fontWeight: "bold",
                }}
              >
                Overdue Task
              </p>
            )
          }

          <p>
            Assigned To:
            {" "}
            {task.assignedTo
              ? task.assignedTo.name
              : "Not Assigned"}
          </p>

          {
            task.status !==
              "Completed" && (

              <button
                onClick={() =>
                  completeTask(task._id)
                }
              >
                Mark Completed
              </button>
            )
          }

          <br /><br />

          <button
            onClick={() =>
              deleteTask(task._id)
            }
          >
            Delete Task
          </button>

        </div>
      ))}
    </div>
  );
}

export default Dashboard;