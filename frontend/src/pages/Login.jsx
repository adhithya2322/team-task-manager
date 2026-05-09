import React, { useState } from "react";
import axios from "axios";

const API =
  "https://team-task-manager-production-d8ce.up.railway.app";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // REGISTER
  const handleRegister = async () => {
    try {
      const res = await axios.post(
        `${API}/api/auth/register`,
        {
          email,
          password,
        }
      );

      alert("Registered Successfully");

      console.log(res.data);

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Register Failed"
      );
    }
  };

  // LOGIN
  const handleLogin = async () => {
    try {
      const res = await axios.post(
        `${API}/api/auth/login`,
        {
          email,
          password,
        }
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      alert("Login Successful");

      console.log(res.data);

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Login Failed"
      );
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f172a",
      }}
    >
      <h1
        style={{
          color: "white",
          marginBottom: "20px",
        }}
      >
        Task Manager Login
      </h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        style={{
          padding: "10px",
          marginBottom: "10px",
          width: "250px",
        }}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        style={{
          padding: "10px",
          marginBottom: "20px",
          width: "250px",
        }}
      />

      <div
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <button onClick={handleRegister}>
          Register
        </button>

        <button onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;