import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function UserRegister() {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const roleFromUrl = queryParams.get("role");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    if (!roleFromUrl) {
      alert("Invalid access to registration page");
      navigate("/");
      return;
    }
    setRole(roleFromUrl);
  }, [roleFromUrl, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users/register", {
        name,
        email,
        password,
        role,
      });

      alert("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto" }}>
      <h2>
        Register as {role === "COMPANY" ? "Company" : "User"}
      </h2>

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ width: "100%", marginBottom: "12px", padding: "8px" }}
        />

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

        <input
          type="text"
          value={role}
          disabled
          style={{
            width: "100%",
            marginBottom: "12px",
            padding: "8px",
            backgroundColor: "#f0f0f0",
          }}
        />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default UserRegister;