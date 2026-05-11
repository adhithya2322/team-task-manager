import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL =
  "https://your-backend-url.up.railway.app";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Member");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          name,
          email,
          password,
          role,
        }
      );

      alert("Registration Successful");

      localStorage.setItem(
        "user",
        JSON.stringify(response.data)
      );

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <div
      style={{
        width: "350px",
        margin: "50px auto",
      }}
    >
      <h1>Register</h1>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <select
          value={role}
          onChange={(e) =>
            setRole(e.target.value)
          }
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <option value="Member">
            Member
          </option>

          <option value="Admin">
            Admin
          </option>
        </select>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          Register
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Already have an account?{" "}
        <Link to="/login">Login</Link>
      </p>
    </div>
  );
}