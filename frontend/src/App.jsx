import { useState } from "react";
import API from "./services/api";
import Dashboard from "./components/Dashboard";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loggedIn, setLoggedIn] = useState(false);

  const loginUser = async () => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);

      setLoggedIn(true);
    } catch (error) {
      alert("Login Failed");
    }
  };

  if (loggedIn) {
    return <Dashboard />;
  }

  return (
    <div style={{ padding: "50px" }}>
      <h1>Task Manager Login</h1>

      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={loginUser}>Login</button>
    </div>
  );
}

export default App;