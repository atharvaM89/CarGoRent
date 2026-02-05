import { useState } from "react";
import api from "../services/api";

function UserRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users/register", formData);
      alert("User registered successfully");
      setFormData({
        name: "",
        email: "",
        password: "",
        role: "CUSTOMER",
      });
    } catch (error) {
      alert("Registration failed");
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h2>User Registration</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br /><br />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br /><br />

        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="CUSTOMER">Customer</option>
          <option value="COMPANY">Company</option>
        </select>
        <br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default UserRegister;