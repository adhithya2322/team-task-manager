import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Admin",
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
        `${API_URL}/register`,
        formData
      );

      console.log(response.data);

      alert("Registration Successful");

      navigate("/");
    } catch (error) {
      console.log("REGISTER ERROR:", error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server connection failed");
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <br />
        <br />

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

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="Admin">Admin</option>
          <option value="Member">Member</option>
        </select>

        <br />
        <br />

        <button type="submit">Register</button>
      </form>

      <br />

      <Link to="/">Login</Link>
    </div>
  );
}

export default Register;