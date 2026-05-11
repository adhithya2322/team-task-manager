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

      console.log(response.data);

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
        })
      );

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {
      console.log("LOGIN ERROR:", error);

      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Server connection failed");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl">
        
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Login
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Team Task Manager
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition duration-300"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Create account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;