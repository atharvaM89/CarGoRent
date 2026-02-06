import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 24px",
        backgroundColor: "#1f2937",
        color: "#fff",
      }}
    >
      <h3>CarGoRent</h3>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
          Register
        </Link>
        <Link to="/companies" style={{ color: "#fff", textDecoration: "none" }}>
          Companies
        </Link>
        <Link to="/orders" style={{ color: "#fff", textDecoration: "none" }}>
          My Orders
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
