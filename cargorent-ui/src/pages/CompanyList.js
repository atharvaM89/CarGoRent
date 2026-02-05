import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CompanyList() {
  const [companies, setCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/companies");
      setCompanies(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load companies");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "40px auto" }}>
      <h2>Available Car Rental Companies</h2>

      {companies.map((company) => (
        <div
          key={company.id}
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "12px",
            cursor: "pointer",
          }}
          onClick={() => navigate(`/cars/${company.id}`)}
        >
          <h3>{company.companyName}</h3>
          <p>{company.address}</p>
        </div>
      ))}
    </div>
  );
}

export default CompanyList;