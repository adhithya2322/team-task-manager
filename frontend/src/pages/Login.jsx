import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const API_URL =
    "https://team-task-manager-production-997b.up.railway.app/api/auth";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/login`,
        formData
      );

      console.log("LOGIN RESPONSE:", response.data);

      // =========================
      // SAFELY STORE TOKEN
      // =========================

      if (response.data.token) {
        localStorage.setItem(
          "token",
          response.data.token
        );
      }

      // =========================
      // SAFELY STORE USER
      // =========================

      if (response.data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
      } else {
        console.log("User data missing");

        localStorage.removeItem("user");
      }

      alert("Login Successful");

      navigate("/dashboard");
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      if (error.response) {
        alert(
          error.response.data.message ||
            "Login Failed"
        );
      } else {
        alert("Server connection failed");
      }
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>
      </form>

      <br />

      <Link to="/register">
        Create account
      </Link>
    </div>
  );
}

export default Login;