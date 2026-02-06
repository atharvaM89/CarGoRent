import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <h1>Welcome to CarGoRent</h1>
      <p>Select how you want to continue</p>

      <button onClick={() => navigate("/register?role=CUSTOMER")}>
        Register as User
      </button>

      <button onClick={() => navigate("/register?role=COMPANY")}>
        Register as Company
      </button>

      <hr style={{ width: "200px", margin: "20px 0" }} />

      <button onClick={() => navigate("/login")}>Login</button>
    </div>
  );
}

export default LandingPage;