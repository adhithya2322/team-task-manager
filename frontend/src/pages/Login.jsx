import React, { useState } from "react";
import API from "../services/api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // LOGIN
  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      alert("Login Successful");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      alert("Login Failed");
    }
  };

  // REGISTER
  const handleRegister = async () => {
    try {
      const res = await API.post("/auth/register", {
        email,
        password,
      });

      alert("Registered Successfully");
      console.log(res.data);
    } catch (err) {
      console.log(err);
      alert("Register Failed");
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
        background: "#0b1020",
        color: "white",
      }}
    >
      <h1>Task Manager Login</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          margin: "10px",
          padding: "10px",
          width: "250px",
        }}
      />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          margin: "10px",
          padding: "10px",
          width: "250px",
        }}
      />

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={handleLogin}>Login</button>

        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Login;