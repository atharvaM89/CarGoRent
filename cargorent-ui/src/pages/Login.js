import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      // 🔥 THIS WAS MISSING
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);

      navigate("/orders");
    } catch (error) {
      console.error(error);
      alert("Invalid email or password");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "80px auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;