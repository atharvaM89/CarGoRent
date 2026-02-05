import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function CarList() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [cars, setCars] = useState([]);

  useEffect(() => {
    fetchCars();
  }, [companyId]);

  const fetchCars = async () => {
    try {
      const response = await api.get(`/cars/company/${companyId}`);
      setCars(response.data);
    } catch (error) {
      console.error(error);
      alert("Failed to load cars");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <h2>Available Cars</h2>

      {cars.length === 0 && <p>No cars available.</p>}

      {cars.map((car) => (
        <div
          key={car.id}
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "12px",
          }}
        >
          <h3>{car.brand} {car.model}</h3>
          <p>Price per day: ₹{car.pricePerDay}</p>
          <p>Status: {car.availability ? "Available" : "Not Available"}</p>

          {car.availability && (
            <button
              onClick={() =>
                navigate("/order", {
                  state: {
                    carId: car.id,
                    companyId: car.companyId,
                    pricePerDay: car.pricePerDay,
                  },
                })
              }
            >
              Rent Car
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

export default CarList;